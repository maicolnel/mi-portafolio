// =======================================
// gradient.vert  (Vertex Shader)
// Suaviza y ondula un plano con senos/cosenos
// usando u_time. Pasa vUv y vWorld a fragment.
// =======================================

precision highp float;

uniform float u_time;

varying vec2 vUv;
varying vec3 vWorld;

void main() {
  vUv = uv;

  // Posición del vértice en espacio de objeto
  vec3 pos = position;

  // Deformación suave tipo "olas"
  float t = u_time * 0.8;
  float w1 = sin(pos.x * 1.2 + t) * 0.06;
  float w2 = cos(pos.y * 1.6 - t * 0.7) * 0.06;
  float w3 = sin((pos.x + pos.y) * 0.9 + t * 0.5) * 0.04;

  pos.z += w1 + w2 + w3;

  // Ligerísimo “respirar” en X/Y
  float breathe = 0.004 * sin(t * 0.6);
  pos.x += breathe * pos.x;
  pos.y += breathe * pos.y;

  // Matrices estándar de Three.js
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorld = worldPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
