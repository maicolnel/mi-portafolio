/* =========================================
   src/ts/three/scene.ts
   Fondo 3D con Three.js + shaders
   ========================================= */

import * as THREE from "three";
import vert from "./shaders/gradient.vert?raw";
import frag from "./shaders/gradient.frag?raw";

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let plane: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;

const uniforms = {
  u_time: { value: 0 },
  u_res: new THREE.Vector2(1, 1),
};

function setupRenderer(canvas: HTMLCanvasElement) {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 3);

  const geo = new THREE.PlaneGeometry(6, 4, 200, 200);
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    uniforms: {
      u_time: uniforms.u_time,
      u_res: { value: uniforms.u_res.clone() },
    },
  });

  plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -0.2;
  scene.add(plane);

  // Luz sutil para darle profundidad a partículas futuras (si las agregas)
  const light = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(light);
}

function handleResize() {
  if (!renderer || !camera) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  uniforms.u_res.set(w, h);
}

function loop() {
  if (!renderer || !scene || !camera || !plane) return;
  uniforms.u_time.value += 0.01;
  plane.rotation.y += 0.0008;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

export function initScene() {
  const canvas = document.getElementById("bg3d") as HTMLCanvasElement | null;
  if (!canvas) return; // página sin canvas

  setupRenderer(canvas);
  setupScene();
  handleResize();
  window.addEventListener("resize", handleResize);

  loop();
}

/* Auto-init si el canvas existe en la página */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScene, { once: true });
} else {
  initScene();
}
