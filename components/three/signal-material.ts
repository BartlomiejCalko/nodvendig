import { AdditiveBlending, Color, NormalBlending, ShaderMaterial } from "three";

/**
 * Glowing fiber material for TubeGeometry. Draws the tube progressively
 * along its length (uv.x) and runs bright light pulses through it.
 */
export const createSignalMaterial = ({
  color = "#5fe3ff",
  pulseColor = "#ffffff",
  intensity = 2.4,
  pulseSpacing = 0.18,
  pulseSpeed = 0.6,
  additive = true,
}: {
  color?: string;
  pulseColor?: string;
  intensity?: number;
  pulseSpacing?: number;
  pulseSpeed?: number;
  /** Additive glows on dark scenes; normal blending reads on light ones. */
  additive?: boolean;
} = {}) =>
  new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: additive ? AdditiveBlending : NormalBlending,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uDraw: { value: 0 },
      uPulse: { value: 0 },
      uOpacity: { value: 1 },
      uIntensity: { value: intensity },
      uSpacing: { value: pulseSpacing },
      uSpeed: { value: pulseSpeed },
      uOffset: { value: 0 },
      uColor: { value: new Color(color) },
      uPulseColor: { value: new Color(pulseColor) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uDraw;
      uniform float uPulse;
      uniform float uOpacity;
      uniform float uIntensity;
      uniform float uSpacing;
      uniform float uSpeed;
      uniform float uOffset;
      uniform vec3 uColor;
      uniform vec3 uPulseColor;
      varying vec2 vUv;

      void main() {
        float along = vUv.x;
        if (along > uDraw) discard;

        float head = smoothstep(uDraw - 0.04, uDraw, along) * step(uDraw, 0.999);
        float phase = fract((along - uTime * uSpeed + uOffset) / uSpacing);
        float pulse = smoothstep(0.86, 1.0, phase) * uPulse;

        vec3 color = uColor * 0.45 + uPulseColor * (pulse * 1.6 + head * 2.5);
        gl_FragColor = vec4(color * uIntensity, uOpacity);
      }
    `,
  });
