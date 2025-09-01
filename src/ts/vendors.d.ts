// src/ts/vendors.d.ts
// Declaraciones de módulos que no traen tipos o que cargamos como texto/binario.

// ===== Librerías sin tipos (o tipos opcionales) =====
declare module "lottie-web" {
  const lottie: any;
  export default lottie;
}
declare module "vanilla-tilt" {
  const VanillaTilt: any;
  export default VanillaTilt;
}

// ===== Shaders GLSL (Vite: ?raw los importa como string) =====
declare module "*.vert?raw" {
  const content: string;
  export default content;
}
declare module "*.frag?raw" {
  const content: string;
  export default content;
}

// ===== Modelos 3D =====
declare module "*.glb" {
  const src: string;
  export default src;
}
declare module "*.gltf" {
  const src: string;
  export default src;
}
declare module "*.hdr" {
  const src: string;
  export default src;
}
declare module "*.bin" {
  const src: string;
  export default src;
}

// ===== Imágenes y fuentes =====
declare module "*.png"  { const src: string; export default src; }
declare module "*.jpg"  { const src: string; export default src; }
declare module "*.jpeg" { const src: string; export default src; }
declare module "*.webp" { const src: string; export default src; }
declare module "*.gif"  { const src: string; export default src; }
declare module "*.svg"  { const src: string; export default src; }
declare module "*.woff" { const src: string; export default src; }
declare module "*.woff2"{ const src: string; export default src; }
declare module "*.ttf"  { const src: string; export default src; }

// ===== JSON (por si importas Lottie u otros como módulo) =====
declare module "*.json" {
  const value: any;
  export default value;
}
