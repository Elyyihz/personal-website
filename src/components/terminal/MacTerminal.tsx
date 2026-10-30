import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, TerminalIcon } from '@/components/icons';
import { profileData } from '@/data/profileData';
import { projectsData } from '@/data/projectsData';

export interface MacTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandHistoryEntry {
  command: string;
  output: React.ReactNode;
}

/**
 * Interactive macOS Zsh Terminal simulator component.
 * Features realistic terminal prompt, command parsing, history navigation, and zero emojis.
 */
export const MacTerminal: React.FC<MacTerminalProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryEntry[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-cyan-400 font-bold">
            Last login: {new Date().toLocaleDateString('pt-BR')} on ttys001
          </p>
          <p>Elynne Lima Portfolio Shell (Zsh macOS v15.4 emulation).</p>
          <p className="text-slate-400">
            Digite <span className="text-cyan-300 font-bold">'help'</span> para listar os comandos disponíveis.
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

  const handleCommandExecution = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory((prev) => [
        ...prev,
        { command: '', output: null },
      ]);
      return;
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryPointer(-1);

    const parts = trimmed.split(' ');
    const primary = parts[0].toLowerCase();

    let output: React.ReactNode = null;

    switch (primary) {
      case 'help':
        output = (
          <div className="space-y-1 text-slate-300">
            <p className="text-cyan-400 font-semibold">Comandos Disponíveis:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              <div><span className="text-cyan-300 font-mono">whoami</span> — Perfil biográfico e especialidade</div>
              <div><span className="text-cyan-300 font-mono">projects</span> — Lista de projetos de engenharia</div>
              <div><span className="text-cyan-300 font-mono">skills</span> — Tecnologias e competências</div>
              <div><span className="text-cyan-300 font-mono">spotify</span> — Status da integração Spotify</div>
              <div><span className="text-cyan-300 font-mono">theme</span> — Cores do Design System Dark Mode</div>
              <div><span className="text-cyan-300 font-mono">clear</span> — Limpa o buffer do terminal</div>
              <div><span className="text-cyan-300 font-mono">sudo</span> — Elevação de privilégios de administrador</div>
              <div><span className="text-cyan-300 font-mono">exit</span> — Fecha a janela do terminal</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1 text-slate-300">
            <p className="font-bold text-white">{profileData.name} ({profileData.handle})</p>
            <p className="text-cyan-300">{profileData.role}</p>
            <p className="text-xs text-slate-400">{profileData.bio}</p>
            <p className="text-xs text-cyan-400 font-mono mt-1">
              Localização: Recife, PE | MBTI: ISTP | Stack: Python, FastAPI, React, Clean Arch
            </p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2">
            <p className="text-cyan-400 font-semibold">Projetos de Destaque no Portfólio:</p>
            {projectsData.map((p) => (
              <div key={p.id} className="text-xs border-l-2 border-cyan-400/50 pl-2">
                <p className="font-bold text-white">{p.title}</p>
                <p className="text-slate-400">{p.description}</p>
                <p className="text-cyan-300 font-mono text-[11px] mt-0.5">
                  [{p.tags.join(', ')}] {p.githubUrl ? `-> ${p.githubUrl}` : ''}
                </p>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <p className="text-cyan-400 font-semibold">Competências & Frameworks:</p>
            <p><span className="text-white font-semibold">IA & Agentes:</span> LangGraph, vLLM, llama.cpp, Qdrant, PaddleOCR</p>
            <p><span className="text-white font-semibold">Backend & Arquitetura:</span> Python, FastAPI, Clean Architecture, DDD, PostgreSQL, RabbitMQ</p>
            <p><span className="text-white font-semibold">Frontend & UI:</span> React 18, TypeScript, Tailwind CSS, Vite</p>
            <p><span className="text-white font-semibold">DevOps & Observabilidade:</span> Docker, Docker Compose, OpenTelemetry, Prometheus, Grafana</p>
          </div>
        );
        break;

      case 'spotify':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <p className="text-cyan-400 font-semibold">Spotify Web API Integration:</p>
            <p>Endpoint: <code className="text-cyan-300">/api/v1/spotify/currently-playing</code></p>
            <p>Escopos OAuth: <code className="text-slate-400">user-read-currently-playing, user-read-recently-played</code></p>
            <p>Status: Modo reativo ativo com renovação automática de access token em background.</p>
          </div>
        );
        break;

      case 'theme':
        output = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-cyan-400 font-bold">Design System Palette (Deep Blue & Cyan):</p>
            <p><span className="text-[#020617] bg-slate-300 px-1 font-bold">#020617</span> — slate-950 (Fundo Base Deep Backdrop)</p>
            <p><span className="text-[#0f172a] bg-slate-300 px-1 font-bold">#0f172a</span> — slate-900 (Cartões & Superfícies)</p>
            <p><span className="text-[#22d3ee] font-bold">#22d3ee</span> — cyan-400 (Destaques, Bordas & Glows)</p>
            <p><span className="text-[#3b82f6] font-bold">#3b82f6</span> — blue-500 (Botões Primários & Ações)</p>
            <p><span className="text-[#cbd5e1] font-bold">#cbd5e1</span> — slate-300 (Tipografia e Textos)</p>
          </div>
        );
        break;

      case 'sudo':
        output = (
          <p className="text-xs text-green-400 font-mono">
            [sudo] password for elyyihz: [OK]. Privilégios concedidos.
          </p>
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
            zsh: command not found: {trimmed}. Digite <span className="text-cyan-300">'help'</span> para auxílio.
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl h-[70vh] bg-slate-950/95 border border-cyan-400/40 rounded-xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs sm:text-sm">
        {/* macOS Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center group"
              title="Fechar (Cmd+W)"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-red-950 font-bold">x</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500" title="Minimizar" />
            <div className="w-3 h-3 rounded-full bg-green-500" title="Expandir" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>elyyihz — -zsh — 80x24</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal Output Buffer */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command && (
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">elyyihz@macbook-pro</span>
                  <span className="text-slate-400 font-semibold">~ %</span>
                  <span className="text-white">{item.command}</span>
                </div>
              )}
              {item.output && <div className="pl-4">{item.output}</div>}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-cyan-400 font-bold">elyyihz@macbook-pro</span>
            <span className="text-slate-400 font-semibold">~ %</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white focus:outline-none caret-cyan-400 font-mono text-xs sm:text-sm"
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
