import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "WORLD WOOD | The World's Digital Cinema Theatre",
  description: "Experience the next generation of cinema. A premier digital theatre for elite AI-native filmmakers and global audiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(event) {
                if (
                  (event.filename && event.filename.includes('chrome-extension://')) ||
                  (event.message && event.message.includes('chrome-extension://')) ||
                  (event.error && event.error.stack && event.error.stack.includes('chrome-extension://'))
                ) {
                  event.stopImmediatePropagation();
                }
              }, true);
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && event.reason.stack && event.reason.stack.includes('chrome-extension://')) {
                  event.stopImmediatePropagation();
                }
              }, true);
            `
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="cinema-footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-logo">
                  WORLD <span>WOOD</span>
                  <p>The World's Digital Cinema Theatre.</p>
                </div>
                <div className="footer-links">
                  <div>
                    <h4>Platform</h4>
                    <a href="#">About</a>
                    <a href="/studios">Studios</a>
                    <a href="/halls">Halls</a>
                    <a href="#">Festivals</a>
                  </div>
                  <div className="footer-col">
                    <h4>Support</h4>
                    <a href="#">Help Center</a>
                    <a href="/standards">Submission Guide</a>
                    <a href="/standards">Terms of Service</a>
                    <a href="/standards">Privacy Policy</a>
                  </div>
                  <div className="footer-col">
                    <h4>Community</h4>
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                    <a href="#">Discord</a>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                &copy; 2026 WORLD WOOD. All rights reserved.
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
