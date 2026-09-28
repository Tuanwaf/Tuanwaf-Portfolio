import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import logo from './logo-shape.json';

// Slightly deeper than the CSS pastels: lighting brightens them back to pastel on screen.
const PASTELS = ['#b59cff', '#ffb690', '#98e3bb', '#98c7ff', '#ffdf75', '#ffa3c8'];

// Simplex-ish noise used to wobble the blobs on the GPU.
const NOISE = /* glsl */ `
  uniform float uTime; uniform float uAmp;
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float wob(vec3 p){ return snoise(p*1.1+uTime*.25)*uAmp; }
`;

function blobMaterial(color, seed) {
  const mat = new THREE.MeshPhysicalMaterial({
    color, roughness: 0.32, metalness: 0.02, clearcoat: 0.8, clearcoatRoughness: 0.25,
    sheen: 0.4, sheenColor: new THREE.Color('#ffffff'), sheenRoughness: 0.6, iridescence: 0.25,
  });
  mat.userData.uniforms = { uTime: { value: seed * 10 }, uAmp: { value: 0.28 } };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, mat.userData.uniforms);
    shader.vertexShader = NOISE + shader.vertexShader
      .replace('#include <beginnormal_vertex>', `
        vec3 objectNormal = normal;
        float e = .02;
        vec3 tA = normalize(cross(normal, vec3(0.,1.,.01)));
        vec3 tB = normalize(cross(normal, tA));
        vec3 pA = position + tA*e; vec3 pB = position + tB*e;
        vec3 q0 = position + normal*wob(position);
        vec3 qA = pA + normalize(pA)*wob(pA);
        vec3 qB = pB + normalize(pB)*wob(pB);
        objectNormal = normalize(cross(qA-q0, qB-q0));
        if (dot(objectNormal, normal) < 0.) objectNormal = -objectNormal;
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif`)
      .replace('#include <begin_vertex>', 'vec3 transformed = position + normal*wob(position);');
  };
  return mat;
}

