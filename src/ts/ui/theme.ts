/* =========================================
   src/ts/ui/theme.ts
   Toggle de tema (dark/light) con persistencia
   ========================================= */

const KEY = "theme"; // 'dark' | 'light'

type Mode = "dark" | "light";

function getSystemPref(): Mode {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function apply(mode: Mode) {
  document.documentElement.dataset.theme = mode; // <html data-theme="dark|light">
  localStorage.setItem(KEY, mode);
}

function initTheme() {
  const saved = localStorage.getItem(KEY) as Mode | null;
  const mode: Mode = saved || getSystemPref();
  apply(mode);
}

function toggleTheme() {
  const current = (document.documentElement.dataset.theme as Mode) || "dark";
  apply(current === "dark" ? "light" : "dark");
}

// Inicializa al cargar el módulo
initTheme();

// Listener del botón
const btn = document.getElementById("themeToggle");
btn?.addEventListener("click", toggleTheme);

// (Opcional) Reacciona si cambia la preferencia del sistema y no hay elección guardada
const mq = window.matchMedia("(prefers-color-scheme: light)");
mq.addEventListener?.("change", (e) => {
  const saved = localStorage.getItem(KEY);
  if (!saved) apply(e.matches ? "light" : "dark");
});

// Export opcional por si lo llamas desde otros módulos
export { toggleTheme, apply };
