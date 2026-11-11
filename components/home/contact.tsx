import { Fragment } from "react";
import { marquee } from "@/content/about";
import { site } from "@/content/site";
import { buildYear } from "@/lib/build-date";
import { ResumeButton } from "@/components/ui/resume-button";
import { Email } from "./email";
import { SectionLabel } from "./section-label";

const pill =
  "tc border-bd2 inline-flex h-11 items-center rounded-full border px-[18px] text-sm font-medium no-underline";

function Star() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Sits underneath the page and is revealed as the sheet above it scrolls away.
export async function Contact() {
  const year = await buildYear();
  const items = [...marquee, ...marquee];

  return (
    <section
      id="contact"
      aria-labelledby="contact-h"
      className="tc bg-bg sticky bottom-0 z-0 overflow-hidden outline-none"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="glow2 absolute top-[10%] left-[30%] h-[60vw] max-h-[900px] w-[60vw] max-w-[900px] rounded-full blur-[40px]"
          style={{ background: "radial-gradient(circle, var(--glow-a) 0%, transparent 62%)" }}
        />
      </div>

      <div aria-hidden="true" className="tc border-bd relative overflow-hidden border-b py-6">
        <div className="marq">
          {items.map((t, i) => (
            <Fragment key={i}>
              <span
                className={`inline-flex items-center gap-8 pr-8 font-serif text-[clamp(36px,4.4vw,64px)] leading-none whitespace-nowrap ${
                  i % 2 ? "text-mu italic" : "text-tx"
                }`}
              >
                {t}
                <Star />
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="cwrap relative mx-auto flex max-w-[1180px] flex-col gap-10 px-6 pt-20 pb-10">
        <div className="flex flex-col gap-[18px]">
          <SectionLabel n="05" reveal={false}>
            Contact
          </SectionLabel>
          <h2
            id="contact-h"
            className="bigtalk ctalk m-0 origin-[0_100%] font-serif text-[clamp(72px,13vw,200px)] leading-[0.85] font-normal tracking-[-0.03em]"
          >
            Let&apos;s <span className="italic">talk.</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex min-w-0 flex-col gap-3">
            <span className="tc text-mu text-[15px]">
              Hiring for a data role, or have a dataset with a question in it?
            </span>
            <Email />
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-mag
              className={pill}
            >
              LinkedIn ↗
            </a>
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              data-mag
              className={pill}
            >
              GitHub ↗
            </a>
            <ResumeButton
              magnetic
              className={`${pill} cursor-pointer bg-transparent font-sans text-inherit`}
            />
          </div>
        </div>

        <footer className="tc border-bd text-fa mt-10 flex flex-wrap justify-between gap-3 border-t pt-7 font-mono text-xs">
          <span>
            © {year} {site.name} · {site.location}
          </span>
          <a href="#top" className="no-underline">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
