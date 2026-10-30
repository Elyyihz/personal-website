import React, { useState } from 'react';
import type { Project } from '@/types/project';
import { useData } from '@/context/DataContext';
import { IconPicker } from '@/components/common/IconPicker';
import { getRegisteredIcon } from '@/components/icons/registry';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
  GithubIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from '@/components/icons';

interface ProjectFormData {
  title: string;
  description: string;
  tagsString: string;
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  icon: string;
}

const emptyFormData: ProjectFormData = {
  title: '',
  description: '',
  tagsString: '',
  githubUrl: '',
  demoUrl: '',
  featured: false,
  icon: 'code',
};

/**
 * Projects CRUD management interface for the admin control panel.
 * Enables adding, editing, and deleting portfolio projects with inline IconPicker integration.
 */
export const ProjectsManager: React.FC = () => {
  const { projects, createProject, updateProject, deleteProject } = useData();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyFormData);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /**
   * Opens creation form initialized with default blank state.
   */
  const handleOpenCreate = () => {
    setEditingProjectId(null);
    setFormData(emptyFormData);
    setIsFormOpen(true);
  };

  /**
   * Pre-populates form state from existing project target for modification.
   */
  const handleOpenEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      tagsString: project.tags.join(', '),
      githubUrl: project.githubUrl ?? '',
      demoUrl: project.demoUrl ?? '',
      featured: Boolean(project.featured),
      icon: project.icon ?? 'code',
    });
    setIsFormOpen(true);
  };

  /**
   * Persists form state to DataContext either as new entity or entity update.
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: tags.length > 0 ? tags : ['General'],
      githubUrl: formData.githubUrl.trim() || undefined,
      demoUrl: formData.demoUrl.trim() || undefined,
      featured: formData.featured,
      icon: formData.icon,
    };

    if (editingProjectId) {
      updateProject(editingProjectId, payload);
    } else {
      createProject(payload);
    }

    setIsFormOpen(false);
    setEditingProjectId(null);
    setFormData(emptyFormData);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-accent/15">
        <div>
          <h4 className="text-lg font-bold text-brand-heading">Gerenciador de Projetos</h4>
          <p className="text-xs text-brand-textMuted">
            Crie, edite ou remova projetos exibidos na seção 'O Que Eu Faço'.
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs font-semibold shadow-glow-blue transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        )}
      </div>

      {/* Project Create / Edit Form */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 bg-brand-deep rounded-2xl border border-brand-accent/30 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-brand-accent/15">
            <h5 className="text-sm font-bold text-brand-heading">
              {editingProjectId ? 'Editar Projeto' : 'Cadastrar Novo Projeto'}
            </h5>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-brand-textMuted hover:text-brand-accent"
              aria-label="Cancelar edição"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Título do Projeto *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Dynamic LLM Inference Router"
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Tags de Tecnologia (separadas por vírgula)
              </label>
              <input
                type="text"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                placeholder="Ex: FastAPI, vLLM, LangGraph, Qdrant"
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                URL do Repositório GitHub
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/Elyyihz/..."
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                URL de Demonstração / Playground
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
              Descrição Arquitetural
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a finalidade, arquitetura e benefícios do projeto..."
              className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent leading-relaxed"
            />
          </div>

          {/* Icon Picker Component Integration */}
          <div className="pt-2">
            <IconPicker
              label="Ícone Representativo do Projeto"
              selectedIcon={formData.icon}
              onSelectIcon={(iconId) => setFormData({ ...formData, icon: iconId })}
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded bg-brand-surface border-brand-accent/30 text-brand-accent focus:ring-brand-accent w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="featured-checkbox"
              className="text-xs font-medium text-brand-heading cursor-pointer flex items-center gap-1.5"
            >
              <SparklesIcon className="w-3.5 h-3.5 text-brand-accent" />
              <span>Marcar como Projeto em Destaque</span>
            </label>
          </div>

          {/* Form Action Controls */}
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
              <span>{editingProjectId ? 'Salvar Alterações' : 'Criar Projeto'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List View */}
      <div className="space-y-3">
        {projects.map((project) => {
          const IconComponent = getRegisteredIcon(project.icon || 'code');
          const isConfirmingDelete = deleteConfirmId === project.id;

          return (
            <div
              key={project.id}
              className="p-4 bg-brand-surface rounded-xl border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-brand-deep flex items-center justify-center text-brand-accent border border-brand-accent/20 flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-brand-accent" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-brand-heading truncate">
                      {project.title}
                    </h5>
                    {project.featured && (
                      <span className="text-[10px] font-mono text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded border border-brand-accent/25">
                        Destaque
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-textMuted line-clamp-1 mt-0.5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-deep text-brand-accent/80 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-brand-deep text-brand-textMuted hover:text-brand-accent border border-white/5 transition-colors"
                    title="Ver no GitHub"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-brand-deep text-brand-textMuted hover:text-brand-accent border border-white/5 transition-colors"
                    title="Acessar Demonstração"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenEdit(project)}
                  className="p-2 rounded-lg bg-brand-deep text-brand-textMuted hover:text-brand-accent border border-white/5 transition-colors"
                  title="Editar projeto"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                </button>

                {isConfirmingDelete ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-1 text-brand-textMuted hover:text-brand-text"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-2 rounded-lg bg-brand-deep text-brand-textMuted hover:text-red-400 border border-white/5 transition-colors"
                    title="Excluir projeto"
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
