// anatomy.js — interactive 3D ENT anatomy room.
// Centerpiece: a real CT-derived "nasal cavity with paranasal sinuses" GLB model
// (optimized: weld + simplify + KHR_mesh_quantization, supported natively by GLTFLoader).
// Source model: BodyParts3D / Sketchfab "Nasal cavity with paranasal sinuses".
import * as THREE from "./vendor/three.module.js";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { GLTFLoader } from "./vendor/GLTFLoader.js";

// One legend card (bilingual) — shown when the model is tapped. Grounded in EAACI Atlas.
const LEGEND = {
  label: { id: "Kavum Nasi & Sinus Paranasal", en: "Nasal Cavity & Paranasal Sinuses" },
  info: {
    id: "Model CT 3D asli: kavum nasi, konka, septum, dan sinus paranasal (maksila, frontal, etmoid, sfenoid). Putar & zoom untuk menelaah. Pada rinitis alergi, mukosa & konka membengkak dan memerah — tekan 'Mode Alergi' untuk melihatnya. Ingat United Airway: saluran napas atas & bawah satu kesatuan; RA adalah faktor risiko utama asma. [EAACI Atlas]",
    en: "Real 3D CT model: nasal cavity, turbinates, septum, and paranasal sinuses (maxillary, frontal, ethmoid, sphenoid). Rotate & zoom to study. In allergic rhinitis the mucosa & turbinates swell and redden — press 'Allergic Mode' to see it. Remember the United Airway: upper & lower airways are one; AR is a major risk factor for asthma. [EAACI Atlas]"
  }
};

const MUCOSA_NORMAL = 0xe7a79c, MUCOSA_INFLAMED = 0xcf3a30;

let renderer, scene, camera, controls, raf, containerEl;
let modelGroup = null, modelMat = null, allergens = null, baseScale = 1;
let allergic = false, started = false, lang = "id", onInfo = null;
let modelMeshes = [];

function buildLights() {
  const key = new THREE.DirectionalLight(0xfff1d6, 2.0); key.position.set(9, 14, 12); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd9a0, 1.1); rim.position.set(-8, 6, -10); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xbfe6e0, 0.7); fill.position.set(-12, -2, 6); scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x6b4a2a, 0.95));
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
}

function buildAllergens() {
  allergens = new THREE.Group(); allergens.visible = false;
  for (let i = 0; i < 36; i++) {
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 0),
      new THREE.MeshStandardMaterial({ color: 0xfff0a0, emissive: 0x7a6410, emissiveIntensity: 0.5, roughness: 0.4 }));
    s.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    allergens.add(s);
  }
  scene.add(allergens);
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load("./assets/nasal.glb", (gltf) => {
    modelGroup = gltf.scene;
    modelMat = new THREE.MeshStandardMaterial({
      color: MUCOSA_NORMAL, roughness: 0.5, metalness: 0.0, flatShading: false, side: THREE.DoubleSide
    });
    modelMeshes = [];
    modelGroup.traverse((o) => {
      if (o.isMesh) {
        o.material = modelMat;
        if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
        modelMeshes.push(o);
      }
    });

    // center + scale to a consistent on-screen size
    const box = new THREE.Box3().setFromObject(modelGroup);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    baseScale = 11 / maxDim;
    modelGroup.scale.setScalar(baseScale);
    modelGroup.position.set(-center.x * baseScale, -center.y * baseScale, -center.z * baseScale);
    scene.add(modelGroup);

    // frame the camera on the centered model
    controls.target.set(0, 0, 0);
    camera.position.set(13, 4, 13);
    controls.update();

    const ld = document.getElementById("anaLoading");
    if (ld) ld.style.display = "none";
  }, undefined, (err) => {
    const ld = document.getElementById("anaLoading");
    if (ld) ld.textContent = "⚠ Gagal memuat model 3D / Failed to load 3D model";
    console.error("GLB load error", err);
  });
}

export function setAnatomyLang(l) { lang = l; }
export function isAllergic() { return allergic; }

export function setAllergic(on) {
  allergic = on;
  if (modelMat) { modelMat.color.setHex(on ? MUCOSA_INFLAMED : MUCOSA_NORMAL); modelMat.emissive.setHex(on ? 0x3a0805 : 0x000000); }
  if (allergens) allergens.visible = on;
  if (modelGroup && !on) modelGroup.scale.setScalar(baseScale);
}

export function startAnatomy(container, options = {}) {
  containerEl = container; lang = options.lang || "id"; onInfo = options.onInfo || null;
  if (started) { resize(); return; }
  started = true;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
  camera.position.set(15, 5, 15);

  buildLights();
  buildAllergens();
  loadModel();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 5; controls.maxDistance = 60;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.8;

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  renderer.domElement.addEventListener("click", (ev) => {
    if (!modelMeshes.length || !onInfo) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    if (ray.intersectObjects(modelMeshes, true).length) onInfo(LEGEND, lang);
  });

  window.addEventListener("resize", resize); resize();
  setTimeout(resize, 60); setTimeout(resize, 250); setTimeout(resize, 600);

  const loop = () => {
    raf = requestAnimationFrame(loop);
    controls.update();
    if (allergens && allergens.visible) {
      const t = performance.now() * 0.001;
      allergens.children.forEach((s, i) => { s.position.y += Math.sin(t + i) * 0.0015; s.rotation.x += 0.02; s.rotation.y += 0.015; });
    }
    if (modelGroup && allergic) {
      const p = 1 + Math.sin(performance.now() * 0.004) * 0.012; // subtle inflamed pulse
      modelGroup.scale.setScalar(baseScale * p);
    }
    renderer.render(scene, camera);
  };
  loop();
}

function resize() {
  if (!renderer || !containerEl) return;
  let w = containerEl.clientWidth, h = containerEl.clientHeight;
  if (w < 10 || h < 10) { w = window.innerWidth; h = window.innerHeight; }
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}

export function pauseAnatomy(pause) { if (controls) controls.autoRotate = !pause; }
