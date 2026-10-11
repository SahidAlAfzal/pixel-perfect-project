import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import spawn from "@/assets/spawn.png.asset.json";
import cave from "@/assets/cave.png.asset.json";
import nether from "@/assets/nether.png.asset.json";
import cherry from "@/assets/cherry.png.asset.json";
import minecart from "@/assets/minecart.png";
import enderChest from "@/assets/ender-chest.png";
import largeChest from "@/assets/large-chest.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import { isNearProjectChest, PLAYER_STATS, SPAWN_SIGN_SCALE, worldAt } from "@/lib/world-progress";

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
  { name: "IrisDB", desc: "C++ relational database engine", symbol: "DB", url: GITHUB },
  { name: "HydroGate", desc: "C++ distributed rate-limiting proxy", symbol: "<>界".slice(0, 2), url: GITHUB },
  { name: "MessBook", desc: "FastAPI · Hostel management backend", symbol: "Py", url: GITHUB },
];

function Index() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [moving, setMoving] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [activeWorld, setActiveWorld] = useState(0);
  const [achievement, setAchievement] = useState(false);
  const [selectedProject, setSelectedProject] = useState(0);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    let achievementTimer: ReturnType<typeof setTimeout>;
    let lastTime = 0;
    let previousWorld = -1;
    let chestEntered = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (time: number) => {
      const max = window.innerWidth * 3;
      const target = Math.min(window.scrollY, max);
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      current = reducedMotion ? target : current + (target - current) * (1 - Math.exp(-8 * dt));
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-current}px,0,0)`;
      const progress = current / window.innerWidth;
      const world = worldAt(progress);
      if (world !== previousWorld) {
        previousWorld = world;
        setActiveWorld(world);
        clearTimeout(achievementTimer);
        setAchievement(world === 3);
        if (world === 3) achievementTimer = setTimeout(() => setAchievement(false), 9000);
      }
      if (isNearProjectChest(progress) && !chestEntered) {
        chestEntered = true;
        setProjectsOpen(true);
      } else if (progress < 1.65 || progress > 2.5) {
        chestEntered = false;
        setProjectsOpen(false);
      }
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
      clearTimeout(timer);
      clearTimeout(achievementTimer);
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
          <div className="spawn-sign" style={{ transform: `scale(${SPAWN_SIGN_SCALE})` }}>
            <div className="mc-wood px-8 py-6 text-center">
              <h1>Welcome to {NAME}'s World</h1>
              <p className="mt-4">Role: Backend Engineer</p>
            </div>
          </div>
          <div className="spawn-prompt animate-blink text-gold text-pixel-shadow">Scroll to Explore ▶▶</div>

          {/* Section 2: Cave */}
          <div className="mc-panel cave-crafting absolute">
            <p className="mb-3 text-[10px] text-muted-foreground">Crafting — Tech Stack</p>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => {
                const item = [0, 1, 2, 4, 7].indexOf(i);
                return (
                  <div key={i} className="mc-slot mc-hover crafting-slot flex items-center justify-center text-center">
                    {item >= 0 && <span className="text-pixel-shadow">{stack[item]}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Nether */}
          <Button variant="ghost" className={`physical-chest ${projectsOpen ? "chest-is-open" : ""}`} onClick={() => setProjectsOpen(true)} aria-label="Open Large Chest projects" title="Large Chest — Projects">
            <span className="chest-sprite">
              <img src={largeChest} width={816} height={816} loading="lazy" alt="Large wooden chest" className="chest-base" />
              <img src={largeChest} width={816} height={816} loading="lazy" alt="" className="chest-lid" />
            </span>
          </Button>

          {/* Section 4: Cherry */}
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="contact-chest"
            title="Ender Chest — Contact"
            aria-label="Open Ender Chest for contact links"
          >
            <img src={enderChest} alt="Ender chest" width={96} height={96} loading="lazy" />
          </Button>
        </div>

        {/* Fixed minecart */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ bottom: "calc(40% + 6px)" }}>
          <img src={minecart} alt="Minecart" width={120} height={81} className={`w-28 ${moving ? "animate-rattle" : ""}`} />
        </div>
        {activeWorld === 1 && (
          <div className="xp-hud" aria-label={`LeetCode XP level ${PLAYER_STATS.level}; CGPA ${PLAYER_STATS.cgpa.toFixed(1)}`}>
            <div className="xp-name">{PLAYER_STATS.cgpa.toFixed(1)} CGPA</div>
            <div className="xp-level">{PLAYER_STATS.level}</div>
            <div className="xp-bar"><div className="xp-fill" /></div>
          </div>
        )}
        {achievement && (
          <aside className="achievement-toast" role="status">
            <Trophy className="achievement-icon" size={32} />
            <div>
              <p>Achievement Unlocked!</p>
              <h2>Incoming Google<br />Software Engineering Intern</h2>
              <small>Summer 2027</small>
            </div>
          </aside>
        )}
      </div>

      <Dialog open={projectsOpen} onOpenChange={setProjectsOpen}>
        <DialogContent className="large-inventory">
          <DialogTitle className="inventory-title text-gold">Large Chest</DialogTitle>
          <DialogDescription className="text-[9px] text-muted-foreground">Projects</DialogDescription>
          <div className="inventory-grid">
            {Array.from({ length: 54 }, (_, i) => {
              const project = projects[i];
              return project ? (
                <Button key={i} variant="ghost" className="inventory-cell project-slot" aria-label={project.name} aria-pressed={selectedProject === i} title={project.name} onClick={() => setSelectedProject(i)}>{project.symbol}</Button>
              ) : <div key={i} className="inventory-cell" aria-hidden="true" />;
            })}
          </div>
          <div className="project-detail">
            <h3>{projects[selectedProject]?.name}</h3>
            <p>{projects[selectedProject]?.desc}</p>
            <Button asChild variant="secondary" className="mc-btn project-link"><a href={projects[selectedProject]?.url} target="_blank" rel="noreferrer">GitHub ↗</a></Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="mc-panel w-[calc(100vw-32px)] max-w-80 p-6">
          <DialogTitle className="inventory-title text-ender">Ender Chest</DialogTitle>
          <DialogDescription className="sr-only">Contact links</DialogDescription>
          <div className="flex flex-col gap-3">
            <Button asChild variant="secondary" className="mc-btn text-[10px]"><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a></Button>
            <Button asChild variant="secondary" className="mc-btn text-[10px]"><a href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></Button>
            <Button asChild variant="secondary" className="mc-btn text-[10px]"><a href="mailto:you@example.com">Email</a></Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
