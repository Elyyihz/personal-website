import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, TerminalIcon } from '@/components/icons';
import { profileData } from '@/data/profileData';

export interface MacTerminalProps {
  isOpen: boolean;
  isTakeover?: boolean;
  onClose: () => void;
}

interface CommandHistoryEntry {
  command: string;
  output: React.ReactNode;
}

interface FileNode {
  type: 'file';
  name: string;
  size: number;
  permissions: string;
  modified: string;
  content: string;
}

interface DirNode {
  type: 'dir';
  name: string;
  permissions: string;
  modified: string;
  children: Record<string, FileNode | DirNode>;
}

/**
 * Mock filesystem representing curriculum, projects, and personal wishlist.
 */
const MOCK_FILESYSTEM: DirNode = {
  type: 'dir',
  name: 'root',
  permissions: 'drwxr-xr-x',
  modified: 'Nov 01 18:00',
  children: {
    Users: {
      type: 'dir',
      name: 'Users',
      permissions: 'drwxr-xr-x',
      modified: 'Nov 01 18:00',
      children: {
        elyyihz: {
          type: 'dir',
          name: 'elyyihz',
          permissions: 'drwxr-xr-x',
          modified: 'Nov 01 18:00',
          children: {
            'README.txt': {
              type: 'file',
              name: 'README.txt',
              size: 512,
              permissions: '-rw-r--r--',
              modified: 'Nov 01 18:00',
              content: `========================================================================
Elynne Lima - Senior Backend & AI Systems Engineer
macOS Terminal Emulation (Zsh v5.9 / Darwin 24.0)
========================================================================

Comandos disponíveis no shell:
  ls [-la]       - Lista arquivos e diretórios na pasta atual
  cd <dir>       - Navega para outro diretório (ex: cd curriculum, cd ..)
  cat <arquivo>  - Exibe o conteúdo formatado de um arquivo
  pwd            - Exibe o caminho absoluto do diretório de trabalho atual
  whoami         - Resumo do perfil profissional e especialidades
  clear          - Limpa o histórico de comandos da tela
  help           - Exibe este guia de ajuda do terminal
  exit           - Retorna à interface gráfica visual do portfólio`,
            },
            'about.txt': {
              type: 'file',
              name: 'about.txt',
              size: 420,
              permissions: '-rw-r--r--',
              modified: 'Nov 01 18:00',
              content: `Nome: Elynne Lima (elyyihz)
Função: Engenheira de Software Backend & Inteligência Artificial
Localização: Recife, PE, Brasil
MBTI: ISTP (Virtuoso / Prática & Analítica)
Filosofia de Código: Clean Architecture, DDD, TDD rigoroso, comentários contextuais de Kent Beck sem pleonasmos.
Interesses além do código: Jogos aconchegantes (Stardew Valley), barista amadora (cafés especiais filtrados) e distopias clássicas.`,
            },
            curriculum: {
              type: 'dir',
              name: 'curriculum',
              permissions: 'drwxr-xr-x',
              modified: 'Nov 01 18:00',
              children: {
                'resume.md': {
                  type: 'file',
                  name: 'resume.md',
                  size: 1480,
                  permissions: '-rw-r--r--',
                  modified: 'Nov 01 18:00',
                  content: `# Elynne Lima
**Senior Backend & AI Systems Engineer**
*Recife, PE, Brasil | GitHub: @Elyyihz | ISTP*

---

## Resumo Profissional
Engenheira de software especializada na concepção de microsserviços de alta vazão,
arquiteturas orientadas a domínio (DDD) e sistemas multiagentes com LangGraph.
Foco inegociável em Clean Architecture, TDD estrito e observabilidade em produção.

## Experiência Profissional
### Engenheira de IA & Backend - CIA / CESAR
- Liderança técnica na arquitetura de pipelines de inferência para LLMs e OCR estruturado.
- Orquestração de grafos multiagentes com LangGraph e recuperação vetorial via Qdrant.
- Auditoria de código baseada em árvore sintática abstrata (AST) e tipagem estrita MyPy.

### Principais Soluções Arquitetadas
- **SAED**: Sistema de apoio à elaboração de documentos técnicos com RAG e checagem cruzada.
- **MAIA**: Auditor multiagente inteligente com modelo de code review em quatro níveis.
- **DocChecker**: Motor de inferência para verificação de equivalência e integridade documental.

## Formação Acadêmica
- Bacharelado em Ciência da Computação / Engenharia de Software.`,
                },
                'skills.txt': {
                  type: 'file',
                  name: 'skills.txt',
                  size: 960,
                  permissions: '-rw-r--r--',
                  modified: 'Nov 01 18:00',
                  content: `[BACKEND & ARQUITETURA]
- Python (AsyncIO, Metaprogramação, Tipagem Rigorosa MyPy)
- FastAPI (Microsserviços de Alta Vazão, Streaming SSE & WebSocket)
- Clean Architecture, Ports & Adapters, Domain-Driven Design (DDD)
- SQLAlchemy, Alembic, PostgreSQL, SQLite
- Pydantic v2 & Invariantes de Domínio

[IA & ENGENHARIA DE DADOS]
- LangGraph (Fluxos Cíclicos com Estado, Grafos Multiagentes)
- Bancos Vetoriais (Qdrant, ChromaDB, Índice HNSW)
- Visão Computacional (YOLOv8, PaddleOCR, Layout Analysis)
- Google GenAI (Gemini), OpenAI, Hugging Face

[INFRAESTRUTURA & SRE]
- Docker, Docker Compose (Builds Minimalistas Rootless)
- Linux, macOS Zsh (Automação de Shell, POSIX)
- RabbitMQ (Mensageria com Garantia de Entrega At-least-once)
- OpenTelemetry, Prometheus, Rastreamento Distribuído`,
                },
              },
            },
            projects: {
              type: 'dir',
              name: 'projects',
              permissions: 'drwxr-xr-x',
              modified: 'Nov 01 18:00',
              children: {
                'saed.md': {
                  type: 'file',
                  name: 'saed.md',
                  size: 680,
                  permissions: '-rw-r--r--',
                  modified: 'Nov 01 18:00',
                  content: `# Projeto SAED
*Sistema de Apoio à Elaboração de Documentos*

- **Papel**: Arquiteta de Backend & Líder Técnica
- **Stack**: Python, FastAPI, LangGraph, Qdrant, Docker
- **Destaques**:
  * Ingestão automatizada de normas e documentos técnicos via OCR.
  * Pipeline RAG com chunking semântico e recuperação filtrada.
  * Validação cruzada com agentes de auto-reflexão contra alucinações.`,
                },
                'maia.md': {
                  type: 'file',
                  name: 'maia.md',
                  size: 720,
                  permissions: '-rw-r--r--',
                  modified: 'Nov 01 18:00',
                  content: `# Projeto MAIA
*Multi-Agent Intelligent Auditor*

- **Papel**: Engenheira de IA & Backend
- **Stack**: Python, LangGraph, AST Parser, MyPy, CI/CD
- **Destaques**:
  * Orquestração multiagente para auditoria de pull requests.
  * Classificação de revisões em quatro níveis: [Bloqueante], [Antes do merge], [Não bloqueia] e [Nits].
  * Verificação estrita de limites de camadas Clean Architecture.`,
                },
                'docchecker.md': {
                  type: 'file',
                  name: 'docchecker.md',
                  size: 640,
                  permissions: '-rw-r--r--',
                  modified: 'Nov 01 18:00',
                  content: `# Projeto DocChecker
*Document Equivalence & Verification Engine*

- **Papel**: Engenheira de Software
- **Stack**: Python, FastAPI, YOLOv8, PaddleOCR, PostgreSQL
- **Destaques**:
  * Segmentação visual de tabelas e carimbos regulatórios.
  * Comparação semântica e cálculo de score de equivalência textual.`,
                },
              },
            },
            wishlist: {
              type: 'dir',
              name: 'wishlist',
              permissions: 'drwxr-xr-x',
              modified: 'Nov 01 18:00',
              children: {
                'wishlist.md': {
                  type: 'file',
                  name: 'wishlist.md',
                  size: 780,
                  permissions: '-rw-r--r--',
                  modified: 'Nov 01 18:00',
                  content: `# Wishlist Pessoal & Setup Cozy

- **Teclado Mecânico Custom (65% / 75%)**: Switches táteis lubrificados (Boba U4T) com keycaps PBT em tons terrosos.
- **Moedor de Café Manual (Comandante C40 / Timemore Chestnut)**: Moagem precisa para cafés especiais filtrados.
- **Cafeteira Origami / Kalita Wave Tsubame**: Extração uniforme de café especial.
- **Luminária Monitor Screenbar (BenQ / Baseus)**: Iluminação sem ofuscamento visual.
- **Livro 'Designing Data-Intensive Applications' (Martin Kleppmann)**: Fundamentos de sistemas distribuídos e particionamento.
- **Livro 'Tidy First?' (Kent Beck)**: Heurísticas empíricas de refatoração segura.`,
                },
              },
            },
          },
        },
      },
    },
  },
};

