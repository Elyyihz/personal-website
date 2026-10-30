import React, { useState } from 'react';
import { LockIcon, CloseIcon, CheckIcon } from '@/components/icons';

/**
 * Props specification for AdminAuthModal.
 */
export interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

/**
 * Private authentication challenge protecting access to the admin dashboard.
 * Requires passcode verification before granting administration privilege.
 */
export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Default local passcode is 'admin' or 'elyyihz'
    const validPasscodes = ['admin', 'elyyihz', 'ely2026'];

    if (validPasscodes.includes(passcode.trim().toLowerCase())) {
      setErrorMessage('');
      setPasscode('');
      onAuthenticated();
    } else {
      setErrorMessage('Código de acesso inválido. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-brand-surface border border-brand-accent/30 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-brand-textMuted hover:text-brand-accent rounded-lg bg-brand-deep border border-white/5 transition-colors"
          aria-label="Fechar modal"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-accent">
            <LockIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-heading">Acesso Administrativo</h3>
            <p className="text-xs text-brand-textMuted">
              Insira a senha de controle para gerenciar o conteúdo do site.
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
              Senha de Acesso
            </label>
            <input
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Digite a senha (padrão: admin)"
              className="w-full px-4 py-2.5 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all placeholder-brand-textMuted/40 font-mono"
            />
            {errorMessage && (
              <p className="text-xs text-red-400 mt-2 font-medium">{errorMessage}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-text bg-brand-deep hover:bg-brand-surfaceHover border border-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover transition-all shadow-glow-blue flex items-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Autenticar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
