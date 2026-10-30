# Site Pessoal & Portfólio — Elynne Lima

Ecossistema completo do site pessoal e portfólio profissional de **Elynne Lima** (AI Systems Engineer & Full-Stack Architect). Composto por um frontend reativo moderno em **React 18**, **TypeScript estrito**, **Vite** e **Tailwind CSS**, orquestrado conjuntamente com um microserviço backend em **Python 3.13**, **FastAPI**, **SQLAlchemy** e **PostgreSQL**, estruturado estritamente segundo os princípios de **Clean Architecture**, **Domain-Driven Design (DDD)** e **Test-Driven Development (TDD)**.

---

## 1. Design System

A interface visual adota um tema escuro imersivo (*deep dark mode*) com contraste refinado e realces em ciano e azul elétrico:

- **Fundo Base (Deep Backdrop):** `slate-950` (`#020617`) para imersão e profundidade.
- **Superfícies de Cartões (Card Surface):** `slate-900` (`#0f172a`) com cantos arredondados (`rounded-2xl`).
- **Estados Interativos / Hover:** `slate-800` (`#1e293b`).
- **Tipografia e Textos:** Corpo em `slate-300` (`#cbd5e1`), textos secundários em `slate-400` (`#94a3b8`) e títulos em `slate-50` (`#f8fafc`).
- **Bordas e Destaques:** Acentos em `cyan-400` (`#22d3ee`) e ações primárias em `blue-500` (`#3b82f6`).
- **Efeitos de Glow:** Sombras difusas `glow-cyan` e `glow-blue` para componentes em foco e cartões interativos.
- **Diretriz de Assets:** É terminantemente proibido o uso de emojis. Todos os ícones são SVGs inline implementados com a propriedade `currentColor` nos atributos de traçado para herdar cores reativas de hover e estados do Tailwind CSS.

---

## 2. Arquitetura do Backend (Clean Architecture & DDD)

O microserviço em `backend/` adota isolamento estrito entre camadas concêntricas segundo o diagrama canônico de Robert C. Martin e Eric Evans:

```
                  ┌─────────────────────────────────────┐
                  │      Apresentação / Frameworks      │
                  │   (FastAPI Routers, Lifespan, DI)   │
                  │  ┌───────────────────────────────┐  │
                  │  │     Infraestrutura Concreta   │  │
                  │  │  (SQLAlchemy, JWT, Bcrypt)    │  │
                  │  │  ┌─────────────────────────┐  │  │
                  │  │  │   Casos de Uso / Aplicação│ │  │
                  │  │  │  (ProjectUseCases, DTOs)│ │  │
                  │  │  │  ┌───────────────────┐  │ │  │
                  │  │  │  │   Domínio Puro    │  │ │  │
                  │  │  │  │(Entities, Repos)  │  │ │  │
                  │  │  │  └───────────────────┘  │ │  │
                  │  │  └─────────────────────────┘  │  │
                  │  └───────────────────────────────┘  │
                  └─────────────────────────────────────┘
```

### Ordem de Escrita (de dentro para fora)

A Regra de Dependência estipula que camadas internas jamais conhecem detalhes de implementação das camadas externas. Escrever de dentro para fora garante que cada artefato, no momento de sua criação, dependa exclusivamente de tipos já consolidados.

| Ordem | Camada | Arquivo(s) | Por quê essa ordem |
|---|---|---|---|
| 1 | Domínio — Exceções de Domínio | `backend/app/domain/exceptions/domain_exceptions.py` | Não depende de nada; define falhas invariantes de entidades e autenticação. |
| 2 | Domínio — Entidades (Entities) | `backend/app/domain/entities/project.py`<br>`backend/app/domain/entities/wishlist.py`<br>`backend/app/domain/entities/media.py`<br>`backend/app/domain/entities/hobby.py`<br>`backend/app/domain/entities/admin.py` | Dependem apenas de exceções do domínio e biblioteca padrão (`datetime`); isolam lógica de negócio pura, validações e a flag `is_fulfilled`. |
| 3 | Domínio — Portas de Repositório (Interfaces) | `backend/app/domain/repositories/interfaces.py` | Contratos abstratos (`typing.Protocol` / ABC) definindo o que o domínio exige para persistência, sem acoplar a bancos. |
| 4 | Aplicação — DTOs (Data Transfer Objects) | `backend/app/application/dtos/project_dto.py`<br>`backend/app/application/dtos/wishlist_dto.py`<br>`backend/app/application/dtos/media_dto.py`<br>`backend/app/application/dtos/hobby_dto.py`<br>`backend/app/application/dtos/auth_dto.py` | Schemas Pydantic v2 isolando payloads de entrada e saída com `ConfigDict(from_attributes=True)`. |
| 5 | Aplicação — Casos de Uso (Use Cases) | `backend/app/application/use_cases/project_use_cases.py`<br>`backend/app/application/use_cases/wishlist_use_cases.py`<br>`backend/app/application/use_cases/media_use_cases.py`<br>`backend/app/application/use_cases/hobby_use_cases.py`<br>`backend/app/application/use_cases/auth_use_cases.py` | Orquestram fluxo de negócio manipulando entidades através das portas de repositório; não importam framework HTTP nem ORM. |
| 6 | Infraestrutura — Segurança & Criptografia | `backend/app/infrastructure/security/password_hasher.py`<br>`backend/app/infrastructure/security/jwt_provider.py` | Implementações de hashing com `bcrypt` e emissão de tokens assinados com `PyJWT`. |
| 7 | Infraestrutura — Persistência Relacional | `backend/app/infrastructure/database/config.py`<br>`backend/app/infrastructure/database/models.py`<br>`backend/app/infrastructure/repositories/sqlalchemy_repositories.py` | Modelos relacionais SQLAlchemy (com colunas JSON e índices booleano) e repositórios concretos que cumprem as portas da camada 3. |
| 8 | Apresentação — Injeção de Dependências & Guardas | `backend/app/presentation/dependencies.py` | Monta instâncias dos casos de uso e injeta guarda de autenticação JWT Bearer para rotas protegidas. |
| 9 | Apresentação — Roteadores HTTP (Controllers) | `backend/app/presentation/routers/auth_router.py`<br>`backend/app/presentation/routers/projects_router.py`<br>`backend/app/presentation/routers/wishlist_router.py`<br>`backend/app/presentation/routers/media_router.py`<br>`backend/app/presentation/routers/hobbies_router.py`<br>`backend/app/presentation/routers/spotify_router.py` | Expõe endpoints RESTful com validação de status HTTP, OpenAPI Swagger e tratamento de erros. |
| 10 | Apresentação — Aplicação Principal & Lifespan | `backend/app/presentation/main.py` | Inicializa FastAPI, registra middlewares CORS, gerencia ciclo de vida (startup seeding de admin e dados iniciais) e handlers de exceção. |

