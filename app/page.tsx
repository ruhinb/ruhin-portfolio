import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { ProjectsSoon } from "@/components/home/projects-soon";
import { ScrollFallback } from "@/components/motion/scroll-fallback";
import { MobileNav } from "@/components/nav/mobile-nav";
import { TopNav } from "@/components/nav/top-nav";
import { Loader } from "@/components/overlays/loader";
import { ResumeViewer } from "@/components/overlays/resume-viewer";
import { PageBehaviour } from "@/components/page-behaviour";
import { Grain } from "@/components/ui/grain";

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="bg-inv text-inv-tx sr-only z-500 rounded-full px-5 py-3 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Loader />
      <TopNav />
      <MobileNav />

      <main id="main">
        {/* The hero stays put while the sheet with the rest of the page slides up over it. */}
        <div className="relative z-[1]">
          <Hero />
          <div
            id="sheet"
            className="sheetin tc bg-sheet relative z-[2] overflow-clip rounded-t-[28px]"
            style={{ boxShadow: "0 -30px 80px rgba(0,0,0,var(--sheet-shadow))" }}
          >
            <About />
            <Experience />
            <ProjectsSoon />
            <div className="h-[120px]" />
          </div>
        </div>
        <Contact />
      </main>

      <ResumeViewer />
      <Grain />
      <PageBehaviour />
      <ScrollFallback />
    </>
  );
}
