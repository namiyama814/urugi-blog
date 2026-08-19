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

/** newest = source order (default), oldest = reversed, schoolyear = current 年度 (Apr-Mar) only, newest first. */
export type SortOrder = "newest" | "oldest" | "schoolyear";

/** An <img> found inside a post's sanitized contentHtml, for the /feed vertical viewer. */
export interface PostImage {
  src: string;
  alt: string;
  caption?: string;
}
