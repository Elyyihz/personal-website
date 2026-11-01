import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CodeIcon, GithubIcon, ExternalLinkIcon, SparklesIcon } from '@/components/icons';
import { getRegisteredIcon } from '@/components/icons/registry';
import { useData } from '@/context/DataContext';

/**
 * What I Do (Projects) section highlighting AI, distributed systems, and web architecture.
 * Implements rigid equal-height layout and responsive grid alignment via Tailwind utilities.
 */
export const WhatIDoSection: React.FC = () => {
  const { projects } = useData();

  return (
    <section id="projetos" className="scroll-mt-24 py-4 md:py-6">
      <SectionHeading
        title="O Que Eu Faço"
        badgeText="Engenharia & Arquitetura"
        icon={<CodeIcon className="w-7 h-7" />}
        accessory={
          <span className="text-xs font-mono text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1.5 rounded-full">
            {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
          </span>
        }
      />

      {/* Responsive Equal-Height Grid with Structural Flexibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 auto-rows-fr items-stretch">
        {projects.map((project) => {
          const IconComponent = getRegisteredIcon(project.icon || 'code');

          return (
            <div
              key={project.id}
              className="group bg-brand-surface rounded-2xl p-7 border border-brand-accent/20 hover:border-brand-accent/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover h-full flex flex-col justify-between"
            >
              {/* Flexible Upper Content Container */}
              <div className="flex-1 flex flex-col">
                {/* Header with Icon, Title, and External Links */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-accent group-hover:scale-110 group-hover:bg-brand-primary/20 transition-all flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-brand-heading group-hover:text-brand-accent transition-colors leading-snug">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span
                            title="Projeto em Destaque"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-brand-accent bg-brand-accent/10 border border-brand-accent/25"
                          >
                            <SparklesIcon className="w-2.5 h-2.5" />
                            <span>Destaque</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* External Repository & Demo Hyperlinks */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver repositório do projeto ${project.title}`}
                        className="p-2 rounded-lg bg-brand-deep text-brand-text hover:text-brand-accent hover:border-brand-accent/40 border border-white/5 transition-all"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Acessar demonstração ao vivo de ${project.title}`}
                        className="p-2 rounded-lg bg-brand-deep text-brand-text hover:text-brand-accent hover:border-brand-accent/40 border border-white/5 transition-all"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description stretched with flex-1 to guarantee uniform bottom alignment */}
                <p className="text-brand-text/85 text-sm md:text-base leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack Pills docked to the exact bottom boundary */}
              <div className="mt-auto pt-4 border-t border-brand-accent/10 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-md bg-brand-deep text-brand-accent/90 border border-brand-accent/15 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
