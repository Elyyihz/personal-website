/**
 * Represents a featured engineering or architectural portfolio project.
 */
export interface Project {
  /** Unique project identifier */
  id: string;

  /** Display title of the project */
  title: string;

  /** Comprehensive summary of the problem solved and engineering architecture */
  description: string;

  /** Technology stack labels associated with the project */
  tags: string[];

  /** GitHub repository hyperlink if publicly hosted */
  githubUrl?: string;

  /** Live demonstration or interactive playground hyperlink */
  demoUrl?: string;

  /** Whether the project should be highlighted on the main grid banner */
  featured?: boolean;
}
