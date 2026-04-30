import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Campus Companion",
  description: "Your all-in-one student hub.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f6fa]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main" className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-400 py-6">
          Campus Companion &copy; 2025 — All data is fictional.
        </footer>
      </body>
    </html>
  );
}
