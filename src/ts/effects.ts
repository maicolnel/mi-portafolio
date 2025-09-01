/* =========================================
   src/ts/effects.ts
   Efectos visuales y helpers globales
   ========================================= */

const qs  = <T extends Element = Element>(sel: string, root: Document | Element = document) =>
  root.querySelector<T>(sel);
const qsa = <T extends Element = Element>(sel: string, root: Document | Element = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const throttle = (fn: (...a: any[]) => void, ms = 100) => {
  let t = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - t >= ms) {
      t = now;
      fn(...args);
    }
  };
};

/* ========== 1) Typing effect para #typing (home) ========== */
(() => {
  const el = qs<HTMLHeadingElement>("#typing");
  if (!el) return;

  const text = el.textContent?.trim() ?? "";
  el.textContent = ""; // limpiamos
  let i = 0;

  const type = () => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i < 8 ? 40 : 28); // arranque un poco más lento
    }
  };
  type();
})();

/* ========== 2) Barra de progreso de scroll (si existe .scrollbar) ========== */
(() => {
  const bar = qs<HTMLDivElement>(".scrollbar");
  if (!bar) return;

  const update = throttle(() => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = Math.max(0, Math.min(1, window.scrollY / (max || 1)));
    bar.style.width = `${p * 100}%`;
  }, 20);

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();

/* ========== 3) Sombra en navbar al hacer scroll ========== */
(() => {
  const nav = qs<HTMLElement>("header.nav");
  if (!nav) return;

  const onScroll = throttle(() => {
    if (window.scrollY > 8) {
      nav.style.boxShadow = "var(--shadow)";
    } else {
      nav.style.boxShadow = "none";
    }
  }, 40);

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ========== 4) Parallax muy sutil en la foto del hero ========== */
(() => {
  const frame = qs<HTMLElement>(".hero-photo .photo-frame");
  if (!frame) return;

  const strength = 8; // px
  const onMove = throttle((e: MouseEvent) => {
    const r = frame.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    frame.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  }, 16);

  const reset = () => (frame.style.transform = "translate(0,0)");

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseleave", reset);
})();

/* ========== 5) Enlaces ancla con scroll suave ========== */
(() => {
  qsa<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href") || "";
      const target = id.length > 1 ? qs(id) : null;
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
})();

/* ========== 6) Filtros de proyectos (projects.html) ========== */
(() => {
  const grid = qs("#projectsGrid");
  const btns = qsa<HTMLButtonElement>("#filters .filter-btn");
  if (!grid || btns.length === 0) return;

  const cards = qsa<HTMLElement>(".card", grid);

  const applyFilter = (tag: string) => {
    cards.forEach((c) => {
      const tags = (c.dataset.tags || "").split(",").map((t) => t.trim());
      const ok = tag === "all" || tags.includes(tag);
      c.style.display = ok ? "" : "none";
    });
  };

  btns.forEach((b) => {
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      applyFilter(b.dataset.tag || "all");
    });
  });

  // filtro por defecto
  const active = qs<HTMLButtonElement>("#filters .filter-btn.active");
  applyFilter(active?.dataset.tag || "all");
})();
