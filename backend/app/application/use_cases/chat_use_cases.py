"""Chat use cases module utilizing LangGraph and Retrieval-Augmented Generation.

Orchestrates conversational retrieval, state graphs, context compilation, and Gemini inference.
"""

import logging
from typing import AsyncGenerator, Dict, List, Optional, TypedDict
from langgraph.graph import StateGraph, END

from app.domain.entities.chat_session import ChatMessage, ChatRole
from app.domain.entities.document_chunk import DocumentChunk
from app.domain.repositories.interfaces import (
    VectorStoreRepository,
    LLMGatewayInterface,
)
from app.application.dtos.chat_dto import ChatResponseDTO

logger = logging.getLogger("chat_use_cases")

SYSTEM_PERSONA_INSTRUCTION = """You are the official AI Assistant for Elynne Lima's engineering portfolio.
Elynne Lima is an AI Systems Engineer specialized in distributed machine learning pipelines, autonomous LLM agent architectures (LangGraph), Clean Architecture, and Domain-Driven Design (DDD).

Key projects built by Elynne:
1. SAED (AI Augmented SAST Auditor): Static application security testing with local LLM triage, eliminating false positives and emitting SARIF reports.
2. MAIA (Multi-Agent Intelligent Architect): Multi-agent orchestrator with deterministic task decomposition and strict schema contracts.
3. DocChecker (Doc Semantic Equivalence Engine): Legal compliance and document equivalence engine utilizing async RAG, dense vector search (Qdrant), and PaddleOCR.
4. Distributed Video Inference Pipeline: Distributed video processing with RabbitMQ, YOLOv8, and ONNX Runtime.
5. Telemetry Anomaly Autonomous Agent: SRE agent correlating Prometheus metrics and OpenTelemetry traces with GGUF inference.

Technical Articles (Elyy.init):
- Deep dives on Clean Architecture in Python/FastAPI microservices, deterministic agent execution, and production RAG observability.

Personal Interests & Hobbies:
- Cozy gaming: Stardew Valley, Pokémon, Paleo Pines.
- Science & Lore: Paleontology, Biomimetic Engineering, Fantasy (Ella Enchanted).
- Sensory: Specialty coffees and manual brewing methods.
- Currently reading: 'The Man in the High Castle' by Philip K. Dick.

CRITICAL RULES:
- STRICT ZERO EMOJIS: Do NOT output any emojis under any circumstance.
- LANGUAGE: Respond in Brazilian Portuguese (pt-BR) by default when asked in Portuguese, or match the user's language.
- TONE: Technically precise, concise, articulate, and pragmatic (ISTP personality).
- GROUNDING: Base your answers strictly on the retrieved knowledge context provided. If a specific private detail is not in the context, politely state that you do not have that information recorded in Elynne's portfolio database.
"""


class AgentState(TypedDict):
    """LangGraph state representation for conversational RAG workflow."""

    session_id: str
    query: str
    history: List[ChatMessage]
    retrieved_chunks: List[DocumentChunk]
    context_text: str
    sources: List[str]
    answer: str


