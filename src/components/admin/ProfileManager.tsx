import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { UserIcon, CheckIcon } from '@/components/icons';
import type { ProfileInfo } from '@/types/profile';
import { HobbiesManager } from './HobbiesManager';

/**
 * Administrative manager component allowing comprehensive modification of
 * personal biography, headline, technical role, traits, social connections,
 * and integrated hobbies & affinities.
 */
export const ProfileManager: React.FC = () => {
  const { profile, updateProfile } = useData();

  const [formData, setFormData] = useState<ProfileInfo>(() => ({
    name: profile.name,
    handle: profile.handle,
    role: profile.role,
    headline: profile.headline,
    bio: profile.bio,
    traits: [...profile.traits],
    socials: { ...profile.socials },
  }));

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const handleTraitChange = (index: number, value: string) => {
    const updatedTraits = [...formData.traits];
    updatedTraits[index] = { ...updatedTraits[index], value };
    setFormData({ ...formData, traits: updatedTraits });
  };

  const handleSocialChange = (key: keyof ProfileInfo['socials'], value: string) => {
    setFormData({
      ...formData,
      socials: {
        ...formData.socials,
        [key]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setFeedbackMessage('Informações de Perfil e Sobre Mim atualizadas com sucesso!');
    setIsSavedRecently(true);
    setTimeout(() => {
      setFeedbackMessage(null);
      setIsSavedRecently(false);
    }, 3500);
  };

  return (
    <div className="space-y-8 pb-4">
      {/* Header */}
      <div className="pb-4 border-b border-brand-accent/15">
        <h4 className="text-lg font-bold text-brand-heading flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-brand-accent" />
          <span>Gestão de Sobre Mim, Perfil &amp; Gostos</span>
        </h4>
        <p className="text-xs text-brand-textMuted mt-1">
          Atualize os textos do Hero, biografia, atributos pessoais, redes sociais e gerencie suas afinidades e hobbies integrados.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Part 1: Profile & Identity Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Identity Details */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <h5 className="text-sm font-bold text-brand-heading border-b border-white/5 pb-2">
            Identidade &amp; Apresentação Principal (Hero)
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Nome de Exibição *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Apelido / Handle *
              </label>
              <input
                type="text"
                required
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Cargo / Especialização Principal *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Frase de Destaque (Headline) *
              </label>
              <input
                type="text"
                required
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <h5 className="text-sm font-bold text-brand-heading border-b border-white/5 pb-2">
            Narrativa Biográfica (Seção Sobre Mim)
          </h5>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
              Texto da Biografia *
            </label>
            <textarea
              required
              rows={5}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>
        </div>

        {/* Traits & Attributes Grid */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <h5 className="text-sm font-bold text-brand-heading border-b border-white/5 pb-2">
            Atributos Pessoais &amp; Indicadores
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {formData.traits.map((trait, index) => (
              <div key={trait.label} className="space-y-1">
                <label className="block text-[11px] font-mono text-brand-textMuted uppercase tracking-wider">
                  {trait.label}
                </label>
                <input
                  type="text"
                  required
                  value={trait.value}
                  onChange={(e) => handleTraitChange(index, e.target.value)}
                  className="w-full px-3 py-1.5 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Network URLs */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <h5 className="text-sm font-bold text-brand-heading border-b border-white/5 pb-2">
            Canais Sociais &amp; Contato
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                value={formData.socials.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={formData.socials.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Email de Contato
              </label>
              <input
                type="text"
                value={formData.socials.email}
                onChange={(e) => handleSocialChange('email', e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={formData.socials.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-lg ${
              isSavedRecently
                ? 'bg-emerald-600 hover:bg-emerald-500 border border-emerald-400'
                : 'bg-brand-primary hover:bg-brand-primaryHover shadow-glow-blue'
            }`}
          >
            <CheckIcon className="w-4 h-4" />
            <span>
              {isSavedRecently ? 'Perfil Salvo com Sucesso!' : 'Salvar Informações de Perfil'}
            </span>
          </button>
        </div>
      </form>

      {/* Part 2: Integrated Hobbies & Affinities Section */}
      <div className="pt-8 border-t border-brand-accent/20">
        <HobbiesManager />
      </div>
    </div>
  );
};
