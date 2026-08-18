/** Path segments after the source site's /blog/ base, e.g. ["2026", "08", "post-21117"]. */
export type PostSlug = string[];

export interface PostSummary {
  slug: PostSlug;
  url: string;
  title: string;
  /** Date as shown on the source site, format YY/MM/DD. */
  date: string;
}

export interface PostDetail extends PostSummary {
  contentHtml: string;
}

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  lastPage: number;
}
