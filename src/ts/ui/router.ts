/* =========================================
   src/ts/ui/router.ts
   Router ligero para navegación parcial (SPA-lite)
   - Intercepta clicks en <a> internos
   - Reemplaza el contenedor <main data-router> (o .section de fallback)
   - Actualiza título, meta y estado del historial
   - Mantiene activo el nav y re-ejecuta efectos básicos
   ========================================= */

type Container = HTMLElement | null;

const isInternal = (url: URL) => location.origin === url.origin;
const getContainer = (root: Document | HTMLElement = document): Container =>
  (root.querySelector("main[data-router]") as HTMLElement) ||
  (root.querySelector(".section") as HTMLElement) || null;

function setActiveNav(pathname: string) {
  const links = document.querySelectorAll<HTMLAnchorElement>("header.nav .menu a");
  links.forEach((a) => {
    const aURL = new URL(a.href, location.href);
    a.classList.toggle("active", aURL.pathname === pathname);
  });
}

async function loadAndSwap(url: URL) {
  const res = await fetch(url.toString(), { credentials: "same-origin" });
  if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${url.pathname}`);
  const html = await res.text();

  // Parseamos el nuevo documento
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Contenedor destino (nuevo y actual)
  const newContainer = getContainer(doc);
  const current = getContainer(document);

  if (!newContainer || !current) {
    // Si no hay contenedor, hacemos navegación normal
    location.href = url.toString();
    return;
  }

  // Reemplazo del contenido
  current.replaceWith(newContainer);

  // Título
  if (doc.title) document.title = doc.title;

  // Meta description si existe
  const newDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content");
  let desc = document.querySelector('meta[name="description"]');
  if (newDesc) {
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", newDesc);
  }

  // Reaplicar pequeños efectos globales que dependen del DOM nuevo
  reinitEffects();

  // Ajustar nav activo
  setActiveNav(url.pathname);

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function reinitEffects() {
  // 1) Typing effect (si la sección tiene #typing)
  const typing = document.getElementById("typing");
  if (typing) {
    const text = typing.getAttribute("data-text") || typing.textContent || "";
    typing.textContent = "";
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        typing.textContent = text.slice(0, i++);
        setTimeout(type, 28);
      }
    };
    type();
  }

  // 2) Re-enganchamos botones Asistente/tema si el header fue reemplazado (no debería, pero por si acaso)
  document.getElementById("themeToggle")?.addEventListener("click", () =>
    document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark"
  );
  document.getElementById("openChat")?.addEventListener("click", () => {
    document.getElementById("chatModal")?.classList.remove("hidden");
  });
}

/* Intercepta clicks en enlaces internos */
function bindLinkIntercept() {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const a = target.closest("a") as HTMLAnchorElement | null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

    const url = new URL(a.href, location.href);
    if (!isInternal(url)) return;

    // Solo interceptamos documentos HTML dentro del sitio
    const isHTML = !/\.(pdf|png|jpe?g|gif|svg|webp|mp4|zip|rar)$/i.test(url.pathname);
    if (!isHTML) return;

    // Evitamos interceptar el mismo path
    if (url.pathname === location.pathname) return;

    e.preventDefault();
    loadAndSwap(url)
      .then(() => history.pushState({}, "", url))
      .catch(() => (location.href = url.toString()));
  });
}

/* Manejo de navegación atrás/adelante */
window.addEventListener("popstate", () => {
  const url = new URL(location.href);
  loadAndSwap(url).catch(() => location.reload());
});

/* Init */
export function initRouter() {
  // Requiere que exista un contenedor en la página
  if (!getContainer(document)) return;
  bindLinkIntercept();
  setActiveNav(location.pathname);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRouter, { once: true });
} else {
  initRouter();
}
