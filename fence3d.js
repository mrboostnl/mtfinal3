// 3D fence viewer: chain of Rhombus panels with optional 90° corners. Units: metres.
const THREE_URL = 'https://esm.sh/three@0.160.0';
const ORBIT_URL = 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';
const COLORS = { teak: [0xa8713f, 0x6b4425], grijs: [0x8b8a85, 0x55544f], zwart: [0x2c2d31, 0x141518] };

export async function mountFence(el, opts) {
  const THREE = await import(THREE_URL);
  const { OrbitControls } = await import(ORBIT_URL);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(el.clientWidth, el.clientHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.1, 300);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.49; controls.minDistance = 2; controls.maxDistance = 60;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c6, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-8, 14, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -25, right: 25, top: 25, bottom: -25 });
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ opacity: 0.18 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const postMat = new THREE.MeshStandardMaterial({ color: 0x24262a, roughness: 0.55, metalness: 0.35 });
  const slatMat = new THREE.MeshStandardMaterial({ color: COLORS.teak[0], roughness: 0.8 });
  const grooveMat = new THREE.MeshStandardMaterial({ color: COLORS.teak[1], roughness: 0.9 });
  const POST = 0.08, SPAN = 1.8, INNER = SPAN - POST;
  let height = opts.height || 1.8;
  let turns = (opts.turns && opts.turns.length) ? opts.turns.slice() : [0, 0, 0];
  const fence = new THREE.Group(); scene.add(fence);
  let panels = [];

  function buildPanel() {
    const g = new THREE.Group();
    const h = height - 0.05, slatH = 0.052, gap = 0.008, n = Math.floor((h - 0.06) / (slatH + gap));
    const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(INNER, slatH, 0.025), slatMat, n);
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { m.makeTranslation(0, 0.08 + slatH / 2 + i * (slatH + gap), 0); slats.setMatrixAt(i, m); }
    slats.castShadow = true;
    const grooves = new THREE.Mesh(new THREE.BoxGeometry(INNER, h - 0.06, 0.012), grooveMat);
    grooves.position.y = 0.08 + (h - 0.06) / 2;
    const rail = (y) => { const r = new THREE.Mesh(new THREE.BoxGeometry(INNER, 0.03, 0.04), postMat); r.position.y = y; r.castShadow = true; return r; };
    g.add(slats, grooves, rail(0.065), rail(0.035 + h));
    return g;
  }
  function buildPost() {
    const g = new THREE.Group();
    const p = new THREE.Mesh(new THREE.BoxGeometry(POST, height + 0.02, POST), postMat);
    p.position.y = (height + 0.02) / 2; p.castShadow = true;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(POST + 0.012, 0.02, POST + 0.012), postMat);
    cap.position.y = height + 0.03; g.add(p, cap); return g;
  }
  let firstPost = buildPost(); fence.add(firstPost);

  // Layout: panel i starts at joint i, heading accumulates turns (+1 = left 90°, -1 = right 90°).
  function layout() {
    const out = []; let x = 0, z = 0, head = 0;
    for (let i = 0; i < turns.length; i++) {
      head += (turns[i] || 0) * Math.PI / 2;
      out.push({ x, z, rot: head });
      x += Math.cos(head) * SPAN; z -= Math.sin(head) * SPAN;
    }
    return out;
  }
  function makePanelGroup() {
    const g = new THREE.Group();
    const panel = buildPanel(); panel.position.x = SPAN / 2;
    const post = buildPost(); post.position.x = SPAN;
    g.add(panel, post); g.scale.set(1, 0.001, 1);
    g.userData = { s: 0.001, alive: true };
    fence.add(g); return g;
  }
  function applyLayout(snap) {
    const L = layout();
    while (panels.filter(p => p.userData.alive).length < L.length) {
      const g = makePanelGroup(); const k = panels.filter(p => p.userData.alive).length;
      const pos = L[k]; g.position.set(pos.x, 0, pos.z); g.rotation.y = pos.rot; panels.splice(k, 0, g);
    }
    let k = 0;
    panels.forEach(p => {
      if (!p.userData.alive) return;
      if (k < L.length) { p.userData.tx = L[k].x; p.userData.tz = L[k].z; p.userData.tr = L[k].rot; if (snap) { p.position.set(L[k].x, 0, L[k].z); p.rotation.y = L[k].rot; } }
      else p.userData.alive = false;
      k++;
    });
    frame(L);
  }
  function rebuildAll() {
    panels.forEach(p => fence.remove(p)); panels = [];
    fence.remove(firstPost); firstPost = buildPost(); fence.add(firstPost);
    applyLayout(true); panels.forEach(p => { p.userData.s = 1; p.scale.y = 1; });
  }
  function setColor(k) { const c = COLORS[k] || COLORS.teak; slatMat.color.setHex(c[0]); grooveMat.color.setHex(c[1]); }
  setColor(opts.color || 'teak');

  const camTarget = new THREE.Vector3(); let camDist = 6, userMoved = false, first = true;
  controls.addEventListener('start', () => { userMoved = true; });
  function frame(L) {
    let minX = 0, maxX = 0, minZ = 0, maxZ = 0;
    L.forEach(p => { const ex = p.x + Math.cos(p.rot) * SPAN, ez = p.z - Math.sin(p.rot) * SPAN; minX = Math.min(minX, p.x, ex); maxX = Math.max(maxX, p.x, ex); minZ = Math.min(minZ, p.z, ez); maxZ = Math.max(maxZ, p.z, ez); });
    camTarget.set((minX + maxX) / 2, height * 0.45, (minZ + maxZ) / 2);
    camDist = Math.max(5, Math.hypot(maxX - minX, maxZ - minZ) * 1.15 + 2.5);
  }
  applyLayout(true); panels.forEach(p => { p.userData.s = 1; p.scale.y = 1; });
  controls.target.copy(camTarget);

  let raf, t0 = performance.now();
  function tick() {
    raf = requestAnimationFrame(tick);
    panels.forEach(p => {
      const u = p.userData, want = u.alive ? 1 : 0;
      u.s += (want - u.s) * 0.14; p.scale.y = Math.max(0.001, u.s); p.visible = u.s > 0.01;
      if (u.alive && u.tx !== undefined) {
        p.position.x += (u.tx - p.position.x) * 0.15; p.position.z += (u.tz - p.position.z) * 0.15;
        p.rotation.y += (u.tr - p.rotation.y) * 0.15;
      }
    });
    for (let i = panels.length - 1; i >= 0; i--) if (!panels[i].userData.alive && panels[i].userData.s < 0.01) { fence.remove(panels[i]); panels.splice(i, 1); }
    controls.target.lerp(camTarget, 0.08);
    if (!userMoved) {
      const a = (performance.now() - t0) / 9000;
      const want = new THREE.Vector3(camTarget.x + Math.sin(a) * camDist * 0.55, height * 1.2 + camDist * 0.18, camTarget.z + Math.cos(a) * camDist * 0.9);
      camera.position.lerp(want, first ? 1 : 0.03); first = false;
    }
    controls.update(); renderer.render(scene, camera);
  }
  tick();
  const ro = new ResizeObserver(() => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); });
  ro.observe(el);

  return {
    setTurns(t) { const next = (t && t.length ? t : [0]).slice(); if (next.join() === turns.join()) return; turns = next; applyLayout(false); },
    setCount(n) { const t = turns.slice(0, n); while (t.length < n) t.push(0); this.setTurns(t); },
    setColor,
    setHeight(h) { if (Math.abs(h - height) < 0.001) return; height = h; rebuildAll(); },
    resetView() { userMoved = false; t0 = performance.now(); },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); el.innerHTML = ''; }
  };
}
