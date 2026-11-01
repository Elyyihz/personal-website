import React, { useState } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MailIcon, GithubIcon, LinkedinIcon, ExternalLinkIcon } from '@/components/icons';
import { profileData } from '@/data/profileData';

/**
 * Contacts section providing direct communication channels, GitHub, LinkedIn, and email clipboard.
 */
export const ContactsSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const rawEmail = 'elynnelima@gmail.com';

  const copyEmailToClipboard = () => {
    void navigator.clipboard.writeText(rawEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const contactChannels = [
    {
      title: 'Email Direto',
      detail: rawEmail,
      href: profileData.socials.email,
      icon: <MailIcon className="w-5 h-5" />,
      actionText: copiedEmail ? 'Copiado para o clipboard!' : 'Copiar ou Enviar',
      onAction: copyEmailToClipboard,
    },
    {
      title: 'GitHub',
      detail: 'github.com/Elyyihz',
      href: profileData.socials.github,
      icon: <GithubIcon className="w-5 h-5" />,
      actionText: 'Visitar Perfil',
      isExternal: true,
    },
    {
      title: 'LinkedIn',
      detail: 'linkedin.com/in/elynnelima',
      href: profileData.socials.linkedin,
      icon: <LinkedinIcon className="w-5 h-5" />,
      actionText: 'Conectar',
      isExternal: true,
    },
  ];

  return (
    <section id="contato" className="scroll-mt-24 py-4 md:py-6">
      <SectionHeading
        title="Contato"
        badgeText="Vamos Conversar"
        icon={<MailIcon className="w-7 h-7" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactChannels.map((channel) => (
          <div
            key={channel.title}
            className="group p-6 bg-brand-surface rounded-2xl border border-brand-accent/20 hover:border-brand-accent/60 transition-all flex flex-col justify-between hover:shadow-card-hover"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-deep border border-brand-accent/20 flex items-center justify-center text-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-all mb-4">
                {channel.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-heading mb-1">{channel.title}</h3>
              <p className="text-sm font-mono text-brand-textMuted mb-6 truncate">
                {channel.detail}
              </p>
            </div>

            {channel.onAction ? (
              <button
                type="button"
                onClick={channel.onAction}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-deep hover:bg-brand-primary hover:text-white border border-brand-accent/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{channel.actionText}</span>
              </button>
            ) : (
              <a
                href={channel.href}
                target={channel.isExternal ? '_blank' : undefined}
                rel={channel.isExternal ? 'noopener noreferrer' : undefined}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-deep hover:bg-brand-primary hover:text-white border border-brand-accent/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{channel.actionText}</span>
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
