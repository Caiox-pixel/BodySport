// ========================================
// 📁 static/js/viewer3d.js
// Sistema de Visualização 3D com Three.js (ESM)
// ========================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

let scene, camera, renderer;
let carBase, bodykitParts = {};
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraDistance = 5;
let cameraRotation = { x: 0, y: 0 };
let isInitialized = false;

// ========================================
// Inicializar visualização 3D
// ========================================
export function initViewer3D(containerId) {
  if (isInitialized) {
    console.warn("Viewer 3D já inicializado");
    return;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container não encontrado:", containerId);
    return;
  }

  // Limpar container
  container.innerHTML = "";

  // Cena e câmera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0c);
  scene.fog = new THREE.Fog(0x0a0a0c, 10, 50);

  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(0, 2, cameraDistance);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Iluminação
  setupLighting();
  createCarBase();

  // Controles
  setupControls();

  // Resize handler
  window.addEventListener("resize", () => handleResize(container));

  isInitialized = true;
  animate();
}

// ========================================
// Iluminação
// ========================================
function setupLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x00d4d4, 0.8);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0x0066ff, 0.3);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  const pointLight = new THREE.PointLight(0x00d4d4, 0.5, 100);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);
}

// ========================================
// Carro base (forma genérica)
// ========================================
function createCarBase() {
  const carGroup = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 1, 4.5),
    new THREE.MeshStandardMaterial({ color: 0x1a1a22, metalness: 0.7, roughness: 0.3 })
  );
  body.position.y = 0.5;
  body.castShadow = true;
  body.receiveShadow = true;
  carGroup.add(body);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.8, 2.5),
    new THREE.MeshStandardMaterial({ color: 0x1a1a22, metalness: 0.7, roughness: 0.3 })
  );
  roof.position.set(0, 1.2, -0.3);
  roof.castShadow = true;
  carGroup.add(roof);

  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.3, 1.5),
    new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.3,
      metalness: 0.1,
      roughness: 0.1
    })
  );
  windshield.position.set(0, 1.1, 0.5);
  carGroup.add(windshield);

  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const wheelPositions = [
    [-1.1, 0.4, 1.3],
    [1.1, 0.4, 1.3],
    [-1.1, 0.4, -1.3],
    [1.1, 0.4, -1.3]
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    carGroup.add(wheel);
  });

  carBase = carGroup;
  scene.add(carBase);
}

// ========================================
// Criar ou atualizar peça do bodykit
// ========================================
function createBodykitPart(partId, partType, color) {
  if (bodykitParts[partId]) {
    scene.remove(bodykitParts[partId]);
    delete bodykitParts[partId];
  }

  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: color || 0x1a1a22,
    metalness: 0.8,
    roughness: 0.2,
    emissive: new THREE.Color(color || 0x1a1a22).multiplyScalar(0.1)
  });

  let mesh;

  switch (partId) {
    case "para-choque-dianteiro":
      mesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 0.3), mat);
      mesh.position.set(0, 0.2, 2.4);
      group.add(mesh);
      break;

    case "para-choque-traseiro":
      mesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 0.3), mat);
      mesh.position.set(0, 0.2, -2.4);
      group.add(mesh);
      break;

    case "spoiler":
      const h = partType === "alto" ? 0.6 : partType === "medio" ? 0.4 : 0.3;
      mesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, h, 0.2), mat);
      mesh.position.set(0, 1.5, -2.3);
      group.add(mesh);
      break;

    case "saias-laterais":
      const left = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 4), mat);
      left.position.set(-1.25, 0.15, 0);
      group.add(left);
      const right = left.clone();
      right.position.x = 1.25;
      group.add(right);
      break;

    case "capo":
      mesh = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 1.8), mat);
      mesh.position.set(0, 1.05, 0.8);
      group.add(mesh);
      break;

    case "saia-dianteira":
      mesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.4), mat);
      mesh.position.set(0, 0.1, 2.1);
      group.add(mesh);
      break;
  }

  bodykitParts[partId] = group;
  scene.add(group);
}

// ========================================
// Atualizar peça (chamado pelo desenvolver.js)
// ========================================
export function updateBodykitPart(partId, active, partType, color) {
  if (!isInitialized || !scene) return;
  if (active) createBodykitPart(partId, partType, color);
  else if (bodykitParts[partId]) {
    scene.remove(bodykitParts[partId]);
    delete bodykitParts[partId];
  }
}

// ========================================
// Controles de câmera e mouse
// ========================================
function setupControls() {
  const canvas = renderer.domElement;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - previousMousePosition.x;
    const dy = e.clientY - previousMousePosition.y;
    cameraRotation.y += dx * 0.01;
    cameraRotation.x += dy * 0.01;
    cameraRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotation.x));
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  ["mouseup", "mouseleave"].forEach(evt =>
    canvas.addEventListener(evt, () => (isDragging = false))
  );

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    cameraDistance = Math.max(3, Math.min(15, cameraDistance + e.deltaY * 0.01));
  });

  // Botões externos
  document.getElementById("btnRotate")?.addEventListener("click", () => (cameraRotation.y += Math.PI / 4));
  document.getElementById("btnZoomIn")?.addEventListener("click", () => (cameraDistance = Math.max(3, cameraDistance - 0.5)));
  document.getElementById("btnZoomOut")?.addEventListener("click", () => (cameraDistance = Math.min(15, cameraDistance + 0.5)));
  document.getElementById("btnReset")?.addEventListener("click", () => {
    cameraDistance = 5;
    cameraRotation = { x: 0, y: 0 };
  });
}

// ========================================
// Atualização de câmera + animação
// ========================================
function updateCamera() {
  const x = Math.sin(cameraRotation.y) * cameraDistance;
  const z = Math.cos(cameraRotation.y) * cameraDistance;
  const y = 2 + Math.sin(cameraRotation.x) * 2;
  camera.position.set(x, y, z);
  camera.lookAt(0, 0.5, 0);
}

function animate() {
  requestAnimationFrame(animate);
  updateCamera();
  renderer.render(scene, camera);
}

// ========================================
// Resize
// ========================================
function handleResize(container) {
  if (!camera || !renderer) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// ========================================
// Limpeza
// ========================================
export function disposeViewer3D() {
  if (renderer) renderer.dispose();
  bodykitParts = {};
  scene = null;
  camera = null;
  renderer = null;
  isInitialized = false;
}
