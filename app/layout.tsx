import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BookmarksProvider } from "@/contexts/BookmarksContext";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "うるぎブログ（非公式）",
  description: "山村留学売木学園の非公式ブログクライアントアプリ",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <BookmarksProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </BookmarksProvider>
      </body>
    </html>
  );
}
