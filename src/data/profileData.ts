import type { ProfileInfo } from '@/types/profile';

/**
 * Personal profile dataset powering the Hero, About Me, and Contacts sections.
 */
export const profileData: ProfileInfo = {
  name: 'Elynne Lima',
  handle: 'Ely',
  role: 'AI Systems Engineer & Full-Stack Architect',
  headline: 'Construindo sistemas inteligentes e experiências digitais incríveis com código limpo.',
  bio: 'Sou movida pela intersecção entre o design centrado no usuário e a complexidade do backend. Transitei para a Engenharia de IA para construir não apenas sistemas que funcionam, mas ferramentas inteligentes e eficientes. Acredito na Clean Architecture e em escrever códigos claros. Quando não estou arquitetando pipelines de IA, provavelmente estou jogando algo cozy.',
  traits: [
    {
      label: 'Localização',
      value: 'Recife, PE',
      iconKey: 'location',
    },
    {
      label: 'Foco atual',
      value: 'IA & Full-Stack',
      iconKey: 'focus',
    },
    {
      label: 'MBTI',
      value: 'ISTP',
      iconKey: 'mbti',
    },
    {
      label: 'Combustível',
      value: 'Café Especial',
      iconKey: 'coffee',
    },
  ],
  socials: {
    github: 'https://github.com/Elyyihz',
    linkedin: 'https://www.linkedin.com/in/elynnelima/',
    email: 'mailto:elynnelima@gmail.com',
    instagram: 'https://instagram.com/elyylima.dev',
  },
};
