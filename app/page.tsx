import { ThemeToggle } from "@/components/nav/theme-toggle";
import { site } from "@/content/site";
import { buildYear } from "@/lib/build-date";

// Stage 1 holding page: proves fonts, colours and both themes work end to end.
// Stage 2 replaces it with the real hero, experience and contact sections.
export default async function Home() {
  const year = await buildYear();

  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-between gap-16 px-6 py-8 sm:px-10"
    >
      <header className="text-fa flex items-center justify-between font-mono text-xs tracking-[0.1em]">
        <span>{site.name.toUpperCase()}</span>
        <ThemeToggle />
      </header>

      <section aria-labelledby="name" className="flex flex-col gap-6">
        <p className="text-ac-tx font-mono text-xs tracking-[0.12em]">
          {site.role.toUpperCase()} · {site.location.toUpperCase()}
        </p>
        <h1
          id="name"
          className="font-serif text-[clamp(64px,11vw,168px)] leading-[0.95] font-normal tracking-[-0.02em]"
        >
          Rubaiyat <span className="italic">Ruhin</span>
        </h1>
        <p className="text-mu max-w-xl text-lg leading-relaxed">
          Turning data into <span className="text-tx font-serif text-2xl italic">decisions</span>.
          The full site is being built. In the meantime, find me on{" "}
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tx decoration-bd2 hover:decoration-accent underline underline-offset-4"
          >
            LinkedIn
          </a>{" "}
          or{" "}
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tx decoration-bd2 hover:decoration-accent underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <footer className="border-bd text-fa flex flex-wrap items-center justify-between gap-4 border-t pt-6 font-mono text-[11px] tracking-[0.08em]">
        <span>
          © {year} {site.name.toUpperCase()}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="bg-accent h-2 w-2 rounded-full" />
          ADELAIDE, SA
        </span>
      </footer>
    </main>
  );
}
