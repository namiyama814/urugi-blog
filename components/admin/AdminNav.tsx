"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "概要" },
  { href: "/admin/articles", label: "記事" },
  { href: "/admin/search", label: "検索" },
  { href: "/admin/usage", label: "利用状況" },
  { href: "/admin/errors", label: "エラー" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-foreground/10">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 px-3 py-2 text-sm ${
              active
                ? "border-b-2 border-foreground font-medium text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