/**
 * Interactive macOS Zsh Terminal simulator component.
 * Features realistic terminal prompt, mocked filesystem navigation (ls, cd, cat, pwd),
 * command history navigation, and zero emojis.
 */
export const MacTerminal: React.FC<MacTerminalProps> = ({
  isOpen,
  isTakeover = false,
  onClose,
}) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Users', 'elyyihz']);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryEntry[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-cyan-400 font-bold">
            Last login: {new Date().toLocaleDateString('pt-BR')} on ttys001
          </p>
          <p>Elynne Lima Portfolio Shell (Zsh macOS Darwin 24.0 emulation).</p>
          <p className="text-slate-400">
            Navegue pelo currículo e wishlist com comandos Unix (<span className="text-cyan-300 font-bold">ls</span>, <span className="text-cyan-300 font-bold">cd</span>, <span className="text-cyan-300 font-bold">cat</span>). Digite <span className="text-cyan-300 font-bold">'help'</span> para auxílio ou <span className="text-cyan-300 font-bold">'exit'</span> para fechar.
          </p>
        </div>
      ),
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) {
    return null;
  }

  /**
   * Resolves a directory node given an array path.
   */
  const resolveDir = (pathSegments: string[]): DirNode | null => {
    let curr: DirNode = MOCK_FILESYSTEM;
    for (const segment of pathSegments) {
      const next = curr.children[segment];
      if (!next || next.type !== 'dir') {
        return null;
      }
      curr = next;
    }
    return curr;
  };

  /**
   * Computes the display path symbol (e.g. ~ or ~/curriculum).
   */
  const getPromptPath = (): string => {
    const full = '/' + currentPath.join('/');
    if (full === '/Users/elyyihz') return '~';
    if (full.startsWith('/Users/elyyihz/')) {
      return '~/' + full.replace('/Users/elyyihz/', '');
    }
    return full;
  };

  /**
   * Executes typed terminal command.
   */
  const handleCommandExecution = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { command: '', output: null }]);
      return;
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryPointer(-1);

    const parts = trimmed.split(/\s+/);
    const primary = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = null;
    const currentDir = resolveDir(currentPath);

    switch (primary) {
      case 'pwd':
        output = (
          <p className="text-xs text-cyan-300 font-mono">
            {'/' + currentPath.join('/')}
          </p>
        );
        break;

      case 'ls': {
        if (!currentDir) {
          output = <p className="text-xs text-red-400 font-mono">ls: cannot access directory</p>;
          break;
        }

        const isLong = args.includes('-la') || args.includes('-l') || args.includes('-al');
        const entries = Object.values(currentDir.children);

        if (isLong) {
          output = (
            <div className="space-y-0.5 text-xs font-mono">
              <p className="text-slate-500">total {entries.length * 8}</p>
              {entries.map((entry) => (
                <div key={entry.name} className="flex items-center gap-4">
                  <span className="text-slate-400 w-24">{entry.permissions}</span>
                  <span className="text-slate-500 w-6">1</span>
                  <span className="text-slate-400 w-16">elyyihz</span>
                  <span className="text-slate-500 w-12">staff</span>
                  <span className="text-slate-400 w-12 text-right">
                    {entry.type === 'file' ? entry.size : 128}B
                  </span>
                  <span className="text-slate-500 w-24">{entry.modified}</span>
                  <span
                    className={
                      entry.type === 'dir'
                        ? 'text-cyan-400 font-bold'
                        : 'text-white font-medium'
                    }
                  >
                    {entry.name}{entry.type === 'dir' ? '/' : ''}
                  </span>
                </div>
              ))}
            </div>
          );
        } else {
          output = (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono">
              {entries.map((entry) => (
                <span
                  key={entry.name}
                  className={
                    entry.type === 'dir'
                      ? 'text-cyan-400 font-bold'
                      : 'text-white'
                  }
                >
                  {entry.name}{entry.type === 'dir' ? '/' : ''}
                </span>
              ))}
            </div>
          );
        }
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target || target === '~') {
          setCurrentPath(['Users', 'elyyihz']);
          break;
        }
        if (target === '/') {
          setCurrentPath([]);
          break;
        }
        if (target === '..') {
          if (currentPath.length > 0) {
            setCurrentPath((prev) => prev.slice(0, -1));
          }
          break;
        }

        // Relative path navigation
        const cleanTarget = target.replace(/\/$/, '');
        const targetNode = currentDir?.children[cleanTarget];

        if (!targetNode) {
          output = (
            <p className="text-xs text-red-400 font-mono">
              cd: no such file or directory: {cleanTarget}
            </p>
          );
        } else if (targetNode.type !== 'dir') {
          output = (
            <p className="text-xs text-red-400 font-mono">
              cd: not a directory: {cleanTarget}
            </p>
          );
        } else {
          setCurrentPath((prev) => [...prev, cleanTarget]);
        }
        break;
      }

      case 'cat': {
        const filename = args[0];
        if (!filename) {
          output = (
            <p className="text-xs text-red-400 font-mono">
              usage: cat &lt;filename&gt;
            </p>
          );
          break;
        }

        const targetNode = currentDir?.children[filename];
        if (!targetNode) {
          output = (
            <p className="text-xs text-red-400 font-mono">
              cat: {filename}: No such file or directory
            </p>
          );
        } else if (targetNode.type === 'dir') {
          output = (
            <p className="text-xs text-red-400 font-mono">
              cat: {filename}: Is a directory
            </p>
          );
        } else {
          output = (
            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap bg-slate-900/60 p-3 rounded-lg border border-cyan-400/20 leading-relaxed max-h-96 overflow-y-auto">
              {targetNode.content}
            </pre>
          );
        }
        break;
      }

      case 'help':
        output = (
          <div className="space-y-1.5 text-slate-300 text-xs font-mono">
            <p className="text-cyan-400 font-semibold">Comandos Disponíveis:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              <div><span className="text-cyan-300 font-bold">ls [-la]</span> — Lista arquivos e diretórios</div>
              <div><span className="text-cyan-300 font-bold">cd &lt;dir&gt;</span> — Navega entre diretórios</div>
              <div><span className="text-cyan-300 font-bold">cat &lt;file&gt;</span> — Exibe o conteúdo do arquivo</div>
              <div><span className="text-cyan-300 font-bold">pwd</span> — Caminho do diretório de trabalho</div>
              <div><span className="text-cyan-300 font-bold">whoami</span> — Resumo do perfil biográfico</div>
              <div><span className="text-cyan-300 font-bold">clear</span> — Limpa o buffer de comandos</div>
              <div><span className="text-cyan-300 font-bold">exit / quit</span> — Retorna à interface visual</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1 text-slate-300 text-xs font-mono">
            <p className="font-bold text-white">{profileData.name} ({profileData.handle})</p>
            <p className="text-cyan-300">{profileData.role}</p>
            <p className="text-slate-400">{profileData.bio}</p>
            <p className="text-cyan-400 mt-1">
              Localização: Recife, PE | Stack: Python, FastAPI, LangGraph, Qdrant, React, Clean Arch
            </p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        output = (
          <p className="text-xs text-red-400 font-mono">
            zsh: command not found: {primary}. Digite <span className="text-cyan-300 font-bold">'help'</span> para instruções.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        command: trimmed,
        output,
      },
    ]);
  };

  /**
   * Handles keyboard navigation and auto-completion.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandExecution(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextPointer =
        historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextPointer);
      setInputVal(commandHistory[nextPointer] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;
      const nextPointer = historyPointer + 1;
      if (nextPointer >= commandHistory.length) {
        setHistoryPointer(-1);
        setInputVal('');
      } else {
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentDir = resolveDir(currentPath);
      if (!currentDir) return;
      const parts = inputVal.split(' ');
      const prefix = parts[parts.length - 1];
      if (!prefix) return;

      const matches = Object.keys(currentDir.children).filter((name) =>
        name.toLowerCase().startsWith(prefix.toLowerCase())
      );
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setInputVal(parts.join(' '));
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // If in full DOM takeover mode, fill the entire screen; otherwise render framed modal
  const containerClasses = isTakeover
    ? 'fixed inset-0 z-50 flex flex-col bg-slate-950 font-mono text-xs sm:text-sm animate-fadeIn'
    : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-mono text-xs sm:text-sm';

  const windowClasses = isTakeover
    ? 'relative w-full h-full flex flex-col overflow-hidden bg-slate-950'
    : 'relative w-full max-w-4xl h-[78vh] bg-slate-950/98 border border-cyan-400/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden';

  return (
    <div className={containerClasses}>
      <div className={windowClasses}>
        {/* macOS Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-white/10 select-none flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center group"
              title="Fechar Terminal (ou digite 'exit')"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-red-950 font-bold">x</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500" title="Minimizar" />
            <div className="w-3 h-3 rounded-full bg-green-500" title="Expandir" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>elyyihz — zsh — {getPromptPath()} — 80x24</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Sair do Terminal (Esc)"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal Output Buffer */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-cyan-400 font-bold">elyyihz@macbook-air</span>
                  <span className="text-slate-400 font-semibold">{getPromptPath()} %</span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
              )}
              {item.output && <div className="pl-2 sm:pl-4">{item.output}</div>}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-cyan-400 font-bold">elyyihz@macbook-air</span>
            <span className="text-slate-400 font-semibold">{getPromptPath()} %</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-[200px] bg-transparent text-white focus:outline-none caret-cyan-400 font-mono text-xs sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
