import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";

export function SectionTitle({
  light,
  bold,
  eyebrow,
}: {
  light: string;
  bold: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-14">
      <h2 className="text-display text-5xl md:text-7xl">
        <span className="text-muted-foreground/50">{light} </span>
        <span className="text-foreground">{bold}</span>
      </h2>
      {eyebrow ? (
        <p className="mt-4 text-xs tracking-[0.35em] uppercase text-muted-foreground">{eyebrow}</p>
      ) : null}
    </div>
  );
}

const projects = [
  {
    name: "STRATEGIC OPERATIONS",
    tag: "",
    line: "Your memories, beautifully preserved.",
    year: "2025",
  },
  {
    name: "BUSINESS EXPANSION",
    tag: "",
    line: "",
    year: "2025",
  },
  {
    name: "BRANDING & MARKETING",
    tag: "",
    line: "",
    year: "2024",
  },
  {
    name: "CORPORATE TRAINING",
    tag: "",
    line: "",
    year: "2024",
  },
];

const CLOCKWISE = [0, 1, 3, 2];

export function Work() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const w = wrapRef.current;
      if (!w) return;
      const total = w.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(0.999, Math.max(0, -w.getBoundingClientRect().top / total)) : 0;
      setActive(CLOCKWISE[Math.floor(p * CLOCKWISE.length)] ?? 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <section id="work" className="relative">
      <div ref={wrapRef} className="relative h-[320vh]">
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <SectionTitle light="WORK " bold="EXPERIENCE" eyebrow="Things I shipped" />
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((p, i) => (
                <GlassCard key={p.name} p={p} active={i === active} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassCard({ p, active }: { p: (typeof projects)[number]; active: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const target = useRef({ rx: 0, ry: 0, mx: 50, my: 50 });
  const cur = useRef({ rx: 0, ry: 0, mx: 50, my: 50 });
  const raf = useRef(0);

  const tick = () => {
    const el = ref.current;
    if (!el) return;
    const c = cur.current;
    const t = target.current;
    c.rx += (t.rx - c.rx) * 0.12;
    c.ry += (t.ry - c.ry) * 0.12;
    c.mx += (t.mx - c.mx) * 0.18;
    c.my += (t.my - c.my) * 0.18;
    el.style.transform = `perspective(1000px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;
    el.style.setProperty("--mx", `${c.mx}%`);
    el.style.setProperty("--my", `${c.my}%`);
    const moving =
      Math.abs(t.rx - c.rx) > 0.01 || Math.abs(t.ry - c.ry) > 0.01 || Math.abs(t.mx - c.mx) > 0.05;
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    target.current = { rx: (0.5 - py) * 20, ry: (px - 0.5) * 24, mx: px * 100, my: py * 100 };
    kick();
  };
  const onLeave = () => {
    target.current = { rx: 0, ry: 0, mx: 50, my: 50 };
    kick();
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group relative rounded-2xl border bg-card/40 p-7 backdrop-blur-md transition-[border-color,box-shadow,opacity,filter] duration-700 ${
        active ? "border-highlight opacity-100" : "border-border opacity-55 saturate-50"
      }`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow: active
          ? "0 0 0 1px color-mix(in oklab, var(--highlight) 60%, transparent), 0 0 60px -6px color-mix(in oklab, var(--highlight) 70%, transparent), inset 0 0 40px -10px color-mix(in oklab, var(--highlight) 45%, transparent)"
          : "var(--shadow-card)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--highlight) 28%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex items-start justify-between gap-6" style={{ transformStyle: "preserve-3d" }}>
        <div style={{ transformStyle: "preserve-3d" }}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground" style={{ transform: "translateZ(15px)" }}>
            {p.tag}
          </p>
          <h3
            className="text-display mt-4 text-3xl md:text-4xl transition-[text-shadow] duration-500 group-hover:[text-shadow:0_14px_24px_oklch(0_0_0/55%)]"
            style={{ transform: "translateZ(35px)" }}
          >
            {p.name}
          </h3>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground" style={{ transform: "translateZ(20px)" }}>
            {p.line}
          </p>
        </div>
        <span
          style={{ transform: "translateZ(45px)" }}
          className={`grid size-12 shrink-0 place-items-center rounded-xl transition-colors duration-700 ${
            active ? "bg-highlight text-highlight-foreground shadow-[0_0_30px_-4px_var(--highlight)]" : "bg-secondary text-muted-foreground"
          }`}
        >
          <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </div>
      <div
        className="relative mt-10 flex items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground"
        style={{ transform: "translateZ(15px)" }}
      >
        <span>{p.year}</span>
        <span className="tracking-[0.2em] uppercase">View case</span>
      </div>
    </article>
  );
}

import serviceFlash from "@/assets/service-flash.jpg";
import serviceCommunity from "@/assets/service-community.jpg";
import serviceSankaracharya from "@/assets/service-sankaracharya.jpg";
import serviceManager from "@/assets/service-manager.jpg";
import serviceBdirection from "@/assets/service-bdirection.jpg";
import serviceWorkspace from "@/assets/service-workspace.jpg";

const awards = [
  {
    image: serviceFlash,
    title: "The Flash.in",
    desc: "A fast, modern digital platform delivering lightning-quick news, updates and content experiences.",
    tags: "Web • Content • Speed",
  },
  {
    image: serviceCommunity,
    title: "Sports & Cultural Community",
    desc: "A vibrant community platform bringing people together through sports events and cultural celebrations.",
    tags: "Community • Events • Culture",
  },
  {
    image: serviceSankaracharya,
    title: "Sree Sankaracharya Institute of Advanced Skills",
    desc: "Digital presence and solutions for the educational institution — campus, courses and community.",
    tags: "Education • Institution • Web",
  },
  {
    image: serviceManager,
    title: "The Manager LLP",
    desc: "A smart management dashboard for analytics, team coordination and data-driven decisions.",
    tags: "Dashboard • Analytics • SaaS",
  },
  {
    image: serviceBdirection,
    title: "B-Direction group of company",
    desc: "Asset management and investment holding company — leading business strategy, investment operations and growth initiatives focused on performance and returns.",
    tags: "Investment • Asset Management • Growth",
  },
  {
    image: serviceWorkspace,
    title: "Workspace",
    desc: "A modern coworking space solution — booking, community and productivity under one roof.",
    tags: "Coworking • Booking • Space",
  },
];


export function Awards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const xRef = useRef(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const total = wrap.offsetHeight - window.innerHeight;
      const progress = total > 0 ? -wrap.getBoundingClientRect().top / total : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      const vw = document.documentElement.clientWidth;
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
      const first = cards[0];
      const last = cards[cards.length - 1];
      if (!first || !last) return;
      // Untransformed left edge of the track (its parent has no transform)
      const baseLeft = track.parentElement?.getBoundingClientRect().left ?? 0;
      // Start with the first card centered, end with the last card centered
      const startX = vw / 2 - (baseLeft + first.offsetLeft + first.offsetWidth / 2);
      const endX = vw / 2 - (baseLeft + last.offsetLeft + last.offsetWidth / 2);
      const newX = startX + (endX - startX) * clamped;
      setX(newX);
      xRef.current = newX;

      // 3D coverflow: rotate each card based on its distance from viewport center
      const untransformedLeft = baseLeft;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const center = untransformedLeft + card.offsetLeft + newX + card.offsetWidth / 2;
        const offset = Math.max(-1, Math.min(1, (center - vw / 2) / (vw / 2)));
        const depth = Math.abs(offset);
        card.style.transform = `rotateY(${offset * 38}deg) translateZ(${-depth * 140}px) scale(${1 - depth * 0.12})`;
        card.style.zIndex = String(100 - Math.round(depth * 50));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="awards" className="border-y border-border bg-secondary/25">
      <div ref={wrapRef} className="relative h-[240vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionTitle light="MY " bold="VENTURES." eyebrow="" />
          </div>
          <div className="w-full">
            <div
              ref={trackRef}
              className="flex items-stretch gap-6 will-change-transform"
              style={{ transform: `translate3d(${x}px,0,0)`, perspective: "1400px" }}
            >
              {awards.map((a, i) => (
                <div
                  key={a.title}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="flex w-[78vw] shrink-0 will-change-transform sm:w-[52vw] md:w-[22rem]"
                >
                  <article className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-accent/60">
                    <div className="relative h-44 shrink-0 overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-semibold leading-snug">{a.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                      <p className="mt-auto pt-6 text-xs uppercase tracking-[0.18em] text-accent">{a.tags}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <SectionTitle light="About" bold="Me" />
      <div className="grid gap-10 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-muted-foreground">
          I have been working on building businesses and initiatives focused on skill development,
          technology, entrepreneurship, and creating opportunities for young people. I strongly
          believe that India’s greatest strength is its young population, and I want to contribute
          by helping young people develop practical skills, become employable, and pursue
          entrepreneurship.

          As a strategic-minded entrepreneur, my goal is to build organizations that create
          employment, encourage innovation, and contribute meaningfully to India’s economic and
          social development.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground"></p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          ["7+", "Years building"],
          ["40+", "Products shipped"],
          ["12", "Teams collaborated"],
        ].map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-border bg-card p-7">
            <p className="text-display text-5xl text-accent">{n}</p>
            <p className="mt-3 text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-40"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-display text-5xl md:text-7xl">
          <span className="text-muted-foreground/50">Let&apos;s Work </span>
          <span>Together</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {"\n"}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:hello@akshay.dev"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Mail className="size-4" />CONNECT WITH ME
          </a>
        </div>
      </div>
    </section>
  );
}
