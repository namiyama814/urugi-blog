import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BookmarksProvider } from "@/contexts/BookmarksContext";
import { ImageBookmarksProvider } from "@/contexts/ImageBookmarksContext";
import { ReadHistoryProvider } from "@/contexts/ReadHistoryContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

// Runs before hydration so the stored theme preference applies on first paint,
// with no flash of the wrong theme. Kept in sync with contexts/ThemeContext.tsx's
// storage key/values.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("urugi-blog:theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "山村留学売木学園 ブログ",
  description: "山村留学売木学園の非公式ブログクライアントアプリ",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <BookmarksProvider>
            <ImageBookmarksProvider>
              <ReadHistoryProvider>
                <Header />
                <main className="flex flex-1 flex-col">{children}</main>
                <Footer />
              </ReadHistoryProvider>
            </ImageBookmarksProvider>
          </BookmarksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
