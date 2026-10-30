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

1. **Navegação Fixa (`Navbar`):** Header responsivo com efeito *glassmorphism* (*backdrop-blur*), logotipo estilizado, links de âncoras e menu mobile.
2. **Hero (`HeroSection`):** Apresentação de boas-vindas com gradiente de texto, síntese da atuação profissional, botões de ação e avatar com aura luminosa.
3. **Sobre Mim (`AboutMeSection`):** Narrativa biográfica focada em *Clean Architecture*, convergência entre backend e IA, além de grade de atributos pessoais (Localização em Recife, foco em IA & Full-Stack, MBTI ISTP e café).
4. **O Que Eu Faço (`WhatIDoSection`):** Vitrine de projetos de engenharia baseados no portfólio real (Doc Semantic Equivalence Engine, Distributed Video Inference Pipeline, Telemetry Anomaly Agent, Plataforma SAED), com tags de tecnologia e links diretos para repositórios.
5. **Consumindo Atualmente (`CurrentlyConsumingSection`):**
   - **Lendo:** Apresentação da leitura corrente e preferências literárias.
   - **Ouvindo (Integração Spotify):** Widget com capa animada, título da faixa, artista, barra de progresso temporal e adaptador desacoplado para a Spotify Web API (com *fallback mock* automático caso credenciais não sejam providenciadas).
   - **Assistindo:** Recomendações de ficção científica e mídias visuais.
6. **O Que Eu Gosto (`InterestsSection`):** Pílulas interativas com afinidades pessoais (Stardew Valley, Pokémon, Paleontologia, Engenharia Biomimética, Ella Enchanted e Cafés Especiais).
7. **Wishlist Categorizada (`WishlistSection`):** Coleção completa de mais de 160 livros importados da lista da Amazon, além de itens de hardware, periféricos e colecionáveis, com busca instantânea em tempo real, abas por categoria e paginação suave.
8. **Contato (`ContactsSection`):** Canais de comunicação direta com atalhos para envio e cópia de e-mail para a área de transferência, GitHub e LinkedIn.
9. **Rodapé (`Footer`):** Informações de autoria e links sociais.

---

## 🚫 Diretrizes de Assets e UI (Zero Emojis)

- **Proibição de Emojis:** É terminantemente proibido o uso de emojis na interface ou marcação.
- **Ícones em SVG Inline:** Todos os ícones são implementados como componentes React nativos contendo SVGs inline (`src/components/icons/`).
- **Herança via `currentColor`:** As tags de `<path>`, `<polygon>` e traçados utilizam exclusivamente `currentColor` (ou stroke transparente com preenchimento coerente), permitindo que todas as classes utilitárias de hover e cor do Tailwind CSS funcionem de maneira reativa e sem sobrescritas forçadas.

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
├── index.html                   # Ponto de entrada HTML com fontes e viewport
├── package.json                 # Dependências e scripts do projeto
├── postcss.config.js            # Configuração do PostCSS para Tailwind
├── tailwind.config.js           # Paleta de cores brand, tipografia e sombras glow
├── tsconfig.json                # Configuração estrita do compilador TypeScript
├── tsconfig.node.json           # Configuração TypeScript para o runtime do Vite
├── vite.config.ts               # Bundler Vite com alias path '@/...'
├── .env.example                 # Modelo de variáveis de ambiente para a API do Spotify
├── .gitignore                   # Regras de exclusão do Git
└── src/
    ├── App.tsx                  # Componente raiz agregador de seções
    ├── main.tsx                 # Montagem do React no DOM
    ├── vite-env.d.ts            # Tipagens globais do ambiente Vite
    ├── components/
    │   ├── common/              # Componentes de layout (Navbar, Footer, SectionHeading)
    │   ├── icons/               # Biblioteca de ícones SVG inline com currentColor
    │   └── sections/            # Componentes de seção (Hero, About, Projects, etc.)
    ├── data/                    # Dados tipados (livros da Amazon, projetos, perfil)
    ├── hooks/                   # Custom hooks (useSpotify)
    ├── services/                # Serviços desacoplados de API (SpotifyService)
    ├── styles/                  # Estilos globais e diretivas Tailwind
    ├── types/                   # Contratos TypeScript (Spotify, Wishlist, Project, Icon)
    └── utils/                   # Utilitários de logging e helpers
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

### Compilar para Produção (Build)
```bash
npm run build
```
O build estático e minificado será gerado na pasta `dist/`.

---

## 🎵 Configuração da API do Spotify (Opcional)

Para conectar o widget de reprodução à sua conta oficial do Spotify:
1. Crie uma aplicação no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Obtenha o `Client ID`, `Client Secret` e gere um `Refresh Token` com escopo `user-read-currently-playing`.
3. Crie um arquivo `.env` na raiz do projeto baseado em `.env.example`:
```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret
VITE_SPOTIFY_REFRESH_TOKEN=seu_refresh_token
```
Caso as variáveis não estejam preenchidas, a aplicação ativa automaticamente o **Modo Demonstração (Mock)**, garantindo que o visual permaneça completo e funcional sem quebras de interface.
