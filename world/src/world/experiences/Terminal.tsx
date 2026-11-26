import { t } from "../i18n";
import "@fontsource/dm-mono/400.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { contactLinks, profile, skills } from "../../data/profile";
import { localizedProjects, type ProjectLanguage, type WorldProject } from "../../data/projects";
import type { ZoneId } from "../config/scene";
import { MOTION } from "../motion";
import "./terminal.css";

/**
 * THE DEVELOPER. A real terminal: every command prints data from /src/data
 * or takes the visitor to that part of the garage.
 */

type Line = { id: number; kind: "in" | "out" | "sys"; body: ReactNode };

const COMMANDS: Record<string, string> = {
  help: "list the commands",
  whoami: "who is behind this garage",
  projects: "list the projects in the crate",
  "open <n>": "open a project by its number",
  skills: "what I work with, and where I used it",
  github: "code and repositories",
  about: "open About me",
  archive: "open the Personal Archive (my story)",
  music: "open the record collection",
  certificates: "see the diplomas",
  contact: "ways to reach me",
  clear: "clear the screen",
  exit: "close the terminal",
};
const NAMES = ["help", "whoami", "projects", "open", "skills", "github", "about", "archive", "music", "certificates", "contact", "clear", "exit"];

interface Props {
  lang: ProjectLanguage;
  origin: DOMRect | null;
  reduced: boolean;
  onClose: () => void;
  onNavigate: (zone: ZoneId, project?: WorldProject["id"]) => void;
}

