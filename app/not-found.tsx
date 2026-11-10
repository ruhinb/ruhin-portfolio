import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6"
    >
      <p className="text-fa font-mono text-xs tracking-[0.12em]">404</p>
      <h1 className="font-serif text-[clamp(48px,8vw,96px)] leading-none font-normal">
        Nothing <span className="italic">here</span>.
      </h1>
      <p className="text-mu text-lg">That page doesn&apos;t exist, or it has moved.</p>
      <Link
        href="/"
        className="bg-inv text-inv-tx inline-flex h-12 items-center rounded-full px-6 text-sm font-medium"
      >
        Back to the home page
      </Link>
    </main>
  );
}
