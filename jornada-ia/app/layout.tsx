import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jornada IA",
  description: "Uma jornada sobre inteligência artificial para executivos brasileiros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Aviso para telas menores que 1024px */}
        <div className="mobile-warning">
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🖥️</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", marginBottom: "12px" }}>
            Experiência Desktop
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text)", maxWidth: "320px", opacity: 0.7 }}>
            A Jornada IA foi projetada para desktop. Acesse em uma tela com pelo menos 1024px de largura.
          </p>
        </div>

        {/* Conteúdo principal */}
        <div className="app-content">
          {children}
        </div>
      </body>
    </html>
  );
}
