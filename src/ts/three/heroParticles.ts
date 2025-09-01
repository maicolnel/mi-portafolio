/* =========================================
   src/ts/three/heroParticles.ts
   Partículas/estrellas en overlay 3D
   ========================================= */

import * as THREE from "three";

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let points: THREE.Points | null = null;
let raf = 0;

function createCanvas(): HTMLCanvasElement {
  let canvas = document.getElementById("fx3d") as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "fx3d";
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "-1", // debajo del contenido, encima del body
    } as CSSStyleDeclaration);
    document.body.appendChild(canvas);
  }
  return canvas;
}

function initRenderer(canvas: HTMLCanvasElement) {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  // Geometría de estrellas
  const COUNT = 800;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  // Distribución en esfera hueca con radio variable
  for (let i = 0; i < COUNT; i++) {
    const r = 2.8 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2)); // 0..PI

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Tonos cian/azulados sutiles
    const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.08, 0.9, 0.6 + Math.random() * 0.2);
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  points = new THREE.Points(geo, mat);
  scene.add(points);

  // Luz ambiente leve (por si se agregan meshes luego)
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
}

function onResize() {
  if (!renderer || !camera) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate() {
  if (!renderer || !scene || !camera || !points) return;
  const t = performance.now() * 0.00015;

  // rotaciones muy sutiles
  points.rotation.y = t * 0.6;
  points.rotation.x = Math.sin(t * 0.7) * 0.05;

  renderer.render(scene, camera);
  raf = requestAnimationFrame(animate);
}

export function initHeroParticles() {
  // Si no hay body (SSR) abortar
  if (typeof window === "undefined" || !document.body) return;

  const canvas = createCanvas();
  initRenderer(canvas);
  initScene();
  onResize();
  window.addEventListener("resize", onResize);
  animate();
}

export function disposeHeroParticles() {
  cancelAnimationFrame(raf);
  window.removeEventListener("resize", onResize);

  if (points) {
    points.geometry.dispose();
    (points.material as THREE.Material).dispose();
  }
  renderer?.dispose();

  const canvas = document.getElementById("fx3d");
  if (canvas?.parentElement) canvas.parentElement.removeChild(canvas);

  renderer = null;
  scene = null;
  camera = null;
  points = null;
}

/* Auto-init solo en páginas que tengan el canvas de fondo (home) */
if (document.getElementById("bg3d")) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroParticles, { once: true });
  } else {
    initHeroParticles();
  }
}