---

### Ordem de Leitura (de fora para dentro)

O caminho de leitura inverso permite que um desenvolvedor sem conhecimento prévio compreenda a arquitetura partindo do ponto de entrada da requisição até a regra de negócio central:

| Ordem | Pergunta que você está respondendo | Arquivo(s) |
|---|---|---|
| 1 | Quais rotas REST existem e quais contratos OpenAPI expõem? | `backend/app/presentation/main.py` → `backend/app/presentation/routers/*.py` |
| 2 | Como as dependências e o token JWT são injetados nas rotas? | `backend/app/presentation/dependencies.py` |
| 3 | O que a rota manda executar em termos de regra de negócio? | `backend/app/application/use_cases/*_use_cases.py` |
| 4 | Com quais contratos e modelos o caso de uso interage? | `backend/app/domain/repositories/interfaces.py` e `backend/app/domain/entities/*.py` |
| 5 | Como a persistência e a segurança são cumpridas de verdade? | `backend/app/infrastructure/repositories/sqlalchemy_repositories.py` e `backend/app/infrastructure/security/*.py` |
| 6 | Como exceções de domínio são convertidas para respostas HTTP limpas? | `backend/app/domain/exceptions/domain_exceptions.py` e handlers em `backend/app/presentation/main.py` |

> **Regra de ouro:** Escreve-se de dentro para fora porque o domínio não pode depender de nenhum detalhe externo; lê-se de fora para dentro porque é assim que um engenheiro navega um sistema não familiar até alcançar o núcleo da regra de negócio.

---

## 3. Integração Spotify Web API (OAuth 2.0 & TypeScript Estrito)

A reprodução e acompanhamento de faixas musicais opera de forma segura e reativa:

- **Validação Estrita de Ambiente:** `src/config/envValidator.ts` valida em tempo de execução a presença de `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI` e `SPOTIFY_REFRESH_TOKEN`.
- **Fluxo de Autorização e Renovação Automática:**
  - `GET /api/v1/spotify/login`: Redireciona o usuário para consentimento no Spotify com escopo `user-read-currently-playing`.
  - `GET /callback` (capturado pelo componente `<SpotifyCallbackHandler />`): Recebe o código de autorização e obtém os tokens de acesso.
  - `SpotifyOAuthManager` (`src/services/spotifyOAuth.ts`): Realiza o refresh automático do access token em segundo plano caso o token tenha expirado.
- **Tratamento de Fallback HTTP 204:** Quando nenhuma faixa estiver tocando no reprodutor ou o cliente do Spotify estiver fechado, a aplicação exibe um estado visual de repouso ("Nenhuma faixa tocando no momento") sem gerar erros no console.
- **Card Minimalista em Tailwind:** `<SpotifyPlayerCard />` renderiza a capa do álbum com glow reativo, barra de progresso em tempo real, artistas vinculados e indicador sonoro em SVG inline.

---

## 4. Modo Terminal macOS Zsh Interativo

Para demonstrar proficiência em engenharia de sistemas e proporcionar uma experiência interativa aos visitantes, foi desenvolvido um emulador de terminal macOS:

