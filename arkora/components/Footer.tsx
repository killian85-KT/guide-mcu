import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "#", label: "Mon parcours" },
  { href: "#", label: "Le catalogue" },
];

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/arkora.os", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.tiktok.com/@arkora.os", label: "TikTok", icon: TikTokIcon },
  { href: "https://www.youtube.com/@Arkora-OS", label: "YouTube", icon: YouTubeIcon },
  { href: "#", label: "Facebook", icon: FacebookIcon },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">{children}</p>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-paper-warm px-5 py-10">
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        <div className="flex flex-col gap-3">
          <ColumnTitle>Navigation</ColumnTitle>
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] text-ink-2 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <ColumnTitle>Arkora</ColumnTitle>
          <div className="flex flex-col gap-1.5 text-[12px] text-ink-2">
            <p>Guide éditorial indépendant</p>
            <p>Non affilié à Marvel Studios</p>
            <a href="mailto:contact@arkora.fr" className="hover:text-ink">
              contact@arkora.fr
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ColumnTitle>Légal</ColumnTitle>
          <nav className="flex flex-col gap-1.5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] text-ink-2 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <ColumnTitle>Nous suivre</ColumnTitle>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink transition-opacity hover:opacity-70"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center font-mono text-[10px] tracking-widest text-ink-3">
        © 2026 BY ARKORA
      </p>
    </footer>
  );
}

/* Icônes simples en ligne, 20px, currentColor (hérite de text-ink = #16181D) */

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4h-2.5A3.5 3.5 0 0 0 9 7.5V10H6.5v3H9v7h3v-7h2.5l.5-3H12V7.5c0-.55.45-1 1-1H15V4Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.5 6.4a2.8 2.8 0 0 0-1.9-2C18.9 4 12 4 12 4s-6.9 0-8.6.4a2.8 2.8 0 0 0-1.9 2A29 29 0 0 0 1 11.7a29 29 0 0 0 .5 5.3 2.8 2.8 0 0 0 1.9 2c1.7.4 8.6.4 8.6.4s6.9 0 8.6-.4a2.8 2.8 0 0 0 1.9-2 29 29 0 0 0 .5-5.3 29 29 0 0 0-.5-5.3Z" />
      <polygon points="9.8 15 15.5 11.7 9.8 8.5 9.8 15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82c-.7-.77-1.09-1.77-1.09-2.82h-3.2v13.4a2.59 2.59 0 1 1-1.83-2.48V10.5a5.9 5.9 0 1 0 5.03 5.83V9.4a7.6 7.6 0 0 0 4.49 1.45V7.65a4.85 4.85 0 0 1-3.4-1.83Z" />
    </svg>
  );
}
