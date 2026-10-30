import React, { useState } from 'react';
import {
  LockIcon,
  CloseIcon,
  CodeIcon,
  GiftIcon,
  HeadphonesIcon,
  HeartIcon,
  RefreshIcon,
} from '@/components/icons';
import { ProjectsManager } from './ProjectsManager';
import { WishlistManager } from './WishlistManager';
import { MediaManager } from './MediaManager';
import { HobbiesManager } from './HobbiesManager';
import { useData } from '@/context/DataContext';

export interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

type AdminTab = 'projects' | 'wishlist' | 'media' | 'hobbies';

/**
 * Admin Dashboard root modal component providing full CRUD for projects, wishlist, and consumed media.
 * Designed strictly with inline SVGs utilizing currentColor without any emojis.
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { resetToDefaults } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleReset = () => {
    resetToDefaults();
    setConfirmReset(false);
  };

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'projects',
      label: 'Projetos',
      icon: <CodeIcon className="w-4 h-4" />,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: <GiftIcon className="w-4 h-4" />,
    },
    {
      id: 'media',
      label: 'Mídias Consumidas',
      icon: <HeadphonesIcon className="w-4 h-4" />,
    },
    {
      id: 'hobbies',
      label: 'Gostos & Hobbies',
      icon: <HeartIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-brand-deep border border-brand-accent/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-brand-surface border-b border-brand-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-accent">
              <LockIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-heading flex items-center gap-2">
                <span>Painel de Controle Privado</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent">
                  Autenticado
                </span>
              </h3>
              <p className="text-xs text-brand-textMuted">
                Gerencie dinamicamente o catálogo e o estado visual da página principal.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {confirmReset ? (
              <div className="flex items-center gap-1.5 p-1 bg-red-950/60 rounded-xl border border-red-500/30">
                <span className="text-xs text-red-300 px-2 font-medium">Resetar tudo?</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700"
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 text-xs text-brand-textMuted hover:text-brand-text"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-brand-textMuted hover:text-brand-accent bg-brand-surfaceHover border border-white/5 transition-all"
                title="Restaurar dados originais"
              >
                <RefreshIcon className="w-3.5 h-3.5" />
                <span>Restaurar Padrões</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-brand-textMuted hover:text-red-400 bg-brand-surfaceHover border border-white/5 transition-all"
            >
              Sair
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-brand-textMuted hover:text-brand-accent bg-brand-surfaceHover border border-white/5 transition-colors"
              aria-label="Fechar painel"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 px-6 pt-3 bg-brand-surface/50 border-b border-brand-accent/15 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 -mb-[1px] ${
                activeTab === tab.id
                  ? 'border-brand-accent text-brand-accent bg-brand-deep'
                  : 'border-transparent text-brand-textMuted hover:text-brand-text hover:bg-brand-surface'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Tab Panel Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'wishlist' && <WishlistManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'hobbies' && <HobbiesManager />}
        </div>
      </div>
    </div>
  );
};
