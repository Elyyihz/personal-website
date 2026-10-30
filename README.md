# Site Pessoal & Portfólio — Elynne Lima

Repositório front-end do site pessoal e portfólio profissional de **Elynne Lima** (AI Systems Engineer & Full-Stack Architect). Desenvolvido com **React 18**, **TypeScript**, **Vite** e estilizado com **Tailwind CSS**.

---

## 🎨 Design System

A interface adota um tema escuro imersivo (*deep dark mode*) com contraste refinado e realces em ciano e azul elétrico:

- **Fundo Base (Deep Backdrop):** `slate-950` (`#020617`) para imersão e profundidade.
- **Superfícies de Cartões (Card Surface):** `slate-900` (`#0f172a`) com cantos arredondados (`rounded-2xl`).
- **Estados Interativos / Hover:** `slate-800` (`#1e293b`).
- **Tipografia e Textos:** Corpo em `slate-300` (`#cbd5e1`), textos secundários em `slate-400` (`#94a3b8`) e títulos em `slate-50` (`#f8fafc`).
- **Bordas e Destaques:** Acentos em `cyan-400` (`#22d3ee`) e ações primárias em `blue-500` (`#3b82f6`).
- **Efeitos de Glow:** Sombras difusas `glow-cyan` e `glow-blue` para componentes em foco e cartões interativos.

---

## 🏛️ Estrutura Semântica e Seções

O esqueleto da página está organizado nas seguintes seções modulares:

1. **Navegação Fixa (`Navbar`):** Header responsivo com efeito *glassmorphism* (*backdrop-blur*), logotipo estilizado, links de âncoras, atalho de acesso ao Painel Administrativo Privado e menu mobile.
2. **Hero (`HeroSection`):** Apresentação de boas-vindas com gradiente de texto, síntese da atuação profissional, botões de ação e avatar com aura luminosa.
3. **Sobre Mim (`AboutMeSection`):** Narrativa biográfica focada em *Clean Architecture*, convergência entre backend e IA, além de grade de atributos pessoais (Localização em Recife, foco em IA & Full-Stack, MBTI ISTP e café).
4. **O Que Eu Faço (`WhatIDoSection`):** Vitrine de projetos com **grid responsivo de altura uniforme (equal-height)** via utilitários do Tailwind (`auto-rows-fr`, `items-stretch`, `h-full`), flexibilidade estrutural e badges de destaque, integrado dinamicamente ao contexto de dados.
5. **Consumindo Atualmente (`CurrentlyConsumingSection`):**
   - **Lendo:** Exibe o livro injetado ***The Man in the High Castle* (Philip K. Dick)** com capa oficial em alta definição, autoria, gênero de ficção científica e link direto de referência para a Amazon.
   - **Ouvindo (Integração Spotify API & OAuth):** Consome o endpoint seguro de backend/edge `/api/spotify` que renova o token OAuth e consulta dinamicamente a faixa em reprodução (`currently-playing`) ou a última faixa tocada (`recently-played`), com fallback mock para modo offline.
   - **Assistindo:** Recomendações de ficção científica e mídias visuais.
6. **O Que Eu Gosto (`InterestsSection`):** Pílulas interativas com afinidades pessoais (Stardew Valley, Pokémon, Paleontologia, Engenharia Biomimética, Ella Enchanted e Cafés Especiais).
7. **Wishlist Categorizada (`WishlistSection`):** Coleção completa de mais de 160 livros importados da lista da Amazon (incluindo *The Man in the High Castle*), itens de hardware, periféricos e colecionáveis, com busca instantânea em tempo real, abas por categoria e paginação suave.
8. **Contato (`ContactsSection`):** Canais de comunicação direta com atalhos para envio e cópia de e-mail para a área de transferência, GitHub e LinkedIn.
9. **Painel Administrativo Privado (`AdminDashboard`):** Interface de controle privada protegida por senha com operações completas de CRUD (Create, Read, Update, Delete) para Projetos, Wishlist e Mídias, integrando o seletor de ícones **`IconPicker`** com registro local de SVGs inline.
10. **Rodapé (`Footer`):** Informações de autoria, links sociais e atalho discreto para o painel privado.