function logoGeometry() {
  const shape = new THREE.Shape();
  const w = 3.3, h = w / logo.aspect;
  logo.pts.forEach(([x, y], i) => {
    const px = (x - 0.5) * w, py = (0.5 - y) * h;
    i ? shape.lineTo(px, py) : shape.moveTo(px, py);
  });
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.55, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.06, bevelSegments: 6, curveSegments: 4,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

export function createScene(canvas, { mobile, reduced }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75;
  const key = new THREE.DirectionalLight('#ffffff', 1.6); key.position.set(3, 5, 6); scene.add(key);
  const fill = new THREE.DirectionalLight('#ffb8dc', 1.4); fill.position.set(-6, -2, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight('#9fe8ff', 1.6); rim.position.set(6, 1, -4); scene.add(rim);

  // Logo
  const logoMat = new THREE.MeshPhysicalMaterial({
    color: '#c9b3ff', metalness: 0.35, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08,
    iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [250, 900],
  });
  const logoMesh = new THREE.Mesh(logoGeometry(), logoMat);
  const logoGroup = new THREE.Group();
  logoGroup.add(logoMesh);
  scene.add(logoGroup);

  // Blobs + props
  const props = [];
  const blobGeo = new THREE.IcosahedronGeometry(1, mobile ? 20 : 40);
  const layout = [
    { g: blobGeo, s: 1.25, p: [-4.6, 2.1, -2], c: 0 },
    { g: blobGeo, s: 0.9, p: [4.4, -1.8, -1], c: 1 },
    { g: blobGeo, s: 0.55, p: [3.5, 2.6, 0.5], c: 2 },
    { g: blobGeo, s: 0.7, p: [-3.2, -2.7, 0.8], c: 3 },
    { g: new THREE.TorusGeometry(0.62, 0.24, 32, 96), s: 1, p: [-5.2, -0.3, -3], c: 4, spin: 1 },
    { g: new THREE.CapsuleGeometry(0.34, 0.9, 12, 32), s: 1, p: [5.6, 0.9, -2.5], c: 5, spin: 1 },
    { g: blobGeo, s: 0.32, p: [1.4, -3.1, 1.5], c: 4 },
    { g: blobGeo, s: 0.26, p: [-1.8, 3.2, 1.2], c: 2 },
  ];
  const baseColors = [];
  layout.forEach((o, i) => {
    const isBlob = o.g === blobGeo;
    const mat = isBlob ? blobMaterial(PASTELS[o.c], i) : new THREE.MeshPhysicalMaterial({ color: PASTELS[o.c], roughness: 0.25, clearcoat: 1, sheen: 0.3, iridescence: 0.3 });
    const mesh = new THREE.Mesh(o.g, mat);
    mesh.scale.setScalar(o.s);
    mesh.position.set(...o.p);
    mesh.userData = { base: new THREE.Vector3(...o.p), phase: i * 1.7, spin: o.spin, depth: 0.4 + (o.p[2] + 3) * 0.2 };
    baseColors.push(new THREE.Color(PASTELS[o.c]));
    scene.add(mesh);
    props.push(mesh);
  });

  // State
  const pointer = new THREE.Vector2(0, 0);
  const smooth = new THREE.Vector2(0, 0);
  let scroll = 0; // page px
  let heroH = window.innerHeight;
  let spinBoost = 0, spinAngle = 0;
  let accent = null; // THREE.Color[] while a project is focused
  let outro = 0; // 0..1 as the contact section scrolls in
  let running = true;
  let dragging = false, dragX = 0, dragVel = 0, dragRot = 0;
  const timer = new THREE.Timer();

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the logo a sensible size on tall phones.
    camera.position.z = w / h < 0.8 ? 17 : 12;
    camera.updateProjectionMatrix();
    heroH = h;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    if (dragging) { dragVel = (e.clientX - dragX) * 0.01; dragX = e.clientX; dragRot += dragVel; }
  }, { passive: true });

  // Click / drag the logo (canvas has pointer-events: none, so raycast from window events)
  const ray = new THREE.Raycaster();
  function hitLogo(e) {
    const v = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    ray.setFromCamera(v, camera);
    return ray.intersectObject(logoMesh).length > 0;
  }
  window.addEventListener('pointerdown', (e) => {
    if ((scroll > heroH * 0.8 && outro < 0.9) || e.target.closest('a,button,[data-drag],.bento__card')) return;
    if (hitLogo(e)) { dragging = true; dragX = e.clientX; dragVel = 0; document.body.classList.add('logo-drag'); }
  });
  window.addEventListener('pointerup', (e) => {
    if (dragging && Math.abs(dragVel) < 0.02 && hitLogo(e)) spinBoost = 1;
    dragging = false; document.body.classList.remove('logo-drag');
  });

  function frame() {
    if (!running) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.getElapsed();
    smooth.lerp(pointer, 1 - Math.pow(0.001, dt));

    // Logo: floats in hero, then drifts right & back as you scroll away.
    spinBoost *= Math.pow(0.08, dt);
    spinAngle += spinBoost * dt * 22;
    if (!dragging) { dragRot += dragVel; dragVel *= Math.pow(0.02, dt); }
    const wide = camera.aspect > 1;
    const vh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const vw = vh * camera.aspect;
    // Hero pose -> flies up and away over the first screen -> returns for the contact outro.
    const leave = Math.min(scroll / heroH, 1);
    const hx = (wide ? vw * 0.52 : 0) + leave * (wide ? vw * 0.25 : 0.8);
    const hy = (wide ? vh * 0.3 : vh * 0.38) + leave * vh * 1.9;
    const ox = wide ? vw * 0.55 : 0, oy = wide ? -vh * 0.05 : vh * 0.55;
    const o = outro * outro * (3 - 2 * outro);
    logoGroup.position.x = hx + (ox - hx) * o;
    logoGroup.position.y = hy + (oy - hy) * o + Math.sin(t * 0.8) * 0.12;
    logoGroup.position.z = -leave * 3 * (1 - o);
    logoGroup.rotation.y = smooth.x * 0.55 + Math.sin(t * 0.4) * 0.18 + spinAngle + dragRot + leave * 1.4 * (1 - o);
    logoGroup.rotation.x = -smooth.y * 0.35 + Math.cos(t * 0.5) * 0.06;
    logoGroup.rotation.z = Math.sin(t * 0.3) * 0.04;
    const ls = (wide ? 1.15 : 1.25) * (1 + spinBoost * 0.12);
    logoGroup.scale.setScalar(ls);
    logoMat.iridescenceThicknessRange[1] = 700 + Math.sin(t * 0.7) * 160;

    // Blobs: drift, parallax with pointer and scroll.
    props.forEach((m, i) => {
      const u = m.userData;
      m.position.x = u.base.x + Math.sin(t * 0.35 + u.phase) * 0.35 + smooth.x * u.depth * 0.6;
      // Scroll parallax that wraps, so the blobs keep drifting through the whole page.
      const span = vh + 2;
      const raw = u.base.y + (scroll / heroH) * u.depth * 2.2 + span;
      const wrapped = (((raw % (2 * span)) + 2 * span) % (2 * span)) - span;
      m.position.y = wrapped + Math.cos(t * 0.3 + u.phase) * 0.35 + smooth.y * u.depth * 0.4;
      if (u.spin) { m.rotation.x = t * 0.4 + u.phase; m.rotation.y = t * 0.3; }
      const uni = m.material.userData.uniforms;
      if (uni) uni.uTime.value += dt;
      const target = accent ? accent[i % accent.length] : baseColors[i];
      m.material.color.lerp(target, 1 - Math.pow(0.05, dt));
    });

    renderer.render(scene, camera);
    if (!reduced) requestAnimationFrame(frame);
  }
  frame();

  document.addEventListener('visibilitychange', () => {
    const was = running;
    running = !document.hidden;
    if (running && !was) { timer.reset?.(); requestAnimationFrame(frame); }
  });

  return {
    setScroll(y) { scroll = y; if (reduced) frame(); },
    setOutro(p) { outro = p; },
    setAccent(colors) { accent = colors ? colors.map((c) => new THREE.Color(c)) : null; },
    spin() { spinBoost = 1; },
  };
}
