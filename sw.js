// sw.js — PWA básico con caché estático + actualización limpia
const CACHE_NAME = "neo-cache-v1";

// Archivos críticos que queremos disponibles offline.
// Añade aquí rutas relativas que existan en tu build final.
const ASSETS = [
  "/",
  "/index.html",
  "/about.html",
  "/projects.html",
  "/contact.html",

  // CSS/JS de Vite (nota: en build se reescriben con hash;
  // este listado sirve para dev y fallback básico)
  "/src/scss/style.scss",
  "/src/ts/main.ts",
  "/src/ts/chat.ts",
  "/src/ts/effects.ts",
  "/src/ts/ui/theme.ts",

  // Iconos PWA
  "/public/assets/icons/icon-192.png",
  "/public/assets/icons/icon-512.png"
];

// Precache en instalación
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => null)
  );
});

// Limpiar cachés viejos al activar
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Estrategia: cache-first con fallback a red.
// Para peticiones HTML usamos "network-first" para evitar quedarse obsoleto.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const isHTML = req.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    // NETWORK FIRST (páginas)
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/index.html")))
    );
    return;
  }

  // CACHE FIRST (estáticos)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Evita cachear peticiones no GET o con error
          if (req.method !== "GET" || !res || res.status !== 200) return res;
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, resClone));
          return res;
        })
        .catch(() => cached);
    })
  );
});
