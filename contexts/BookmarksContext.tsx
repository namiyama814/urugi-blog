"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface Bookmark {
  slug: string;
  title: string;
  date: string;
  bookmarkedAt: string;
}

const STORAGE_KEY = "urugi-blog:bookmarks";
const EMPTY_BOOKMARKS: Bookmark[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

let cachedRaw: string | null = null;
let cachedBookmarks: Bookmark[] = EMPTY_BOOKMARKS;

/** Returns a stable array reference unless the underlying localStorage value actually changed. */
function readBookmarks(): Bookmark[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedBookmarks = raw ? (JSON.parse(raw) as Bookmark[]) : EMPTY_BOOKMARKS;
    }
    return cachedBookmarks;
  } catch {
    return cachedBookmarks;
  }
}

function writeBookmarks(bookmarks: Bookmark[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): Bookmark[] {
  return EMPTY_BOOKMARKS;
}

interface BookmarksContextValue {
  bookmarks: Bookmark[];
  isBookmarked: (slug: string) => boolean;
  toggle: (post: { slug: string; title: string; date: string }) => void;
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const bookmarks = useSyncExternalStore(
    subscribe,
    readBookmarks,
    getServerSnapshot,
  );

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.some((b) => b.slug === slug),
    [bookmarks],
  );

  const toggle = useCallback(
    (post: { slug: string; title: string; date: string }) => {
      const current = readBookmarks();
      const next = current.some((b) => b.slug === post.slug)
        ? current.filter((b) => b.slug !== post.slug)
        : [{ ...post, bookmarkedAt: new Date().toISOString() }, ...current];
      writeBookmarks(next);
    },
    [],
  );

  const value = useMemo(
    () => ({ bookmarks, isBookmarked, toggle }),
    [bookmarks, isBookmarked, toggle],
  );

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks(): BookmarksContextValue {
  const ctx = useContext(BookmarksContext);
  if (!ctx) {
    throw new Error("useBookmarks must be used within BookmarksProvider");
  }
  return ctx;
}
