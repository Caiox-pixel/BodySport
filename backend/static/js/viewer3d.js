// ===============================
// 📁 static/js/viewer3d.js
// Visualizador 3D — Three.js + GLTF
// ===============================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer;
let carModel = null;
let bodykitParts = {};
let loader = new GLTFLoader();

// ===============================
export function initViewer3D(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0c);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  animate();
}

// ===============================
export async function loadCarModel(url) {
  if (carModel) scene.remove(carModel);
  const gltf = await loader.loadAsync(url);
  carModel = gltf.scene;
  scene.add(carModel);
}

// ===============================
export async function loadKitPart(id, url, color) {
  if (bodykitParts[id]) scene.remove(bodykitParts[id]);
  const gltf = await loader.loadAsync(url);
  const obj = gltf.scene;

  if (color) {
    obj.traverse(c => {
      if (c.isMesh) c.material.color.set(color);
    });
  }

  bodykitParts[id] = obj;
  scene.add(obj);
}

// ===============================
export function updateBodykitPart(id, ativo, tipo, cor) {
  if (!ativo && bodykitParts[id]) {
    scene.remove(bodykitParts[id]);
    delete bodykitParts[id];
  }
}

// ===============================
function animate() {
  requestAnimationFrame(animate);
  if (renderer && camera) renderer.render(scene, camera);
}
