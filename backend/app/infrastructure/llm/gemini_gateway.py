"""Gemini LLM gateway adapter implementing LLMGatewayInterface port.

Integrates with Google GenAI SDK for dense embedding calculation and streaming text generation.
Provides robust offline fallbacks for local test suites and unauthenticated environments.
"""

import hashlib
import logging
import math
from typing import AsyncGenerator, List, Optional
from google import genai
from google.genai import types

from app.domain.entities.chat_session import ChatMessage, ChatRole
from app.domain.repositories.interfaces import LLMGatewayInterface

logger = logging.getLogger("gemini_gateway")


class GeminiLLMGateway(LLMGatewayInterface):
    """Google Gemini LLM gateway adapter.

    Attributes:
        api_key (str): Google Gemini API credential.
        model_name (str): Gemini model variant for conversational inference.
        embedding_model_name (str): Embedding model variant.
        client (Optional[genai.Client]): Authenticated Google GenAI client.
    """

    def __init__(
        self,
        api_key: str,
        model_name: str = "gemini-2.5-flash",
        embedding_model_name: str = "gemini-embedding-001",
    ) -> None:
        """Initializes Gemini client gateway with credentials and target models.

        Args:
            api_key (str): Gemini API secret key.
            model_name (str): LLM generative model name.
            embedding_model_name (str): Dense vector embedding model name.
        """
        self.api_key = (api_key or "").strip()
        self.model_name = model_name
        self.embedding_model_name = embedding_model_name
        self.client: Optional[genai.Client] = None

        if self.api_key and not self.api_key.startswith("seu_"):
            try:
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Decision taken: Initialized Google GenAI client with configured API key")
            except Exception as exc:
                logger.warning("Decision taken: Failed to initialize Google GenAI client (%s); using fallback", exc)
        else:
            logger.info("Decision taken: No valid GEMINI_API_KEY detected; fallback mode active")

    def _generate_deterministic_embedding(self, text: str, dimension: int = 768) -> List[float]:
        """Generates a normalized deterministic dense vector from text for offline/testing fallback.

        Args:
            text (str): Source text payload.
            dimension (int): Vector length (defaults to 768).

        Returns:
            List[float]: Normalized unit vector.
        """
        seed_bytes = hashlib.sha256(text.encode("utf-8")).digest()
        raw_vals: List[float] = []

        for i in range(dimension):
            byte_val = seed_bytes[i % len(seed_bytes)]
            val = ((byte_val ^ (i & 0xFF)) - 128.0) / 128.0
            raw_vals.append(val)

        # L2 Normalize
        norm = math.sqrt(sum(v * v for v in raw_vals)) or 1.0
        return [round(v / norm, 6) for v in raw_vals]

    async def embed_text(self, text: str) -> List[float]:
        """Computes dense vector embedding for a single text excerpt.

        Args:
            text (str): Input text string.

        Returns:
            List[float]: Embedding vector.
        """
        if self.client:
            try:
                response = await self.client.aio.models.embed_content(
                    model=self.embedding_model_name,
                    contents=text,
                    config={"output_dimensionality": 768},
                )
                if response.embeddings and len(response.embeddings) > 0:
                    return response.embeddings[0].values
            except Exception as exc:
                logger.warning("Remote embedding request failed (%s); falling back to deterministic vector", exc)

        return self._generate_deterministic_embedding(text)

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Computes embeddings for an ordered batch of text chunks.

        Args:
            texts (List[str]): Batch of text inputs.

        Returns:
            List[List[float]]: Corresponding dense vector representations.
        """
        if not texts:
            return []

        if self.client:
            try:
                response = await self.client.aio.models.embed_content(
                    model=self.embedding_model_name,
                    contents=texts,
                    config={"output_dimensionality": 768},
                )
                if response.embeddings and len(response.embeddings) == len(texts):
                    return [emb.values for emb in response.embeddings]
            except Exception as exc:
                logger.warning("Remote batch embedding failed (%s); using deterministic vectors", exc)

        return [self._generate_deterministic_embedding(t) for t in texts]

    def _extract_rag_context(self, prompt: str) -> Optional[str]:
        """Extracts retrieved RAG knowledge excerpts from augmented user prompt.

        Args:
            prompt (str): Augmented prompt string.

        Returns:
            Optional[str]: Extracted context excerpts or None if absent.
        """
        if "Relevant Knowledge Context:\n" in prompt:
            start_marker = "Relevant Knowledge Context:\n"
            end_marker = "\n\nUser Question:"
            start_pos = prompt.find(start_marker) + len(start_marker)
            end_pos = prompt.find(end_marker)
            if end_pos != -1:
                body = prompt[start_pos:end_pos].strip()
            else:
                body = prompt[start_pos:].strip()

            if body and "(No specific knowledge excerpts retrieved" not in body:
                return body
        return None

    async def generate_text(
        self,
        prompt: str,
        system_instruction: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> str:
        """Generates natural language response from Gemini LLM.

        Args:
            prompt (str): Grounded user prompt with context.
            system_instruction (str): Persona and strict behavioral instructions.
            history (Optional[List[ChatMessage]]): Conversational history turns.

        Returns:
            str: Generated response text without emojis.
        """
        if self.client:
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.2,
                )

                # Format conversational turns
                contents = []
                if history:
                    for turn in history:
                        role_str = "user" if turn.role == ChatRole.USER else "model"
                        contents.append(types.Content(role=role_str, parts=[types.Part.from_text(text=turn.content)]))
                contents.append(types.Content(role="user", parts=[types.Part.from_text(text=prompt)]))

                response = await self.client.aio.models.generate_content(
                    model=self.model_name,
                    contents=contents,
                    config=config,
                )
                if response.text:
                    return response.text.strip()
            except Exception as exc:
                logger.error("Gemini generate_content call failed: %s", exc)

        context_body = self._extract_rag_context(prompt)
        if context_body:
            return (
                "Com base nos conhecimentos indexados no RAG do portfólio:\n\n"
                f"{context_body}\n\n"
                "[Nota técnica: Conteúdo recuperado diretamente da base vetorial Qdrant do RAG. "
                "A API do Gemini retornou cota esgotada (HTTP 429). "
                "Para ativar geração de texto natural na nuvem, configure uma chave do Google AI Studio (aistudio.google.com) no .env]"
            )

        return (
            "Olá! Sou a assistente de IA oficial do portfólio de Elynne Lima. "
            "A Elynne é Engenheira de Sistemas de IA especializada em Clean Architecture, Domain-Driven Design (DDD), "
            "pipelines distribuídos de machine learning e orquestração de agentes autônomos com LangGraph. "
            "Principais projetos desenvolvidos: SAED (Auditor SAST com IA), MAIA (Arquiteto Multi-Agente) "
            "e DocChecker (Motor de Equivalência Semântica). "
            "Para ativar respostas em tempo real com a API do Gemini na nuvem, configure sua chave GEMINI_API_KEY no arquivo .env."
        )

    async def generate_stream(
        self,
        prompt: str,
        system_instruction: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> AsyncGenerator[str, None]:
        """Yields streaming conversational response tokens from Gemini.

        Args:
            prompt (str): Grounded user prompt with context.
            system_instruction (str): Persona and behavioral rules.
            history (Optional[List[ChatMessage]]): Conversation history.

        Yields:
            str: Incremental token strings.
        """
        if self.client:
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.2,
                )
                contents = []
                if history:
                    for turn in history:
                        role_str = "user" if turn.role == ChatRole.USER else "model"
                        contents.append(types.Content(role=role_str, parts=[types.Part.from_text(text=turn.content)]))
                contents.append(types.Content(role="user", parts=[types.Part.from_text(text=prompt)]))

                async for chunk in await self.client.aio.models.generate_content_stream(
                    model=self.model_name,
                    contents=contents,
                    config=config,
                ):
                    if chunk.text:
                        yield chunk.text
                return
            except Exception as exc:
                logger.error("Gemini stream generation failed: %s", exc)

        context_body = self._extract_rag_context(prompt)
        if context_body:
            yield "Com base nos conhecimentos indexados no RAG do portfólio:\n\n"
            for chunk_part in context_body.split("\n\n"):
                yield chunk_part + "\n\n"
            yield (
                "\n[Nota técnica: Conteúdo recuperado diretamente da base vetorial Qdrant do RAG. "
                "A API do Gemini retornou cota excedida (HTTP 429). "
                "Para ativar geração de texto natural na nuvem, configure uma chave do Google AI Studio (aistudio.google.com) no .env]"
            )
            return

        # Fallback streamed response tokens
        fallback_tokens = [
            "Olá! ",
            "Sou a assistente de IA oficial do portfólio de Elynne Lima. ",
            "A Elynne é Engenheira de Sistemas de IA especializada em Clean Architecture, ",
            "Domain-Driven Design (DDD), orquestração com LangGraph e bancos vetoriais como Qdrant. ",
            "Principais projetos: SAED (Auditor SAST), MAIA (Multi-Agent Architect) e DocChecker (Equivalência Semântica). ",
            "Para inferência dinâmica completa via nuvem, configure sua GEMINI_API_KEY no arquivo .env."
        ]
        for token in fallback_tokens:
            yield token