export function Terminal({ lang, origin, reduced, onClose, onNavigate }: Props) {
  const projects = localizedProjects(lang);
  const root = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const seq = useRef(0);
  const closing = useRef(false);

  const print = useCallback((kind: Line["kind"], body: ReactNode) => setLines((l) => [...l, { id: seq.current++, kind, body }]), []);

  // Opening: the window grows out of the laptop, then boots.
  useLayoutEffect(() => {
    const w = win.current;
    if (!w) return;
    const d = reduced ? 0 : 1;
    gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.4 * d });
    if (origin && !reduced) {
      const b = w.getBoundingClientRect();
      gsap.fromTo(
        w,
        { x: origin.left + origin.width / 2 - (b.left + b.width / 2), y: origin.top + origin.height / 2 - (b.top + b.height / 2), scale: origin.width / b.width, opacity: 0.2 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.9, delay: 0.55, ease: MOTION.ease.inOut },
      );
    }
    const boot = ["walter-os 4.0 — tty1", t("loading garage.config … ok"), t("Welcome, visitor. Type \"help\" to see what this terminal can do.")];
    const timers = boot.map((t, i) => window.setTimeout(() => print("sys", t), (reduced ? 0 : 1100) + i * (reduced ? 0 : 160)));
    timers.push(window.setTimeout(() => input.current?.focus({ preventScroll: true }), reduced ? 0 : 1300));
    return () => {
      timers.forEach(clearTimeout);
      setLines([]);
    };
  }, [origin, reduced, print]);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  const close = useCallback(
    (after?: () => void) => {
      if (closing.current) return;
      closing.current = true;
      const done = () => (after ? after() : onClose());
      if (reduced || !win.current) return done();
      gsap.to(win.current, { scale: 0.9, opacity: 0, duration: 0.35, ease: MOTION.ease.in });
      gsap.to(root.current, { opacity: 0, duration: 0.45, delay: 0.1, onComplete: done });
    },
    [onClose, reduced],
  );

  const go = (zone: ZoneId, project?: WorldProject["id"]) => {
    print("sys", `${lang === "es" ? "abriendo" : "opening"} ${zone}…`);
    setTimeout(() => close(() => onNavigate(zone, project)), 350);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    print("in", cmd);
    if (!cmd) return;
    history.current.unshift(cmd);
    cursor.current = -1;
    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    switch (name) {
      case "help":
        print(
          "out",
          <dl className="term__table">
            {Object.entries(COMMANDS).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{t(v)}</dd>
              </div>
            ))}
          </dl>,
        );
        break;
      case "whoami":
        print(
          "out",
          <div>
            <p className="term__hl">
              {profile.name} — {t(profile.role)}
            </p>
            <p>{profile.location}</p>
            <p>{t(profile.intro)}</p>
            <p className="term__dim">
              {t("more:")} <Cmd run={run}>about</Cmd> · <Cmd run={run}>archive</Cmd>
            </p>
          </div>,
        );
        break;
      case "projects":
        print(
          "out",
          <div>
            {projects.map((p, i) => (
              <p key={p.id} className="term__proj">
                <span className="term__n">[{i + 1}]</span> <Cmd run={run} cmd={`open ${i + 1}`}>{p.title}</Cmd>
                {p.subtitle && <span className="term__dim"> — {p.subtitle}</span>}
                {p.stack && <span className="term__dim"> · {p.stack.join(", ")}</span>}
              </p>
            ))}
            <p className="term__dim">{t("type \"open 1\" … \"open")} {projects.length}{t("\", or click a title.")}</p>
          </div>,
        );
        break;
      case "open": {
        const n = Number(args[0]);
        const p = projects[n - 1];
        if (!p) print("out", <p className="term__err">{t("open: choose a number from 1 to")} {projects.length}{t(". Try \"projects\".")}</p>);
        else go("projects", p.id);
        break;
      }
      case "skills":
        print(
          "out",
          <div>
            {skills.map((g) => (
              <div key={t(g.group)} className="term__group">
                <p className="term__hl">{t(g.group)}</p>
                {g.items.map((s) => (
                  <p key={t(s.name)}>
                    <span className="term__skill">{t(s.name)}</span>
                    <span className="term__dim"> — {t(s.where)}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>,
        );
        break;
      case "github": {
        const gh = contactLinks.find((l) => l.id === "github")?.href;
        print(
          "out",
          gh ? (
            <p>
              <a href={gh} target="_blank" rel="noopener noreferrer">
                {gh}
              </a>
            </p>
          ) : (
            <p>{t("GitHub link coming soon. Meanwhile, the projects are in the crate:")} <Cmd run={run}>projects</Cmd></p>
          ),
        );
        break;
      }
      case "contact":
        print(
          "out",
          <div>
            {contactLinks.map((l) => (
              <p key={l.id}>
                <span className="term__skill">{t(l.label).padEnd(10, " ")}</span>
                {l.href ? (
                  <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {l.href.replace("mailto:", "")}
                  </a>
                ) : (
                  <span className="term__dim">{t("coming soon")}</span>
                )}
              </p>
            ))}
          </div>,
        );
        break;
      case "about":
        go("about");
        break;
      case "archive":
      case "story":
        go("archive");
        break;
      case "music":
        go("music");
        break;
      case "certificates":
      case "certs":
        go("certificates");
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "quit":
        close();
        break;
      case "sudo":
        print("out", <p className="term__err">{t("nice try.")}</p>);
        break;
      default:
        print("out", <p className="term__err">{name}{t(": command not found. Type \"help\".")}</p>);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      cursor.current = Math.min(cursor.current + 1, history.current.length - 1);
      setValue(history.current[cursor.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      cursor.current = Math.max(cursor.current - 1, -1);
      setValue(cursor.current < 0 ? "" : history.current[cursor.current]);
    } else if (e.key === "Tab" && !e.shiftKey && value.trim()) {
      const m = NAMES.filter((n) => n.startsWith(value.trim().toLowerCase()));
      // Autocompleta una vez; después Tab permite salir del campo.
      if (m.length === 1 && m[0] !== value.trim()) {
        e.preventDefault();
        setValue(m[0] + (m[0] === "open" ? " " : ""));
      }
      else if (m.length > 1) print("sys", m.join("   "));
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div ref={root} className="term-layer" role="dialog" aria-modal="true" aria-label="Terminal" onKeyDown={(e) => { if (e.key === "Escape") close(); }} onClick={(e) => e.target === root.current && close()}>
      <div ref={win} className="term" onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button, a, input")) input.current?.focus();
      }}>
        <div className="term__bar">
          <span className="term__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>walter@world: ~</span>
          <button type="button" onClick={() => close()} aria-label={t("Close terminal")}>
            ×
          </button>
        </div>
        <div ref={screen} className="term__screen" aria-live="polite">
          {lines.map((l) => (
            <div key={l.id} className={`term__line term__line--${l.kind}`}>
              {l.kind === "in" && <span className="term__prompt">walter@world:~$ </span>}
              {l.body}
            </div>
          ))}
          <label className="term__input">
            <span className="term__prompt">walter@world:~$ </span>
            <input
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKey}
              aria-label={t("Command")}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </label>
        </div>
        <div className="term__chips" aria-label={t("Quick commands")}>
          {["whoami", "projects", "skills", "github", "help"].map((c) => (
            <button key={c} type="button" onClick={() => run(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cmd({ run, cmd, children }: { run: (c: string) => void; cmd?: string; children: string }) {
  return (
    <button type="button" className="term__cmd" onClick={() => run(cmd ?? children)}>
      {children}
    </button>
  );
}
