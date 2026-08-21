import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-paper-warm px-5 py-8">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <p className="text-[12px] leading-relaxed text-ink-2">
          Arkora est un guide éditorial indépendant. Nous ne sommes affiliés ni à Marvel
          Studios, ni à The Walt Disney Company, ni à aucun ayant droit. Nous n&rsquo;hébergeons
          et ne diffusons aucun contenu vidéo. Les titres et marques cités appartiennent à
          leurs propriétaires respectifs.
        </p>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] text-ink-2 underline underline-offset-4 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="font-mono text-[10px] tracking-widest text-ink-3">© 2026 BY ARKORA</p>
      </div>
    </footer>
  );
}