- **Atalho Global:** Pressione `Ctrl + \`` (ou `Cmd + \`` no macOS) ou `Ctrl + Shift + T` para abrir o terminal a qualquer momento.
- **Acesso pelo Header e Rodapé:** Botão com ícone de terminal presente na `Navbar` e no `Footer`.
- **Barra de Janela macOS:** Inclui botões vermelho, amarelo e verde (*traffic lights*) e título com prompt `elyyihz — -zsh — 80x24`.
- **Navegação de Histórico:** Setas para cima (`ArrowUp`) e para baixo (`ArrowDown`) navegam pelo histórico de comandos digitados.
- **Comandos Suportados:**
  - `help`: Lista os comandos disponíveis.
  - `whoami`: Exibe o perfil, stack técnica, localização e MBTI.
  - `projects`: Lista os principais projetos do portfólio.
  - `skills`: Exibe frameworks de IA, backend e observabilidade.
  - `spotify`: Diagnóstico do status da integração Spotify Web API.
  - `theme`: Detalhes das cores do Design System (Deep Blue & Cyan).
  - `clear`: Limpa o buffer de tela do terminal.
  - `sudo`: Elevação simulada de privilégios com confirmação.
  - `exit`: Fecha a janela do terminal.

---

## 5. Painel de Controle Administrativo (Admin Dashboard)

O painel administrativo privado viabiliza a gestão completa e imediata do conteúdo:

- **Autenticação:** Protegido por modal (`AdminAuthModal`) que autentica via JWT no backend FastAPI ou utiliza fallback seguro em `sessionStorage` (senha: `admin` ou `elyyihz`). Atalho rápido: `Ctrl + Shift + A` (`Cmd + Shift + A`).
- **CRUD de Projetos:** Criação, edição e exclusão de projetos com tags e seleção de ícone SVG.
- **CRUD da Wishlist:** Suporte explícito ao booleano `is_fulfilled` (item já adquirido / realizado), alternável via botão de confirmação e refletido com badge visual.
- **Gestão de Consumo de Mídias:** Atualização da leitura ativa (*The Man in the High Castle* de Philip K. Dick) e mídias visuais.
- **Gestão de Gostos & Hobbies:** Criação e manutenção de afinidades com **Icon Picker** integrado, selecionando slugs salvos no banco a partir do registro local de SVGs inline.

---

## 6. Como Executar a Aplicação

### Pré-requisitos
- Node.js 18+ e npm
- Python 3.11+
- Docker e Docker Compose (opcional para ambiente conteinerizado)

### Execução via Docker Compose (Microsserviço + PostgreSQL)
```bash
# Iniciar banco de dados PostgreSQL 16 e microserviço FastAPI
docker compose up -d --build

# Verificar logs da aplicação
docker compose logs -f backend
```

A documentação interativa Swagger estará acessível em: `http://localhost:8000/docs`.

### Execução Local para Desenvolvimento

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # ou .venv\Scripts\activate no Windows
pip install -r requirements.txt

# Executar suite de testes com TDD (15 testes unitários e de integração)
PYTHONPATH=. pytest -v

# Iniciar servidor Uvicorn com hot-reload
uvicorn app.presentation.main:app --reload --port 8000
```

#### 2. Frontend (React + Vite)
```bash
# Na raiz do repositório:
npm install

# Compilar TypeScript estrito e validar o build
npm run build

# Iniciar servidor Vite de desenvolvimento
npm run dev
```

Abra o navegador em `http://localhost:5173`.

---

## 7. Estrutura de Diretórios Consolidada

```
personal-website/
├── backend/
│   ├── app/
│   │   ├── domain/                  # Entidades, exceções e portas abstratas
│   │   ├── application/             # DTOs Pydantic v2 e Casos de Uso
│   │   ├── infrastructure/          # SQLAlchemy, Bcrypt, PyJWT e Banco
│   │   └── presentation/            # Routers FastAPI, Dependências e Main
│   ├── tests/
│   │   ├── unit/                    # Testes de entidades e casos de uso
│   │   └── integration/             # Testes de endpoints HTTP e autenticação
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml               # Orquestração do backend e Postgres 16
├── public/
│   └── memoji.png                   # Avatar Memoji 320x320 com transparência
├── src/
│   ├── components/
│   │   ├── admin/                   # Modais e gerenciadores CRUD do painel
│   │   ├── common/                  # Navbar, Footer, SpotifyCard, IconPicker
│   │   ├── icons/                   # SVGs inline sem emojis com currentColor
│   │   ├── sections/                # Seções semânticas da página principal
│   │   └── terminal/                # Emulador de terminal macOS Zsh
│   ├── config/                      # Validador estrito de variáveis de ambiente
│   ├── context/                     # DataContext com cache local e sincronização
│   ├── data/                        # Datasets padrão e coleções
│   ├── hooks/                       # Custom hooks (useSpotify, etc.)
│   ├── services/                    # Clientes de API e OAuth Manager
│   └── types/                       # Interfaces e tipos estritos TypeScript
├── package.json
└── vite.config.ts
```

---

## 8. Licença e Autoria

Projeto concebido e desenvolvido por **Elynne Lima** sob as diretrizes de código limpo de Kent Beck, Clean Architecture de Robert C. Martin e Domain-Driven Design de Eric Evans.
