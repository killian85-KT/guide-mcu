import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-hairline px-5 py-4">
      <Link
        href="/"
        className="inline-block font-sans text-[15px] font-bold tracking-[0.3em] text-ink"
      >
        ARKORA
      </Link>
    </header>
  );
}
