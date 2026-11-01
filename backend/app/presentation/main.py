"""Main FastAPI application entrypoint with Clean Architecture configuration."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.infrastructure.database.config import engine, Base, SessionLocal, settings
from app.infrastructure.database.models import (
    AdminUserModel,
    ProjectModel,
    WishlistItemModel,
    ConsumedMediaModel,
    HobbyModel,
)
from app.infrastructure.security.password_hasher import BcryptPasswordHasher
from app.domain.exceptions.domain_exceptions import (
    DomainValidationError,
    EntityNotFoundException,
    AuthenticationFailedException,
)
from app.presentation.routers.auth_router import router as auth_router
from app.presentation.routers.projects_router import router as projects_router
from app.presentation.routers.wishlist_router import router as wishlist_router
from app.presentation.routers.media_router import router as media_router
from app.presentation.routers.hobbies_router import router as hobbies_router
from app.presentation.routers.spotify_router import router as spotify_router
from app.presentation.routers.rag_router import router as rag_router
from app.presentation.routers.chat_router import router as chat_router
from app.infrastructure.database.models import RAGDocumentModel
from app.presentation.dependencies import vector_store, gemini_gateway
from app.application.use_cases.rag_use_cases import TextChunker
from app.domain.entities.document_chunk import DocumentChunk
import uuid


def seed_initial_database():
    """Seeds relational database with initial administrator and portfolio content."""
    db = SessionLocal()
    try:
        hasher = BcryptPasswordHasher()

        # 1. Seed Administrator User
        admin_user = (
            db.query(AdminUserModel)
            .filter(AdminUserModel.username == settings.admin_default_username.lower())
            .first()
        )
        if not admin_user:
            admin_user = AdminUserModel(
                id="admin-default-id",
                username=settings.admin_default_username.lower(),
                password_hash=hasher.hash_password(settings.admin_default_password),
            )
            db.add(admin_user)

        # 2. Seed Default Consumed Media (Featuring 'The Man in the High Castle')
        media_count = db.query(ConsumedMediaModel).count()
        if media_count == 0:
            media = ConsumedMediaModel(
                id="default-consumed-media",
                reading_title="The Man in the High Castle",
                reading_author="Philip K. Dick",
                reading_category="Ficção Científica & História Alternativa",
                reading_cover_url="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1450379461i/2165.jpg",
                reading_reference_url="https://www.amazon.com.br/s?k=The+Man+in+the+High+Castle+Philip+K.+Dick",
                reading_status="Lendo Atualmente",
                watching_title="Ficção Científica & Animação",
                watching_subtitle="Séries, Lore & Documentários Tech",
                watching_cover_url="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=80",
                watching_category="Séries & Mídia",
            )
            db.add(media)

        # 3. Seed Initial Projects
        project_count = db.query(ProjectModel).count()
        if project_count == 0:
            initial_projects = [
                ProjectModel(
                    id="proj-doc-semantic",
                    title="Doc Semantic Equivalence Engine",
                    description="Motor de equivalência semântica e conformidade legal utilizando RAG assíncrono, busca vetorial densa e OCR de precisão.",
                    tags=["FastAPI", "LangGraph", "vLLM", "Qdrant", "PaddleOCR"],
                    github_url="https://github.com/Elyyihz/doc-semantic-equivalence-engine",
                    featured=True,
                    icon_slug="code",
                ),
                ProjectModel(
                    id="proj-video-pipeline",
                    title="Distributed Video Inference Pipeline",
                    description="Pipeline distribuído para processamento de vídeo e detecção de objetos em lote com workers desacoplados via mensageria AMQP.",
                    tags=["FastAPI", "RabbitMQ", "YOLOv8", "ONNX Runtime", "PostgreSQL"],
                    github_url="https://github.com/Elyyihz/distributed-video-inference-pipeline",
                    featured=True,
                    icon_slug="code",
                ),
                ProjectModel(
                    id="proj-telemetry-agent",
                    title="Telemetry Anomaly Autonomous Agent",
                    description="Agente autônomo com inferência local que correlaciona métricas time-series e traces distribuídos para diagnóstico SRE.",
                    tags=["Python", "LangGraph", "llama.cpp (GGUF)", "OpenTelemetry", "Prometheus"],
                    github_url="https://github.com/Elyyihz/telemetry-anomaly-autonomous-agent",
                    featured=False,
                    icon_slug="activity",
                ),
                ProjectModel(
                    id="proj-sast-auditor",
                    title="AI Augmented SAST Auditor",
                    description="Auditor estático de segurança com validação por LLM local em pipelines de CI/CD, eliminando falsos positivos e gerando SARIF.",
                    tags=["Python CLI", "Bandit", "GGUF Local", "GitHub Actions"],
                    github_url="https://github.com/Elyyihz/ai-augmented-sast-auditor",
                    featured=False,
                    icon_slug="lock",
                ),
            ]
            db.add_all(initial_projects)

        # 4. Seed Initial Hobbies
        hobby_count = db.query(HobbyModel).count()
        if hobby_count == 0:
            initial_hobbies = [
                HobbyModel(id="hobby-1", name="Stardew Valley", category="Cozy Gaming", icon_slug="plant"),
                HobbyModel(id="hobby-2", name="Pokémon", category="Gaming & Lore", icon_slug="gamepad"),
                HobbyModel(id="hobby-3", name="Paleontologia / Paleo Pines", category="Ciência & Fósseis", icon_slug="bone"),
                HobbyModel(id="hobby-4", name="Engenharia Biomimética", category="Bioengenharia", icon_slug="hexagon"),
                HobbyModel(id="hobby-5", name="Ella Enchanted", category="Fantasia & Clássicos", icon_slug="wand"),
                HobbyModel(id="hobby-6", name="Cafés Especiais", category="Sensorial & Barismo", icon_slug="coffee"),
            ]
            db.add_all(initial_hobbies)

        # 5. Seed Injected Wishlist Item
        wishlist_count = db.query(WishlistItemModel).count()
        if wishlist_count == 0:
            high_castle = WishlistItemModel(
                id="wish-high-castle",
                title="The Man in the High Castle",
                subtitle="Philip K. Dick",
                category="Livros",
                url="https://www.amazon.com.br/s?k=The+Man+in+the+High+Castle+Philip+K.+Dick",
                tag="Ficção Científica",
                is_fulfilled=False,
            )
            db.add(high_castle)

        db.commit()
    finally:
        db.close()


async def seed_initial_rag_documents():
    """Seeds default curated technical knowledge documents into relational and vector stores."""
    db = SessionLocal()
    try:
        rag_count = db.query(RAGDocumentModel).count()
        if rag_count == 0:
            chunker = TextChunker(chunk_size=500, chunk_overlap=80)
            seeds = [
                {
                    "id": "rag-saed",
                    "title": "SAED (AI Augmented SAST Auditor)",
                    "category": "project",
                    "content": (
                        "SAED é uma ferramenta avançada de auditoria de segurança estática aumentada por inteligência artificial. "
                        "Integrada a fluxos de CI/CD via GitHub Actions, ela elimina falsos positivos de ferramentas tradicionais "
                        "como Bandit utilizando triagem contextual por LLM e gera relatórios em formato SARIF compatíveis com o GitHub Security."
                    ),
                    "tags": ["Security", "SAST", "LLM", "SARIF"],
                },
                {
                    "id": "rag-maia",
                    "title": "MAIA (Multi-Agent Intelligent Architect)",
                    "category": "project",
                    "content": (
                        "MAIA é um orquestrador multi-agente inteligente construído sobre LangGraph. "
                        "Ele decompõe demandas complexas de engenharia em grafos determinísticos com validação estrita de contratos "
                        "entre agentes, garantindo ausência de alucinações e rastreabilidade total de decisões de software."
                    ),
                    "tags": ["MultiAgent", "LangGraph", "Architecture", "CleanCode"],
                },
                {
                    "id": "rag-docchecker",
                    "title": "DocChecker (Doc Semantic Equivalence Engine)",
                    "category": "project",
                    "content": (
                        "DocChecker é um motor de conformidade e equivalência semântica legal de documentos. "
                        "Utiliza OCR avançado com PaddleOCR, busca vetorial densa com Qdrant e RAG assíncrono para verificar "
                        "se contratos reestruturados preservam paridade semântica integral com minutas aprovadas."
                    ),
                    "tags": ["LegalTech", "RAG", "Qdrant", "FastAPI"],
                },
                {
                    "id": "rag-elyy-clean-arch",
                    "title": "Artigo Elyy.init: Clean Architecture e DDD em Microserviços",
                    "category": "article",
                    "content": (
                        "Artigo técnico publicado na Elyy.init explorando a implementação de Clean Architecture e DDD "
                        "em Python moderno com FastAPI e SQLAlchemy 2.0. Aborda a Regra de Dependência, isolamento do domínio puro, "
                        "interfaces de portas de persistência e testes rigorosos com TDD."
                    ),
                    "tags": ["CleanArchitecture", "DDD", "FastAPI", "TDD"],
                },
                {
                    "id": "rag-elyy-bio",
                    "title": "Perfil Técnico e Habilidades de Elynne Lima",
                    "category": "bio",
                    "content": (
                        "Elynne Lima é Engenheira de Sistemas de IA especializada em sistemas distribuídos de machine learning, "
                        "orquestração de agentes autônomos com LangGraph, bancos de vetores como Qdrant e Clean Architecture. "
                        "Personalidade analítica e pragmática (ISTP), com foco em alta performance e código limpo. "
                        "Hobbies e interesses: jogos acolhedores como Stardew Valley e Pokémon, paleontologia, cafés especiais e engenharia biomimética."
                    ),
                    "tags": ["Bio", "Engineer", "AI", "ISTP"],
                },
            ]

            for s in seeds:
                segments = chunker.split_text(s["content"])
                vectors = await gemini_gateway.embed_batch(segments)
                chunks = []
                for idx, (seg, vec) in enumerate(zip(segments, vectors)):
                    chk = DocumentChunk(
                        id=f"{s['id']}-chk-{idx}",
                        document_id=s["id"],
                        chunk_index=idx,
                        content=seg,
                        embedding=vec,
                        metadata={"title": s["title"], "category": s["category"], "tags": s["tags"]},
                    )
                    chunks.append(chk)

                await vector_store.upsert_chunks(chunks)

                doc_model = RAGDocumentModel(
                    id=s["id"],
                    title=s["title"],
                    content=s["content"],
                    category=s["category"],
                    chunk_count=len(chunks),
                    metadata_json=json.dumps({"tags": s["tags"]}),
                )
                db.add(doc_model)

            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle context creating tables and seeding initial aggregates."""
    Base.metadata.create_all(bind=engine)
    seed_initial_database()
    await seed_initial_rag_documents()
    yield