class LangGraphRAGChatUseCase:
    """Conversational RAG use case powered by LangGraph state machine and Gemini.

    Coordinates semantic retrieval from Qdrant and response generation with streaming support.

    Attributes:
        vector_store_repository (VectorStoreRepository): Dense vector retrieval interface.
        llm_gateway (LLMGatewayInterface): Gemini LLM client for embeddings and generation.
    """

    def __init__(
        self,
        vector_store_repository: VectorStoreRepository,
        llm_gateway: LLMGatewayInterface,
    ) -> None:
        """Initializes the chat use case with required ports.

        Args:
            vector_store_repository (VectorStoreRepository): Vector storage port.
            llm_gateway (LLMGatewayInterface): LLM generation port.
        """
        self.vector_store_repository = vector_store_repository
        self.llm_gateway = llm_gateway
        self._compiled_graph = self._build_langgraph_workflow()

    def _build_langgraph_workflow(self):
        """Builds and compiles the deterministic LangGraph state machine.

        Returns:
            CompiledStateGraph: Compiled LangGraph executable graph.
        """
        workflow = StateGraph(AgentState)

        # Register processing nodes
        workflow.add_node("retrieve_context", self._node_retrieve_context)
        workflow.add_node("generate_answer", self._node_generate_answer)

        # Establish deterministic control flow: START -> retrieve_context -> generate_answer -> END
        workflow.set_entry_point("retrieve_context")
        workflow.add_edge("retrieve_context", "generate_answer")
        workflow.add_edge("generate_answer", END)

        return workflow.compile()

    async def _node_retrieve_context(self, state: AgentState) -> Dict[str, object]:
        """Node 1: Retrieves top relevant knowledge chunks using vector embeddings.

        Args:
            state (AgentState): Current graph execution state.

        Returns:
            Dict[str, object]: Updated state keys.
        """
        query = state["query"]
        logger.info(
            "Step started: Retrieving semantic context for query='%s' session_id=%s",
            query,
            state["session_id"],
        )

        query_vector = await self.llm_gateway.embed_text(query)
        chunks = await self.vector_store_repository.search_similar_chunks(
            query_vector=query_vector,
            limit=4,
            score_threshold=None,
        )

        sources: List[str] = []
        context_parts: List[str] = []

        for chunk in chunks:
            doc_title = chunk.metadata.get("title", "Portfolio Knowledge")
            if doc_title not in sources:
                sources.append(doc_title)
            context_parts.append(f"[{doc_title}]: {chunk.content}")

        context_text = "\n\n".join(context_parts)
        logger.info(
            "Decision taken: Found %d relevant chunks across sources=%s",
            len(chunks),
            sources,
        )

        return {
            "retrieved_chunks": chunks,
            "context_text": context_text,
            "sources": sources,
        }

    async def _node_generate_answer(self, state: AgentState) -> Dict[str, object]:
        """Node 2: Generates natural language answer using Gemini LLM.

        Args:
            state (AgentState): Current graph execution state.

        Returns:
            Dict[str, object]: Generated answer state key.
        """
        logger.info(
            "Step started: Invoking Gemini for query='%s' session_id=%s",
            state["query"],
            state["session_id"],
        )

        augmented_prompt = self._format_augmented_prompt(
            query=state["query"],
            context_text=state.get("context_text", ""),
        )

        answer = await self.llm_gateway.generate_text(
            prompt=augmented_prompt,
            system_instruction=SYSTEM_PERSONA_INSTRUCTION,
            history=state.get("history", []),
        )

        logger.info(
            "Step concluded: LLM response generated successfully for session_id=%s",
            state["session_id"],
        )
        return {"answer": answer}

    def _format_augmented_prompt(self, query: str, context_text: str) -> str:
        """Formats user prompt with grounding context.

        Args:
            query (str): User question.
            context_text (str): Retrieved factual excerpts.

        Returns:
            str: Grounded prompt.
        """
        if not context_text:
            return f"User Question: {query}\n(No specific knowledge excerpts retrieved for this query.)"

        return (
            f"Relevant Knowledge Context:\n{context_text}\n\n"
            f"User Question: {query}\n\n"
            "Answer clearly and concisely based on the context above. Remember: zero emojis."
        )

    async def execute_sync(
        self,
        session_id: str,
        query: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> ChatResponseDTO:
        """Executes full LangGraph workflow synchronously.

        Args:
            session_id (str): Unique conversational session.
            query (str): User input prompt.
            history (Optional[List[ChatMessage]]): Conversational history.

        Returns:
            ChatResponseDTO: Final answer and cited knowledge sources.
        """
        initial_state: AgentState = {
            "session_id": session_id,
            "query": query,
            "history": history or [],
            "retrieved_chunks": [],
            "context_text": "",
            "sources": [],
            "answer": "",
        }

        final_state = await self._compiled_graph.ainvoke(initial_state)
        return ChatResponseDTO(
            session_id=session_id,
            answer=final_state["answer"],
            sources=final_state["sources"],
        )

    async def execute_stream(
        self,
        session_id: str,
        query: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> AsyncGenerator[str, None]:
        """Executes retrieval and yields streaming tokens from Gemini.

        Args:
            session_id (str): Visitor session identifier.
            query (str): User question.
            history (Optional[List[ChatMessage]]): Conversational turn history.

        Yields:
            str: Streaming response tokens.
        """
        logger.info(
            "Step started: Streaming RAG generation for query='%s' session_id=%s",
            query,
            session_id,
        )

        # 1. Retrieve context
        query_vector = await self.llm_gateway.embed_text(query)
        chunks = await self.vector_store_repository.search_similar_chunks(
            query_vector=query_vector,
            limit=4,
            score_threshold=None,
        )

        context_parts = [f"[{c.metadata.get('title', 'Context')}]: {c.content}" for c in chunks]
        context_text = "\n\n".join(context_parts)
        augmented_prompt = self._format_augmented_prompt(query, context_text)

        # 2. Stream generation from Gemini
        async for token in self.llm_gateway.generate_stream(
            prompt=augmented_prompt,
            system_instruction=SYSTEM_PERSONA_INSTRUCTION,
            history=history,
        ):
            yield token

        logger.info(
            "Step concluded: Streaming generation completed for session_id=%s",
            session_id,
        )
