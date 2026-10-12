import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import spawn from "@/assets/spawn.png";
import cave from "@/assets/cave.png";
import nether from "@/assets/nether.png";
import cherry from "@/assets/cherry.png";
import minecart from "@/assets/minecart.png";
import enderChest from "@/assets/ender-chest.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Flame, Gem, Trophy } from "lucide-react";
import {
  biomeAt,
  CART_SCALE,
  PLAYER_STATS,
  terrainPath,
  terrainY,
  worldAt,
  type Biome,
} from "@/lib/world-progress";

const NAME = "Sahid";
const GITHUB = "https://github.com/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${NAME}'s World — Backend Engineer Portfolio` },
      {
        name: "description",
        content:
          "An 8-bit minecart ride through the projects and skills of a backend systems engineer.",
      },
      { property: "og:title", content: `${NAME}'s World — Backend Engineer` },
      {
        property: "og:description",
        content: "Ride the minecart through C++ databases, rate-limiting proxies and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const hotbar = ["C++", "Py", "PG", "API", "RDS", "", "", "", ""];
const hotbarNames = ["C++", "Python", "PostgreSQL", "FastAPI", "Redis"];
const loot = [
  {
    name: "IrisDB",
    item: "Diamond",
    Icon: Gem,
    lines: ["C++ relational database engine", "B+ tree storage · SQL parser"],
    x: 222,
  },
  {
    name: "HydroGate",
    item: "Enchanted Book",
    Icon: BookOpen,
    lines: ["C++ distributed rate-limiting proxy", "Token bucket · Redis sync"],
    x: 236,
  },
  {
    name: "MessBook",
    item: "Redstone Torch",
    Icon: Flame,
    lines: ["FastAPI hostel management backend", "PostgreSQL · REST"],
    x: 250,
  },
];

function Index() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const [moving, setMoving] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeWorld, setActiveWorld] = useState(0);
  const [biome, setBiome] = useState<Biome>("spawn");
  const [achievement, setAchievement] = useState(false);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    let achievementTimer: ReturnType<typeof setTimeout>;
    let lastTime = 0;
    let previousWorld = -1;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (time: number) => {
      const max = window.innerWidth * 3;
      const target = Math.min(window.scrollY, max);
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      current = reducedMotion ? target : current + (target - current) * (1 - Math.exp(-8 * dt));
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-current}px,0,0)`;
      const progress = current / window.innerWidth;
      if (cartRef.current) {
        const x = progress + 0.5;
        const y = terrainY(x);
        const slope = (terrainY(x + 0.02) - terrainY(x - 0.02)) / 0.04;
        const angle = (Math.atan2(slope * window.innerHeight, 100 * window.innerWidth) * 180) / Math.PI;
        cartRef.current.style.top = `${y}vh`;
        cartRef.current.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
      }
      const world = worldAt(progress);
      if (world !== previousWorld) {
        previousWorld = world;
        setActiveWorld(world);
        setBiome(biomeAt(progress));
        clearTimeout(achievementTimer);
        setAchievement(world === 3);
        if (world === 3) achievementTimer = setTimeout(() => setAchievement(false), 9000);
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
        <div
          ref={trackRef}
          className="relative flex h-screen will-change-transform"
          style={{ width: "400vw" }}
        >
          {[spawn, cave, nether, cherry].map((bg, i) => (
            <section
              key={i}
              className="relative h-screen w-screen shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bg})`, imageRendering: "pixelated" }}
            />
          ))}

          <svg
            className="rail-svg pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={terrainPath()} className="rail-ties" vectorEffect="non-scaling-stroke" />
            <path d={terrainPath()} className="rail-steel" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Nether loot drops */}
          {loot.map(({ name, item, Icon, lines, x }) => (
            <button
              key={name}
              type="button"
              className="loot-drop"
              style={{ left: `${x}vw`, top: `${terrainY(x / 100)}vh` }}
              aria-label={`${item}: ${name} — ${lines.join(". ")}`}
            >
              <Icon className="loot-icon" size={28} aria-hidden="true" />
              <span className="mc-tooltip" role="tooltip">
                <strong>{name}</strong>
                <em>{item}</em>
                {lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
            </button>
          ))}

          {/* Cherry: Ender chest */}
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="contact-chest"
            style={{ top: `${terrainY(3.88)}vh` }}
            title="Ender Chest — Contact"
            aria-label="Open Ender Chest for contact links"
          >
            <img src={enderChest} alt="Ender chest" width={96} height={96} loading="lazy" />
          </Button>
        </div>

        {/* Terrain-following minecart */}
        <div
          ref={cartRef}
          className="cart-rider pointer-events-none absolute left-1/2"
          data-biome={biome}
          style={{ top: `${terrainY(0.5)}vh`, transform: "translate(-50%,-100%)" }}
        >
          <img
            src={minecart}
            alt="Minecart"
            width={120}
            height={81}
            style={{ width: `${7 * CART_SCALE * 1.15}rem` }}
            className={moving ? "animate-rattle" : ""}
          />
        </div>

        {activeWorld === 0 && (
          <div className="mc-chat" aria-label="Chat">
            <p className="chat-server">[Server] Welcome to the server.</p>
            <p>&lt;Sahid_Al_Afzal&gt; I'm a Backend &amp; Systems Engineer.</p>
            <p className="chat-system">[System] Use the scroll wheel to explore.</p>
          </div>
        )}

        {activeWorld === 1 && (
          <div className="xp-hud">
            <div className="name-tag">{PLAYER_STATS.cgpa.toFixed(1)} CGPA</div>
            <div className="xp-level" aria-label={`XP level ${PLAYER_STATS.level}, LeetCode solved`}>
              {PLAYER_STATS.level}
            </div>
            <div className="xp-bar">
              <div className="xp-fill" />
            </div>
            <ul className="hotbar" aria-label="Tech stack hotbar">
              {hotbar.map((label, i) => (
                <li key={i} className={i === 0 ? "selected" : ""} title={hotbarNames[i]}>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {achievement && (
          <aside className="achievement-toast" role="status">
            <Trophy className="achievement-icon" size={32} />
            <div>
              <p>Achievement Unlocked!</p>
              <h2>
                Incoming Google
                <br />
                Software Engineering Intern
              </h2>
              <small>Summer 2027</small>
            </div>
          </aside>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="mc-panel w-[calc(100vw-32px)] max-w-80 p-6">
          <DialogTitle className="inventory-title text-ender">Ender Chest</DialogTitle>
          <DialogDescription className="sr-only">Contact links</DialogDescription>
          <div className="flex flex-col gap-3">
            <Button asChild variant="secondary" className="mc-btn text-[10px]">
              <a href={GITHUB} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button asChild variant="secondary" className="mc-btn text-[10px]">
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </Button>
            <Button asChild variant="secondary" className="mc-btn text-[10px]">
              <a href="mailto:you@example.com">Email</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
