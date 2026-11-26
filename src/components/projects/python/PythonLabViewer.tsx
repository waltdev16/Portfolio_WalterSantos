"use client";

// Visor de código y terminal de Python Development Lab.
// Python (Pyodide) se descarga solo al pulsar Run y corre en un Web Worker
// (public/python-lab/runner.js); el worker se libera con Stop o al salir.

// 01. Importaciones
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown, ChevronRight, FileCode, Folder, FolderOpen, Maximize2, Minimize2, Play, Square } from "lucide-react";
import { useT } from "@/i18n/t";
import { sources } from "./sources";

// 02. Configuración
const files = Object.keys(sources);
const folders = [...new Set(files.map((file) => file.split("/")[0]))];
const DEFAULT_FILE = "playlist/main.py";
const MAX_LINES = 1000;

type OutputLine = { text: string; kind: "system" | "user" | "error" };

export function PythonLabViewer() {
  const t = useT();

  // 03. Estado del componente
  const [selected, setSelected] = useState(DEFAULT_FILE);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [status, setStatus] = useState("Ready");
  const [running, setRunning] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [input, setInput] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const worker = useRef<Worker | null>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const terminal = useRef<HTMLPreElement>(null);
  const inputField = useRef<HTMLInputElement>(null);

  // 04. Efectos: liberar el worker al salir, desplazar la terminal y enfocar la entrada
  useEffect(
    () => () => {
      // también se ejecuta si Next.js oculta la página en caché: el programa se detiene
      worker.current?.terminate();
      worker.current = null;
      setRunning(false);
      setWaiting(false);
      setStatus("Ready");
    },
    [],
  );
  useEffect(() => {
    if (terminal.current) terminal.current.scrollTop = terminal.current.scrollHeight;
  }, [output]);
  useEffect(() => {
    if (waiting) inputField.current?.focus();
  }, [waiting]);
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === viewer.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // 05. Funciones auxiliares
  const append = (line: OutputLine) => setOutput((previous) => [...previous, line].slice(-MAX_LINES));

  function toggleFolder(folder: string) {
    setExpandedFolders((previous) =>
      previous.includes(folder) ? previous.filter((item) => item !== folder) : [...previous, folder],
    );
  }

  function createWorker() {
    const instance = new Worker("/python-lab/runner.js");
    instance.onmessage = ({ data }) => {
      if (data.type === "status") setStatus(String(data.text));
      if (data.type === "output" || data.type === "input" || data.type === "done" || data.type === "error") {
        append({ text: String(data.text ?? ""), kind: data.type === "error" ? "error" : "system" });
      }
      if (data.type === "input") {
        setWaiting(true);
        setStatus("Waiting for input");
      }
      if (data.type === "done" || data.type === "error") {
        setRunning(false);
        setWaiting(false);
        setStatus(data.type === "error" ? "Error" : "Finished");
      }
    };
    instance.onerror = (event) => {
      append({ text: "\n" + event.message, kind: "error" });
      setRunning(false);
      setWaiting(false);
      setStatus("Error");
      instance.terminate();
      worker.current = null;
    };
    return instance;
  }

  // 06. Eventos
  function run() {
    if (running) return;
    const path = selected.split("/")[0] + "/main.py";
    setOutput([{ text: `$ python ${path}\n`, kind: "system" }]);
    setRunning(true);
    setWaiting(false);
    setStatus("Starting…");
    worker.current ??= createWorker();
    worker.current.postMessage({ type: "run", path, sources });
  }

  function stop() {
    worker.current?.terminate();
    worker.current = null;
    setRunning(false);
    setWaiting(false);
    setInput("");
    setStatus("Stopped");
    append({ text: "\n" + t("Process stopped.") + "\n", kind: "system" });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!waiting) return;
    append({ text: input + "\n", kind: "user" });
    worker.current?.postMessage({ type: "input", value: input });
    setInput("");
    setWaiting(false);
    setStatus("Running");
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await viewer.current?.requestFullscreen();
    } catch {
      setStatus("Fullscreen unavailable");
    }
  }

  // 07. Renderizado
  return (
    <div
      ref={viewer}
      className="flex h-[clamp(340px,55vh,620px)] min-w-0 flex-col overflow-hidden border border-line bg-[#0b0e13] font-mono text-xs text-slate-200 fullscreen:h-screen fullscreen:w-screen"
    >
      {/* Barra de la ventana */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#151922] px-3 py-2">
        <span className="size-2 rounded-full bg-red-400" />
        <span className="size-2 rounded-full bg-yellow-400" />
        <span className="size-2 rounded-full bg-green-400" />
        <span className="min-w-0 flex-1 truncate text-center text-slate-400">Python Development Lab</span>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? t("Exit fullscreen") : t("Fullscreen")}
          title={fullscreen ? t("Exit fullscreen") : t("Fullscreen")}
          className="p-1 hover:text-white focus-visible:outline focus-visible:outline-lime-300"
        >
          {fullscreen ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Explorador de archivos */}
        <nav aria-label={t("Files")} className="w-[32%] max-w-44 shrink-0 overflow-auto border-r border-white/10 bg-[#11151c] p-2">
          <div className="mb-3 text-[10px] tracking-widest text-slate-400">{t("EXPLORER")}</div>
          {folders.map((folder) => {
            const open = expandedFolders.includes(folder);
            return (
              <div key={folder} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggleFolder(folder)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-1 truncate py-1 text-left text-slate-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-lime-300"
                >
                  {open ? <ChevronDown className="size-3 shrink-0" aria-hidden="true" /> : <ChevronRight className="size-3 shrink-0" aria-hidden="true" />}
                  {open ? (
                    <FolderOpen className="size-3 shrink-0 text-amber-300" aria-hidden="true" />
                  ) : (
                    <Folder className="size-3 shrink-0 text-amber-300" aria-hidden="true" />
                  )}
                  {folder}
                </button>
                {open &&
                  files
                    .filter((file) => file.startsWith(folder + "/"))
                    .map((file) => (
                      <button
                        key={file}
                        type="button"
                        onClick={() => setSelected(file)}
                        aria-pressed={selected === file}
                        className={`mt-1 flex w-full items-center gap-1 truncate py-1 pl-6 pr-2 text-left hover:bg-white/10 focus-visible:outline focus-visible:outline-lime-300 ${
                          selected === file ? "bg-[#29313d] text-lime-300" : "text-slate-400"
                        }`}
                      >
                        <FileCode className="size-3 shrink-0" aria-hidden="true" />
                        {file.split("/")[1]}
                      </button>
                    ))}
              </div>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Archivo abierto y controles */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-[#1b2029] px-2 py-1.5">
            <span className="min-w-0 flex-1 truncate">{selected}</span>
            <button
              type="button"
              disabled={running}
              onClick={run}
              className="flex items-center gap-1 px-2 py-1 text-lime-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-lime-300"
            >
              <Play className="size-3" aria-hidden="true" />
              {t("Run")}
            </button>
            <button
              type="button"
              disabled={!running}
              onClick={stop}
              aria-label={t("Stop")}
              title={t("Stop")}
              className="p-1 text-red-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-lime-300"
            >
              <Square className="size-3" aria-hidden="true" />
            </button>
          </div>

          {/* Código (sin modificar, tal como está en el repositorio) */}
          <div className="min-h-0 flex-1 overflow-auto p-3" role="region" aria-label={t("Python source code")} tabIndex={0}>
            <pre className="w-max min-w-full leading-5">
              {sources[selected].split("\n").map((line, i) => (
                <span key={i} className="flex">
                  <span className="mr-3 w-7 shrink-0 select-none text-right text-[#7d8899]">{i + 1}</span>
                  <span className={line.trim().startsWith("#") ? "text-emerald-400" : "text-sky-200"}>{line || " "}</span>
                </span>
              ))}
            </pre>
          </div>

          {/* Terminal: salida del programa en verde, entrada del usuario en azul */}
          <div className="flex h-[40%] min-h-24 flex-col border-t border-white/10 bg-[#07090c]">
            <div className="flex justify-between px-3 py-2 text-[10px] text-slate-400">
              <span>{t("TERMINAL")}</span>
              <span role="status">{t(status)}</span>
            </div>
            <pre ref={terminal} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words px-3 pb-2 text-emerald-200">
              {output.length
                ? output.map((entry, index) => (
                    <span
                      key={index}
                      className={entry.kind === "user" ? "text-sky-300" : entry.kind === "error" ? "text-red-300" : "text-emerald-200"}
                    >
                      {entry.text === "\nProcess finished.\n" ? "\n" + t("Process finished.") + "\n" : entry.text}
                    </span>
                  ))
                : t("Press Run to execute the selected application.")}
            </pre>
            {waiting && (
              <form onSubmit={submit} className="flex gap-2 border-t border-white/10 px-3 py-2">
                <label htmlFor="python-input" className="text-lime-300">
                  &gt;<span className="sr-only">{t("Program input")}</span>
                </label>
                <input
                  id="python-input"
                  ref={inputField}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sky-300 outline-none"
                  autoComplete="off"
                />
                <button type="submit" className="text-lime-300">
                  {t("Enter")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t border-white/10 bg-[#151922] px-3 py-1.5 text-[10px] text-slate-400">
        <span>Python 3 · UTF-8</span>
        <span>
          {folders.length} {t("applications")}
        </span>
      </div>
    </div>
  );
}
