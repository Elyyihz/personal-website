/**
 * Data contract representing a syndicated or managed newsletter article.
 */
export interface ArticleItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pub_date: string;
  author: string;
  tags: string[];
  visible?: boolean;
}
