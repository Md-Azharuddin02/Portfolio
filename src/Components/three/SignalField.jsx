/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props are three.js object properties, not DOM attributes */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { markReady, preloaderDoneAt } from "../../lib/preloader";

// 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uPixelRatio;
uniform float uShockAge;   // seconds since the last theme switch (large = idle)
uniform vec2 uShockOrigin;
uniform float uAssemble;   // 0 → ~1.4 : scattered dots fly into the name
uniform float uCollapse;   // 0 → ~1.6 : the name cascades down into the terrain
attribute vec3 aTarget;    // this dot's position inside the name
attribute vec3 aScatter;   // this dot's random starting position
attribute vec2 aDelay;     // per-dot stagger for (assemble, collapse)
attribute float aSpark;    // 1 for the few dots that glow in the accent colour
varying float vHeight;
varying float vFade;
varying float vName;
varying float vSpark;
${NOISE}
void main() {
  vec3 p = position;
  // Two octaves of drifting noise form the terrain.
  float n = snoise(vec3(p.x * 0.22, p.z * 0.22, uTime * 0.12)) * 0.55
          + snoise(vec3(p.x * 0.6, p.z * 0.6, uTime * 0.2)) * 0.12;
  // Pointer ripple: a damped ring travelling outward from the cursor.
  float d = distance(p.xz, uPointer);
  float ripple = sin(d * 3.2 - uTime * 3.0) * exp(-d * 0.55) * 0.35 + exp(-d * d * 0.5) * 0.55;
  // Theme-switch shockwave: one expanding ring that decays as it travels.
  float ds = distance(p.xz, uShockOrigin);
  float front = ds - uShockAge * 9.0;
  float shock = exp(-front * front * 0.35) * exp(-uShockAge * 1.1) * 1.25;
  p.y = n * (1.0 + uScroll * 1.4) + ripple * uPointerStrength + shock;

  // Name sequence: scatter → name → terrain, each dot on its own stagger.
  float a = smoothstep(0.0, 1.0, clamp((uAssemble - aDelay.x) / 0.7, 0.0, 1.0));
  float c = smoothstep(0.0, 1.0, clamp((uCollapse - aDelay.y) / 0.8, 0.0, 1.0));
  vec3 name = aTarget + vec3(0.0, snoise(vec3(aTarget.xy * 0.9, uTime * 0.7)) * 0.025, 0.0);
  vec3 pos = mix(mix(aScatter, name, a), p, c);
  pos.y += sin(c * 3.14159) * 0.9; // dots arc as they fall into place

  vHeight = mix(-1.0, p.y, c);
  vName = a * (1.0 - c);
  vSpark = aSpark * (1.0 - c);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  float terrainSize = 2.2 + max(p.y, 0.0) * 3.0;
  gl_PointSize = mix(2.7 + aSpark * 1.5, terrainSize, c) * uPixelRatio * (9.0 / depth);
  // Fade the far edge and the sides of the terrain into the background.
  float terrainFade = smoothstep(26.0, 8.0, depth) * smoothstep(13.0, 6.0, abs(p.x));
  vFade = mix(a, terrainFade, c);
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uAccent;
varying float vHeight;
varying float vFade;
varying float vName;
varying float vSpark;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float soft = smoothstep(0.5, 0.15, r);
  float heat = max(smoothstep(0.25, 0.85, vHeight), vSpark);
  vec3 color = mix(uInk, uAccent, heat);
  float base = mix(0.42, 0.95, vName);
  gl_FragColor = vec4(color, soft * vFade * mix(base, 1.0, heat));
}`;

const PALETTE = {
  dark: { ink: new THREE.Color("#ecebe3"), accent: new THREE.Color("#ff5f1f") },
  light: { ink: new THREE.Color("#121211"), accent: new THREE.Color("#e2490f") },
};

function useWindowInput() {
  const input = useRef({ ndc: new THREE.Vector2(0, -0.2), active: 0, scroll: 0 });
  useEffect(() => {
    const onPointer = (event) => {
      input.current.ndc.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      input.current.active = 1;
    };
    const onLeave = () => {
      input.current.active = 0;
    };
    const onScroll = () => {
      input.current.scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return input;
}

const NAME = "AZHARUDDIN";
const HOLD_START = 1.25; // s after start: name fully formed
const COLLAPSE_AT = 2.15; // s after start: name begins falling into the terrain

/** Rasterise the name with the site's display face and return normalised [-1,1] sample points. */
async function sampleName() {
  try {
    await document.fonts.load('600 200px "Space Grotesk"');
  } catch {
    /* fall back to whatever sans is available */
  }
  const W = 1400;
  const H = 300;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.font = '600 230px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(NAME, W / 2, H / 2);
  const { data } = ctx.getImageData(0, 0, W, H);
  const pts = [];
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 140) {
        pts.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const half = (maxX - minX) / 2;
  const out = new Float32Array(pts.length);
  for (let i = 0; i < pts.length; i += 2) {
    out[i] = (pts[i] - cx) / half; // u ∈ [-1, 1]
    out[i + 1] = -(pts[i + 1] - cy) / half; // v, same scale as u (keeps aspect)
  }
  return out;
}

function Field({ isDark, reducedMotion, onReveal }) {
  const { size, camera, gl, invalidate } = useThree();
  const input = useWindowInput();
  const material = useRef(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  const [samples, setSamples] = useState(null);
  useEffect(() => {
    let alive = true;
    sampleName().then((pts) => alive && setSamples(pts));
    return () => {
      alive = false;
    };
  }, []);

  // Density scales with viewport: ~3k points on phones (mobile-safe baseline), ~11k on desktop.
  const geometry = useMemo(() => {
    if (!samples) return null;
    const mobile = size.width < 640;
    const cols = mobile ? 70 : 150;
    const rows = mobile ? 44 : 72;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const delays = new Float32Array(count * 2);
    const sparks = new Float32Array(count);

    // Camera basis at rest (pointer drift is applied later) to project the name onto the view.
    const cam = camera.clone();
    cam.position.set(0, 3.2, 9);
    cam.lookAt(0, -0.6, -3);
    cam.updateMatrixWorld();
    const forward = new THREE.Vector3();
    cam.getWorldDirection(forward);
    const right = new THREE.Vector3().crossVectors(forward, cam.up).normalize();
    const up = new THREE.Vector3().crossVectors(right, forward).normalize();
    const D = 8;
    const halfH = D * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const halfW = halfH * (size.width / size.height);
    const nameHalfW = halfW * (mobile ? 0.9 : 0.8);
    const center = cam.position.clone().addScaledVector(forward, D).addScaledVector(up, halfH * 0.18);
    const sampleCount = samples.length / 2;

    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1, i += 1) {
        positions[i * 3] = (c / (cols - 1) - 0.5) * 26;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (r / (rows - 1) - 0.5) * 22 - 4;

        const s = Math.floor(Math.random() * sampleCount) * 2;
        const u = samples[s] + (Math.random() - 0.5) * 0.004;
        const v = samples[s + 1] + (Math.random() - 0.5) * 0.004;
        const t = center.clone().addScaledVector(right, u * nameHalfW).addScaledVector(up, v * nameHalfW);
        targets.set([t.x, t.y, t.z], i * 3);

        scatter.set([(Math.random() - 0.5) * 30, Math.random() * 10 - 3, -Math.random() * 24 + 4], i * 3);
        // Assemble: random swarm. Collapse: a left-to-right wave across the letters.
        delays[i * 2] = Math.random() * 0.55;
        delays[i * 2 + 1] = ((u + 1) / 2) * 0.55 + Math.random() * 0.12;
        sparks[i] = Math.random() < 0.06 ? 1 : 0;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.setAttribute("aDelay", new THREE.BufferAttribute(delays, 2));
    g.setAttribute("aSpark", new THREE.BufferAttribute(sparks, 1));
    return g;
  }, [samples, size.width, size.height, camera]);

  useEffect(() => () => geometry?.dispose(), [geometry]);
  // Geometry exists → shaders compile on the next frame; tell the boot screen.
  useEffect(() => {
    if (geometry) requestAnimationFrame(() => markReady("scene"));
  }, [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 2) },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uShockAge: { value: 100 },
      uShockOrigin: { value: new THREE.Vector2(6, -12) },
      uAssemble: { value: 0 },
      uCollapse: { value: 0 },
      uInk: { value: (isDark ? PALETTE.dark : PALETTE.light).ink.clone() },
      uAccent: { value: (isDark ? PALETTE.dark : PALETTE.light).accent.clone() },
    }),
    [], // eslint-disable-line react-hooks/exhaustive-deps -- uniforms are mutated per frame, never recreated
  );

  // Re-tint in the same frame as the DOM so the theme reveal never shows mismatched dots.
  useEffect(() => {
    const target = isDark ? PALETTE.dark : PALETTE.light;
    uniforms.uInk.value.copy(target.ink);
    uniforms.uAccent.value.copy(target.accent);
    invalidate();
  }, [isDark, uniforms, invalidate]);

  // Fire a shockwave on every theme change (skip the initial mount).
  const firstTheme = useRef(true);
  useEffect(() => {
    if (firstTheme.current) {
      firstTheme.current = false;
      return;
    }
    if (reducedMotion) return;
    // Originate under the horizontal position of the pointer, at the back of the field.
    uniforms.uShockOrigin.value.set(input.current.ndc.x * 9, -12);
    uniforms.uShockAge.value = 0;
  }, [isDark, reducedMotion, uniforms, input]);

  // Timeline: starts once the geometry exists and the intro curtain has lifted.
  const timeline = useRef({ start: null, revealed: false });
  const reveal = useCallback(() => {
    if (timeline.current.revealed) return;
    timeline.current.revealed = true;
    onReveal?.();
  }, [onReveal]);

  useEffect(() => {
    if (reducedMotion) {
      uniforms.uAssemble.value = 2;
      uniforms.uCollapse.value = 3;
      reveal();
    }
  }, [reducedMotion, uniforms, reveal]);

  // Scrolling (or a key press) during the sequence fast-forwards it — never block the visitor.
  useEffect(() => {
    const skip = () => {
      const t = timeline.current;
      if (t.revealed || t.start === null) return;
      t.start = performance.now() / 1000 - COLLAPSE_AT;
    };
    const onScroll = () => window.scrollY > 40 && skip();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  useFrame((state, delta) => {
    const u = uniforms;
    if (geometry && !reducedMotion) {
      const now = performance.now() / 1000;
      const t = timeline.current;
      if (t.start === null) {
        const doneAt = preloaderDoneAt();
        if (doneAt === null) return; // boot screen still up — hold the scatter state
        t.start = Math.max(now, doneAt / 1000 + 0.05);
      }
      const elapsed = now - t.start;
      u.uAssemble.value = Math.max(0, elapsed / HOLD_START) * 1.25;
      u.uCollapse.value = Math.max(0, (elapsed - COLLAPSE_AT) / 1.6) * 1.4;
      if (elapsed >= COLLAPSE_AT) reveal();
    }
    if (!reducedMotion) u.uTime.value += delta;
    u.uShockAge.value = Math.min(u.uShockAge.value + delta, 100);
    const { ndc, active, scroll } = input.current;
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      u.uPointer.value.x = THREE.MathUtils.damp(u.uPointer.value.x, hit.x, 4, delta);
      u.uPointer.value.y = THREE.MathUtils.damp(u.uPointer.value.y, hit.z, 4, delta);
    }
    u.uPointerStrength.value = THREE.MathUtils.damp(u.uPointerStrength.value, active, 2.5, delta);
    u.uScroll.value = THREE.MathUtils.damp(u.uScroll.value, scroll, 4, delta);
    // Subtle camera drift tied to the pointer for parallax.
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, ndc.x * 0.6, 2, delta);
    state.camera.lookAt(0, -0.6, -3);
  });

  if (!geometry) return null;
  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

class SceneBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    // No WebGL: release the boot screen and show the page content immediately.
    markReady("scene");
    this.props.onFail?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SignalField({ isDark, reducedMotion, onReveal }) {
  const wrapper = useRef(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely when the hero is scrolled away.
  useEffect(() => {
    if (!wrapper.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0" aria-hidden="true">
      <SceneBoundary onFail={onReveal}>
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.75]}
          camera={{ position: [0, 3.2, 9], fov: 42 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <Field isDark={isDark} reducedMotion={reducedMotion} onReveal={onReveal} />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
