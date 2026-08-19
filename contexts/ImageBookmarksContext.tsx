"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface ImageBookmark {
  src: string;
  alt: string;
  caption?: string;
  postSlug: string;
  postTitle: string;
  bookmarkedAt: string;
}

const STORAGE_KEY = "urugi-blog:image-bookmarks";
const EMPTY_IMAGE_BOOKMARKS: ImageBookmark[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

let cachedRaw: string | null = null;
let cachedBookmarks: ImageBookmark[] = EMPTY_IMAGE_BOOKMARKS;

/** Returns a stable array reference unless the underlying localStorage value actually changed. */
function readImageBookmarks(): ImageBookmark[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedBookmarks = raw ? (JSON.parse(raw) as ImageBookmark[]) : EMPTY_IMAGE_BOOKMARKS;
    }
    return cachedBookmarks;
  } catch {
    return cachedBookmarks;
  }
}

function writeImageBookmarks(bookmarks: ImageBookmark[]) {
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

function getServerSnapshot(): ImageBookmark[] {
  return EMPTY_IMAGE_BOOKMARKS;
}

interface ImageBookmarksContextValue {
  imageBookmarks: ImageBookmark[];
  isImageBookmarked: (src: string) => boolean;
  toggleImage: (image: {
    src: string;
    alt: string;
    caption?: string;
    postSlug: string;
    postTitle: string;
  }) => void;
}

const ImageBookmarksContext = createContext<ImageBookmarksContextValue | null>(null);

export function ImageBookmarksProvider({ children }: { children: ReactNode }) {
  const imageBookmarks = useSyncExternalStore(
    subscribe,
    readImageBookmarks,
    getServerSnapshot,
  );

  const isImageBookmarked = useCallback(
    (src: string) => imageBookmarks.some((b) => b.src === src),
    [imageBookmarks],
  );

  const toggleImage = useCallback(
    (image: {
      src: string;
      alt: string;
      caption?: string;
      postSlug: string;
      postTitle: string;
    }) => {
      const current = readImageBookmarks();
      const next = current.some((b) => b.src === image.src)
        ? current.filter((b) => b.src !== image.src)
        : [{ ...image, bookmarkedAt: new Date().toISOString() }, ...current];
      writeImageBookmarks(next);
    },
    [],
  );

  const value = useMemo(
    () => ({ imageBookmarks, isImageBookmarked, toggleImage }),
    [imageBookmarks, isImageBookmarked, toggleImage],
  );

  return (
    <ImageBookmarksContext.Provider value={value}>
      {children}
    </ImageBookmarksContext.Provider>
  );
}

export function useImageBookmarks(): ImageBookmarksContextValue {
  const ctx = useContext(ImageBookmarksContext);
  if (!ctx) {
    throw new Error("useImageBookmarks must be used within ImageBookmarksProvider");
  }
  return ctx;
}
