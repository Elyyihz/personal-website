import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CodeIcon, GithubIcon, ExternalLinkIcon } from '@/components/icons';
import { projectsData } from '@/data/projectsData';

/**
 * What I Do (Projects) section highlighting AI, distributed systems, and web architecture initiatives.
 */
export const WhatIDoSection: React.FC = () => {
  return (
    <section id="projetos" className="scroll-mt-28 py-12">
      <SectionHeading
        title="O Que Eu Faço"
        badgeText="Engenharia & Arquitetura"
        icon={<CodeIcon className="w-7 h-7" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectsData.map((project) => (
          <div
            key={project.id}
            className={`group bg-brand-surface rounded-2xl p-7 border border-brand-accent/20 hover:border-brand-accent/60 transition-all hover:-translate-y-1 hover:shadow-card-hover flex flex-col justify-between ${
              project.featured ? 'md:col-span-2' : ''
            }`}
          >
            <div>
              {/* Header and Project Title */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-accent group-hover:scale-110 group-hover:bg-brand-primary/20 transition-all">
                    <CodeIcon className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-heading group-hover:text-brand-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* External Hyperlinks */}
                <div className="flex items-center gap-2">
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

              {/* Description */}
              <p className="text-brand-text/85 text-sm md:text-base leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-accent/10">
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
        ))}
      </div>
    </section>
  );
};
