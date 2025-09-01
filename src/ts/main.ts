/* ===============================
   src/ts/main.ts
   Bootstrap principal
   =============================== */

import "./three/scene";
import "./effects";
import "./chat";
import "./ui/theme";
import "./ui/router";
import "../scss/style.scss";
import "./three/heroParticles";





const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

/* ========== Service Worker (PWA) ========== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("✅ Service Worker registrado"))
      .catch((err) => console.error("❌ SW error:", err));
  });
}

/* ========== Botón volver arriba ========== */
const toTop = document.getElementById("toTop");
if (toTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 240) {
      toTop.classList.add("show");
    } else {
      toTop.classList.remove("show");
    }
  });
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ========== Animaciones reveal ========== */
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.1 }
);
revealEls.forEach((el) => observer.observe(el));

/* ========== VanillaTilt en tarjetas ========== */
import VanillaTilt from "vanilla-tilt";
const tiltEls = document.querySelectorAll(".tilt");
if (tiltEls.length > 0) {
  VanillaTilt.init(tiltEls, {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.22,
  });
}

/* ========== Lottie animación (hero spark) ========== */
import lottieWeb from "lottie-web";
const sparkEl = document.getElementById("lottieSpark");
if (sparkEl) {
  lottieWeb.loadAnimation({
    container: sparkEl,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "/src/lottie/spark.json",
  });
}

/* ========== Cursor magnético ========== */
document.addEventListener("mousemove", (e) => {
  document.querySelectorAll<HTMLElement>(".magnet").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
      el.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
    } else {
      el.style.transform = "";
    }
  });
});
