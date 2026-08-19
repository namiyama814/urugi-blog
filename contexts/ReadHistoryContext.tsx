"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "urugi-blog:read-history";
const EMPTY_READ_SLUGS: string[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

let cachedRaw: string | null = null;
let cachedSlugs: string[] = EMPTY_READ_SLUGS;

/** Returns a stable array reference unless the underlying localStorage value actually changed. */
function readSlugs(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSlugs = raw ? (JSON.parse(raw) as string[]) : EMPTY_READ_SLUGS;
    }
    return cachedSlugs;
  } catch {
    return cachedSlugs;
  }
}

function writeSlugs(slugs: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
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

function getServerSnapshot(): string[] {
  return EMPTY_READ_SLUGS;
}

interface ReadHistoryContextValue {
  isRead: (slug: string) => boolean;
  markRead: (slug: string) => void;
}

const ReadHistoryContext = createContext<ReadHistoryContextValue | null>(null);

export function ReadHistoryProvider({ children }: { children: ReactNode }) {
  const readSlugList = useSyncExternalStore(
    subscribe,
    readSlugs,
    getServerSnapshot,
  );

  const isRead = useCallback(
    (slug: string) => readSlugList.includes(slug),
    [readSlugList],
  );

  const markRead = useCallback((slug: string) => {
    const current = readSlugs();
    if (current.includes(slug)) return;
    writeSlugs([slug, ...current]);
  }, []);

  const value = useMemo(() => ({ isRead, markRead }), [isRead, markRead]);

  return (
    <ReadHistoryContext.Provider value={value}>
      {children}
    </ReadHistoryContext.Provider>
  );
}

export function useReadHistory(): ReadHistoryContextValue {
  const ctx = useContext(ReadHistoryContext);
  if (!ctx) {
    throw new Error("useReadHistory must be used within ReadHistoryProvider");
  }
  return ctx;
}
