/* ===============================
   src/ts/chat.ts
   Chat modal (demo sin backend)
   =============================== */

const openBtn  = document.getElementById("openChat");
const closeBtn = document.getElementById("closeChat");
const modal    = document.getElementById("chatModal");
const bodyEl   = document.getElementById("chatBody");
const formEl   = document.getElementById("chatForm") as HTMLFormElement | null;
const inputEl  = document.getElementById("chatInput") as HTMLInputElement | null;

function openModal() {
  if (!modal) return;
  modal.classList.remove("hidden");
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
}

openBtn?.addEventListener("click", openModal);
closeBtn?.addEventListener("click", closeModal);

// Cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Helpers UI
function appendMsg(role: "user" | "bot", html: string) {
  if (!bodyEl) return;
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerHTML = html;
  bodyEl.appendChild(div);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

function showThinking() {
  if (!bodyEl) return () => {};
  const div = document.createElement("div");
  div.className = "msg bot";
  div.innerHTML = `<div class="dot-pulse"><span></span><span></span><span></span></div>`;
  bodyEl.appendChild(div);
  bodyEl.scrollTop = bodyEl.scrollHeight;
  return () => div.remove();
}

// Respuestas demo muy simples (intents)
function replyFor(text: string): string {
  const t = text.toLowerCase();

  if (t.includes("cv") || t.includes("curriculum") || t.includes("hoja de vida")) {
    return `Aquí puedes descargar mi CV actualizado:
    <br><a class="btn magnet" href="public/assets/CV_Maicol_Rafael.pdf" download>Descargar CV</a>`;
  }

  if (t.includes("contact") || t.includes("correo") || t.includes("whatsapp")) {
    return `Puedes escribirme a <b>maicolnelsonrafaelrojas@gmail.com</b> o WhatsApp 
    <a href="https://wa.me/51935579146" target="_blank">+51 935 579 146</a>.`;
  }

  if (t.includes("linkedin")) {
    return `Mi LinkedIn: <a href="https://www.linkedin.com/in/maicol-nelson-rafael-rojas-82474b380" target="_blank">ver perfil ↗</a>`;
  }

  if (t.includes("github") || t.includes("repos") || t.includes("codigo")) {
    return `Mi GitHub: <a href="https://github.com/maicolnel" target="_blank">@maicolnel ↗</a>`;
  }

  if (t.includes("proyecto") || t.includes("portafolio")) {
    return `Puedes ver mis proyectos aquí: <a href="projects.html">Proyectos</a>.
    Destacan <b>Artesanos de Pimentel</b>, un sistema documentario en <b>Java + PostgreSQL</b> y el <b>Himnario GYD</b> en Flutter.`;
  }

  if (t.includes("entrevista") || t.includes("reunión") || t.includes("agenda")) {
    return `¡Encantado! Envíame un correo con tu disponibilidad 
    (<a href="mailto:maicolnelsonrafaelrojas@gmail.com">maicolnelsonrafaelrojas@gmail.com</a>)
    o escríbeme por WhatsApp <a href="https://wa.me/51935579146" target="_blank">+51 935 579 146</a> y coordinamos.`;
  }

  return `Soy un asistente de demo 🙂 Puedo darte mi <b>CV</b>, <b>contacto</b>, <b>LinkedIn</b>, <b>GitHub</b> o mostrar <b>proyectos</b>. ¿Qué te gustaría ver?`;
}

// Envío de mensajes
formEl?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputEl) return;

  const text = inputEl.value.trim();
  if (!text) return;

  appendMsg("user", text);
  inputEl.value = "";

  const hide = showThinking();
  setTimeout(() => {
    hide();
    appendMsg("bot", replyFor(text));
  }, 700);
});

// Apertura rápida con Ctrl+K
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openModal();
    inputEl?.focus();
  }
});
