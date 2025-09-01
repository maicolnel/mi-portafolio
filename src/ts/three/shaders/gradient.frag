// =======================================
// gradient.frag (Fragment Shader)
// Gradiente animado + efecto neón/glow
// =======================================

precision highp float;

uniform float u_time;
varying vec2 vUv;
varying vec3 vWorld;

// Función para brillo tipo glow
float neonPulse(float v, float t) {
  return 0.5 + 0.5 * sin(v * 8.0 - t * 2.0);
}

void main() {
  // Coordenadas UV base
  vec2 uv = vUv;

  // Animación tipo "scrolling gradient"
  float wave = sin(uv.y * 10.0 + u_time * 1.5) * 0.15;
  float pulse = neonPulse(uv.x + uv.y, u_time);

  // Paleta futurista: azul, púrpura, cian
  vec3 colorA = vec3(0.1, 0.6, 1.0);   // cian azulado
  vec3 colorB = vec3(0.6, 0.2, 0.9);   // púrpura
  vec3 colorC = vec3(0.0, 1.0, 0.7);   // verde neón

  // Mezcla dinámica de colores
  vec3 grad = mix(colorA, colorB, uv.y + wave);
  grad = mix(grad, colorC, pulse * 0.5);

  // Añadir brillo
  float glow = smoothstep(0.8, 1.0, pulse);
  grad += grad * glow * 0.5;

  gl_FragColor = vec4(grad, 1.0);
}
