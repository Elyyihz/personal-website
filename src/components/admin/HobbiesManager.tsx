import React, { useState } from 'react';
import type { HobbyItem } from '@/types/hobby';
import { useData } from '@/context/DataContext';
import { IconPicker } from '@/components/common/IconPicker';
import { getRegisteredIcon } from '@/components/icons/registry';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
} from '@/components/icons';

interface HobbyFormData {
  name: string;
  category: string;
  iconSlug: string;
}

const emptyFormData: HobbyFormData = {
  name: '',
  category: '',
  iconSlug: 'heart',
};

/**
 * Hobbies and interests management interface for the admin control panel.
 * Integrates IconPicker to select inline SVGs from registered slugs.
 */
export const HobbiesManager: React.FC = () => {
  const { hobbies, createHobby, updateHobby, deleteHobby } = useData();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHobbyId, setEditingHobbyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HobbyFormData>(emptyFormData);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingHobbyId(null);
    setFormData(emptyFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (hobby: HobbyItem) => {
    setEditingHobbyId(hobby.id);
    setFormData({
      name: hobby.name,
      category: hobby.category,
      iconSlug: hobby.iconSlug,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      iconSlug: formData.iconSlug || 'heart',
    };

    if (editingHobbyId) {
      updateHobby(editingHobbyId, payload);
      setFeedbackMessage('Afinidade salva com sucesso!');
    } else {
      createHobby(payload);
      setFeedbackMessage('Afinidade cadastrada com sucesso!');
    }

    setIsFormOpen(false);
    setEditingHobbyId(null);
    setFormData(emptyFormData);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleDelete = (id: string) => {
    deleteHobby(id);
    setDeleteConfirmId(null);
    setFeedbackMessage('Afinidade removida com sucesso!');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-accent/15">
        <div>
          <h4 className="text-lg font-bold text-brand-heading">Gestão de Gostos & Hobbies</h4>
          <p className="text-xs text-brand-textMuted">
            Configure suas afinidades, jogos, literatura e interesses com ícones SVG inline ({hobbies.length} cadastrados).
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs font-semibold shadow-glow-blue transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Adicionar Afinidade</span>
          </button>
        )}
      </div>

      {/* Feedback Toast Notification */}
      {feedbackMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Inline Create / Edit Form */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 bg-brand-deep rounded-2xl border border-brand-accent/30 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-brand-heading">
              {editingHobbyId ? 'Editar Afinidade' : 'Cadastrar Afinidade / Hobby'}
            </h5>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-brand-textMuted hover:text-brand-text"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Nome do Interesse *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Stardew Valley, Cafés Especiais, Pokémon"
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Categoria / Tag *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Cozy Gaming, Sensorial & Barismo"
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            {/* Icon Picker */}
            <div className="md:col-span-2 pt-2 border-t border-brand-accent/10">
              <IconPicker
                selectedIcon={formData.iconSlug}
                onSelectIcon={(iconId) => setFormData({ ...formData, iconSlug: iconId })}
                label="Ícone SVG (Icon Picker do Banco / Registro)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-brand-accent/15">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-text bg-brand-surface hover:bg-brand-surfaceHover border border-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-glow-blue flex items-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4" />
              <span>{editingHobbyId ? 'Salvar Alterações' : 'Cadastrar Afinidade'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Hobbies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {hobbies.map((hobby) => {
          const IconComp = getRegisteredIcon(hobby.iconSlug);
          const isConfirming = deleteConfirmId === hobby.id;

          return (
            <div
              key={hobby.id}
              className="p-3 bg-brand-surface rounded-xl border border-brand-accent/15 hover:border-brand-accent/30 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-deep flex items-center justify-center text-brand-accent flex-shrink-0">
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-brand-heading truncate block">
                    {hobby.name}
                  </strong>
                  <span className="text-[10px] font-mono text-brand-textMuted truncate block">
                    {hobby.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(hobby)}
                  className="p-1.5 rounded-lg bg-brand-deep text-brand-textMuted hover:text-brand-accent transition-colors"
                  title="Editar Afinidade"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                </button>

                {isConfirming ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(hobby.id)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold text-white bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-1 text-[10px] text-brand-textMuted hover:text-white"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(hobby.id)}
                    className="p-1.5 rounded-lg bg-brand-deep text-brand-textMuted hover:text-red-400 transition-colors"
                    title="Excluir Afinidade"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
