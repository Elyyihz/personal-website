/**
 * Key-value trait datum displayed in the about me summary grid.
 */
export interface ProfileTrait {
  /** Trait title or attribute name (e.g., Localização, MBTI) */
  label: string;

  /** Value representation for the trait */
  value: string;

  /** Optional icon identifier for dynamic icon mapping */
  iconKey?: string;
}

/**
 * Personal profile details and biographical overview.
 */
export interface ProfileInfo {
  /** Preferred display name */
  name: string;

  /** Short introductory handle */
  handle: string;

  /** Primary professional role description */
  role: string;

  /** Headline banner text */
  headline: string;

  /** Comprehensive biographical narrative */
  bio: string;

  /** Quick facts and traits */
  traits: ProfileTrait[];

  /** Social and professional network contact endpoints */
  socials: {
    github: string;
    linkedin: string;
    email: string;
    instagram?: string;
  };
}