---

## 🔒 Painel Administrativo Privado (Admin Dashboard)

O painel de controle permite gerenciar dinamicamente as entidades sem necessidade de rebuild estático:

- **Autenticação Segura:** Protegido por modal de senha (padrão: `admin` ou `elyyihz`). Pode ser acessado pelo ícone de cadeado na barra de navegação, no rodapé ou pelo atalho de teclado `Ctrl + Shift + A` (`Cmd + Shift + A` no Mac).
- **CRUD de Projetos:** Criação, edição e exclusão de projetos com título, descrição, tags, URLs de repositório/demo, flag de destaque e seleção visual de ícone via `IconPicker`.
- **CRUD da Wishlist:** Inclusão, alteração e exclusão de itens de leitura, hardware e colecionáveis, com categorização e URLs diretas da Amazon.
- **Gerenciador de Mídias:** Edição em tempo real do livro em leitura (*The Man in the High Castle*), recomendações de séries/vídeo e monitoramento do status da API do Spotify.
- **Icon Picker Component (`IconPicker`):** Seletor interativo de ícones SVG inline que consome um registro local tipado (`ICON_REGISTRY`), categorizado por abas (Tech, Mídia, Ações, Geral), busca por nome e suporte nativo a `currentColor`.
- **Persistência Local & Reset:** Todas as alterações são salvas no `localStorage` do navegador com opção de um clique para restaurar os dados padrão de fábrica.

---

## 🎵 Spotify OAuth & API (Backend / Edge Handler)

A integração de música foi desacoplada em uma rota de backend/edge segura:

- **Segurança de Credenciais:** As chaves secretas (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`) são manipuladas estritamente no lado do servidor e **nunca** expostas no bundle do cliente.
- **Renovação Automática de Token:** O handler em `server/spotifyHandler.ts` realiza a troca do refresh token com a API de contas do Spotify (`https://accounts.spotify.com/api/token`).
- **Endpoint Duplo (`currently-playing` + `recently-played`):** Caso o usuário não esteja ouvindo nada no momento (HTTP 204), a API consulta automaticamente o histórico recente (`/v1/me/player/recently-played`) para exibir a última música reproduzida.
- **Ambiente de Desenvolvimento:** O arquivo `vite.config.ts` inclui um middleware integrado que responde a requisições `GET /api/spotify` localmente durante `npm run dev`.
- **Ambiente Serverless/Edge:** O arquivo `api/spotify.ts` disponibiliza a função pronta para deploy em provedores serverless (Vercel, Netlify, Cloudflare Workers, Node).

---

## 🚫 Diretrizes de Assets e UI (Zero Emojis)

- **Proibição Estrita de Emojis:** É terminantemente proibido o uso de emojis na interface ou marcação.
- **Ícones em SVG Inline:** Todos os ícones são implementados como componentes React nativos contendo SVGs inline (`src/components/icons/`).
- **Herança via `currentColor`:** As tags de `<path>`, `<polygon>` e traçados utilizam exclusivamente `currentColor`, permitindo que todas as classes utilitárias de hover e cor do Tailwind CSS funcionem de maneira reativa e sem sobrescritas forçadas.

---

## 📐 Padrões de Código e Engenharia de Software

- **Idioma do Código:** Todo o código-fonte, variáveis, interfaces, tipos, nomes de componentes e comentários técnicos estão estritamente em **inglês**. A documentação e os commits são mantidos em **português**.
- **JSDoc Completo:** Tipos, interfaces, classes de serviço e componentes possuem blocos JSDoc detalhando responsabilidades, parâmetros e retornos.
- **Kent Beck Commenting & Tidies:** Princípio de *Explain Why, Not What*, uso de *Guard Clauses* para eliminação de aninhamentos e remoção de código morto.
- **Rastreabilidade e Logs:** A classe utilitária `Logger` (`src/utils/logger.ts`) padroniza o ciclo de vida de operações críticas (`logStepStart`, `logDecision`, `logStepConclusion`).

---

## 📁 Estrutura de Diretórios

```
personal-website/
├── api/
│   └── spotify.ts               # Endpoint serverless / edge para Spotify
├── server/
│   └── spotifyHandler.ts        # Lógica backend segura de renovação de token OAuth
├── index.html                   # Ponto de entrada HTML com fontes e viewport
├── package.json                 # Dependências e scripts do projeto
├── postcss.config.js            # Configuração do PostCSS para Tailwind
├── tailwind.config.js           # Paleta de cores brand, tipografia e sombras glow
├── tsconfig.json                # Configuração estrita do compilador TypeScript
├── tsconfig.node.json           # Configuração TypeScript para runtime do Vite e server
├── vite.config.ts               # Bundler Vite com middleware backend e alias path '@/...'
├── .env.example                 # Modelo de credenciais server-side do Spotify
├── .gitignore                   # Regras de exclusão do Git
└── src/
    ├── App.tsx                  # Componente raiz agregador de seções e modais admin
    ├── main.tsx                 # Montagem do React no DOM
    ├── vite-env.d.ts            # Tipagens globais do ambiente Vite
    ├── context/
    │   └── DataContext.tsx      # Provedor global com persistência e operações de CRUD
    ├── components/
    │   ├── admin/               # Telas do Painel Administrativo Privado
    │   │   ├── AdminAuthModal.tsx    # Modal de autenticação com senha
    │   │   ├── AdminDashboard.tsx    # Shell principal do painel de controle
    │   │   ├── ProjectsManager.tsx   # CRUD de projetos com IconPicker
    │   │   ├── WishlistManager.tsx   # CRUD da wishlist categorizada
    │   │   └── MediaManager.tsx      # Gerenciador de leitura e mídia
    │   ├── common/              # Componentes de layout (Navbar, Footer, IconPicker, Heading)
    │   ├── icons/               # Biblioteca e registro de ícones SVG inline com currentColor
    │   └── sections/            # Seções da página principal (Hero, About, Projects, etc.)
    ├── data/                    # Dados tipados (livros da Amazon, projetos, perfil, mídia)
    ├── hooks/                   # Custom hooks (useSpotify, etc.)
    ├── services/                # Serviços de API desacoplados (SpotifyService)
    ├── styles/                  # Estilos globais e diretivas Tailwind
    ├── types/                   # Contratos TypeScript (Spotify, Wishlist, Project, Media, Icon)
    └── utils/                   # Utilitários de logging e telemetria
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js versão 18+ (recomendado Node 20+)
- npm versão 9+

### Instalação de Dependências
```bash
npm install
```

### Executar em Modo de Desenvolvimento
```bash
npm run dev
```
A aplicação iniciará localmente no endereço padrão: [http://localhost:3000](http://localhost:3000).

- Para testar a API do Spotify localmente: acesse [http://localhost:3000/api/spotify](http://localhost:3000/api/spotify).
- Para abrir o Painel Administrativo Privado: clique no ícone de cadeado no menu ou pressione `Ctrl + Shift + A` (senha padrão: `admin`).

### Compilar para Produção (Build)
```bash
npm run build
```
O build estático e minificado será gerado na pasta `dist/`.

---

## 🎵 Configuração da API do Spotify (Opcional)

Para conectar o widget de reprodução à sua conta oficial do Spotify:
1. Crie uma aplicação no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Obtenha o `Client ID`, `Client Secret` e gere um `Refresh Token` com os escopos `user-read-currently-playing` e `user-read-recently-played`.
3. Crie um arquivo `.env` na raiz do projeto baseado em `.env.example`:
```env
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
SPOTIFY_REFRESH_TOKEN=seu_refresh_token
```
Caso as variáveis não estejam preenchidas, a aplicação ativa automaticamente o **Modo Demonstração (Mock)** com dados de teste e reprodução simulada.
