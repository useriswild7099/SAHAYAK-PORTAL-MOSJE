import React, { useEffect, useRef } from 'react';
import { useLiquidGlass } from '../../context/LiquidGlassContext';

interface LiquidGlassCanvasProps {
  className?: string;
  borderRadius?: number; // in pixels
  interactive?: boolean;
}

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec2 uLightPos;
  uniform float uTime;
  uniform float uRefraction;
  uniform float uChromatic;
  uniform float uRimLight;
  uniform float uRadius;

  // Signed distance field for rounded box
  float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    vec2 halfSize = (uResolution * 0.5) / min(uResolution.x, uResolution.y);
    float radius = uRadius / min(uResolution.x, uResolution.y);

    // Distance to edge
    float d = sdRoundedBox(st, halfSize, radius);

    // Mask outside rounded rect
    if (d > 0.005) {
      discard;
    }

    // Normal calculation from distance field gradient
    float eps = 0.003;
    vec2 grad = vec2(
      sdRoundedBox(st + vec2(eps, 0.0), halfSize, radius) - sdRoundedBox(st - vec2(eps, 0.0), halfSize, radius),
      sdRoundedBox(st + vec2(0.0, eps), halfSize, radius) - sdRoundedBox(st - vec2(0.0, eps), halfSize, radius)
    );
    vec2 normal2D = normalize(grad);

    // Bevel intensity increases sharply near the outer edge
    float edgeDist = abs(d);
    float bevel = smoothstep(0.06, 0.0, edgeDist);

    // Fresnel / rim glow
    float rim = pow(bevel, 1.8) * (uRimLight * 1.6);

    // Specular light from light vector
    vec2 lightDir = normalize(uLightPos - vUv);
    float spec = pow(max(dot(normal2D, lightDir), 0.0), 12.0) * bevel * 0.9;
    float ambientSheen = pow(max(dot(normal2D, vec2(0.0, 1.0)), 0.0), 4.0) * bevel * 0.4;

    // Subtle caustic liquid flow
    float flow = sin(vUv.x * 12.0 + uTime * 1.5) * cos(vUv.y * 12.0 + uTime * 1.2) * 0.02 * (uRefraction * 0.5);

    // Chromatic dispersion components
    float rOffset = (bevel * uChromatic * 0.015) + flow;
    float bOffset = -(bevel * uChromatic * 0.015) - flow;

    // Composition
    vec3 glassColor = vec3(0.96, 0.98, 1.0);
    vec3 rimColor = vec3(1.0, 1.0, 1.0) * rim;
    vec3 specColor = vec3(1.0, 0.99, 0.95) * (spec + ambientSheen);

    // Chromatic edge tint
    vec3 chromColor = vec3(
      smoothstep(0.02, 0.0, edgeDist + rOffset) * 0.35,
      smoothstep(0.02, 0.0, edgeDist) * 0.15,
      smoothstep(0.02, 0.0, edgeDist + bOffset) * 0.45
    ) * uChromatic;

    vec3 finalColor = glassColor * 0.05 + rimColor + specColor + chromColor;
    float alpha = clamp(rim * 0.7 + spec * 0.85 + (bevel * 0.15), 0.0, 0.95);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const LiquidGlassCanvas: React.FC<LiquidGlassCanvasProps> = ({
  className = '',
  borderRadius = 12,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { config, mousePos } = useLiquidGlass();

  useEffect(() => {
    if (!config.enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl', { alpha: true, antialias: true }) ||
      canvas.getContext('experimental-webgl', { alpha: true, antialias: true })) as WebGLRenderingContext | null;

    if (!gl) return;

    // Compile Shader helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uLightPos = gl.getUniformLocation(program, 'uLightPos');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uRefraction = gl.getUniformLocation(program, 'uRefraction');
    const uChromatic = gl.getUniformLocation(program, 'uChromatic');
    const uRimLight = gl.getUniformLocation(program, 'uRimLight');
    const uRadius = gl.getUniformLocation(program, 'uRadius');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.round(rect.width * dpr);
      const displayHeight = Math.round(rect.height * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    const render = () => {
      resize();
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(
        uLightPos,
        interactive && config.mouseReactive ? mousePos.x : 0.35,
        interactive && config.mouseReactive ? 1.0 - mousePos.y : 0.8
      );
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uRefraction, config.refraction / 100);
      gl.uniform1f(uChromatic, config.chromaticAberration);
      gl.uniform1f(uRimLight, config.rimLight / 100);
      gl.uniform1f(uRadius, borderRadius * (window.devicePixelRatio || 1));

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [config, mousePos, borderRadius, interactive]);

  if (!config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-10 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};