app = FastAPI(
    title="Elynne Portfolio Ecosystem API",
    version="1.0.0",
    description="Microserviço FastAPI estruturado em Clean Architecture e DDD para o ecossistema do site pessoal.",
    lifespan=lifespan,
)

# CORS Middleware enabling seamless communication with frontend Vite client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Domain Exception Handlers
@app.exception_handler(DomainValidationError)
async def domain_validation_exception_handler(_request: Request, exc: DomainValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.message, "error_type": "DomainValidationError"},
    )


@app.exception_handler(EntityNotFoundException)
async def entity_not_found_exception_handler(_request: Request, exc: EntityNotFoundException):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": exc.message, "error_type": "EntityNotFoundException"},
    )


@app.exception_handler(AuthenticationFailedException)
async def auth_failed_exception_handler(_request: Request, exc: AuthenticationFailedException):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": exc.message, "error_type": "AuthenticationFailedException"},
        headers={"WWW-Authenticate": "Bearer"},
    )


# Mount Presentation API Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(wishlist_router, prefix="/api/v1")
app.include_router(media_router, prefix="/api/v1")
app.include_router(hobbies_router, prefix="/api/v1")
app.include_router(spotify_router, prefix="/api/v1")
app.include_router(rag_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def healthcheck():
    """Healthcheck endpoint verifying microservice readiness."""
    return {"status": "ok", "service": "portfolio-backend", "version": "1.0.0"}
