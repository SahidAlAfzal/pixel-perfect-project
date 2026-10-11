import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import spawn from "@/assets/spawn.png.asset.json";
import cave from "@/assets/cave.png.asset.json";
import nether from "@/assets/nether.png.asset.json";
import cherry from "@/assets/cherry.png.asset.json";
import minecart from "@/assets/minecart.png";
import enderChest from "@/assets/ender-chest.png";

const NAME = "Sahid";
const GITHUB = "https://github.com/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${NAME}'s World — Backend Engineer Portfolio` },
      { name: "description", content: "An 8-bit minecart ride through the projects and skills of a backend systems engineer." },
      { property: "og:title", content: `${NAME}'s World — Backend Engineer` },
      { property: "og:description", content: "Ride the minecart through C++ databases, rate-limiting proxies and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const stack = ["C++", "Python", "FastAPI", "PostgreSQL", "Redis"];
const projects = [
  { name: "IrisDB", desc: "C++ relational database engine", url: GITHUB },
  { name: "HydroGate", desc: "C++ distributed rate-limiting proxy", url: GITHUB },
  { name: "MessBook", desc: "Hostel management backend", url: GITHUB },
];

function Index() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [moving, setMoving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const max = window.innerWidth * 3;
      const target = Math.min(window.scrollY, max);
      current += (target - current) * 0.12;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-current}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      setMoving(true);
      clearTimeout(timer);
      timer = setTimeout(() => setMoving(false), 200);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main style={{ height: "calc(300vw + 100vh)" }}>
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <div ref={trackRef} className="relative flex h-screen will-change-transform" style={{ width: "400vw" }}>
          {[spawn, cave, nether, cherry].map((bg, i) => (
            <section
              key={i}
              className="relative h-screen w-screen shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bg.url})`, imageRendering: "pixelated" }}
            />
          ))}

          <div className="rail-track pointer-events-none absolute left-0 h-5 w-full" style={{ bottom: "40%" }} />

          {/* Section 1: Spawn */}
          <div className="absolute top-[12%] left-[50vw] -translate-x-1/2 flex flex-col items-center">
            <div className="mc-wood mc-hover animate-bob px-8 py-6 text-center">
              <h1 className="text-lg leading-relaxed md:text-2xl">Welcome to {NAME}'s World</h1>
              <p className="mt-4 text-xs md:text-sm">Role: Backend Engineer</p>
            </div>
            <div className="mt-2 h-16 w-3 bg-wood" />
            <div className="animate-blink mt-6 text-xs text-gold text-pixel-shadow">Scroll to Explore ▶▶</div>
          </div>

          {/* Section 2: Cave */}
          <p className="absolute top-[8%] left-[150vw] -translate-x-1/2 whitespace-nowrap text-[10px] text-xp text-pixel-shadow md:text-sm">
            Stats: 700+ LeetCode Solved | 9.0 CGPA
          </p>
          <div className="mc-panel absolute top-[20%] left-[150vw] -translate-x-1/2 p-4">
            <p className="mb-3 text-[10px] text-muted-foreground">Crafting — Tech Stack</p>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => {
                const item = [0, 1, 2, 4, 7].indexOf(i);
                return (
                  <div key={i} className="mc-slot mc-hover flex h-16 w-16 items-center justify-center text-center text-[8px] md:h-20 md:w-20 md:text-[9px]">
                    {item >= 0 && <span className="text-pixel-shadow">{stack[item]}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Nether */}
          <div className="absolute top-[10%] left-[250vw] -translate-x-1/2 flex gap-4">
            {projects.map((p) => (
              <div key={p.name} className="mc-panel mc-hover w-44 p-4 md:w-56">
                <div className="mc-slot mb-3 flex h-10 items-center justify-center text-[10px] text-gold">▣ Chest</div>
                <h3 className="text-sm text-accent text-pixel-shadow">{p.name}</h3>
                <p className="mt-3 text-[9px] leading-relaxed">{p.desc}</p>
                <a href={p.url} target="_blank" rel="noreferrer" className="mc-btn mt-4 block py-2 text-center text-[9px]">
                  GitHub
                </a>
              </div>
            ))}
          </div>

          {/* Section 4: Cherry */}
          <div className="mc-wood mc-hover absolute top-[12%] left-[350vw] -translate-x-1/2 max-w-[70vw] px-8 py-6 text-center">
            <p className="text-[10px]">★ Achievement Unlocked ★</p>
            <h2 className="mt-4 text-sm leading-loose md:text-lg">
              Incoming Google Software Engineering Intern, Summer 2027
            </h2>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="mc-hover absolute flex flex-col items-center"
            style={{ left: "calc(400vw - 200px)", bottom: "calc(40% + 12px)" }}
            aria-label="Open Ender Chest for contact links"
          >
            <span className="animate-blink mb-2 text-[9px] text-ender text-pixel-shadow">Click me</span>
            <img src={enderChest} alt="Ender chest" width={96} height={96} className="h-24 w-24" />
          </button>
        </div>

        {/* Fixed minecart */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ bottom: "calc(40% + 6px)" }}>
          <img src={minecart} alt="Minecart" width={120} height={81} className={`w-28 ${moving ? "animate-rattle" : ""}`} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70" onClick={() => setOpen(false)}>
          <div className="mc-panel w-80 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-5 text-sm text-ender text-pixel-shadow">Ender Chest</h3>
            <div className="flex flex-col gap-3">
              <a className="mc-btn py-3 text-center text-[10px]" href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
              <a className="mc-btn py-3 text-center text-[10px]" href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="mc-btn py-3 text-center text-[10px]" href="mailto:you@example.com">Email</a>
            </div>
            <button className="mc-btn mt-5 w-full py-2 text-[10px]" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
