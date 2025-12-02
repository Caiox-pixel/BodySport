// Sistema de Visualização 3D com Three.js

let scene, camera, renderer, controls;
let carBase, bodykitParts = {};
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraDistance = 5;
let cameraRotation = { x: 0, y: 0 };
let isInitialized = false;

// Verificar se Three.js está disponível
function checkThreeJS() {
  if (typeof THREE === 'undefined') {
    console.error('Three.js não está carregado. Certifique-se de incluir o script antes deste arquivo.');
    return false;
  }
  return true;
}

// Inicializar visualização 3D
export function initViewer3D(containerId) {
  if (!checkThreeJS()) return;
  
  if (isInitialized) {
    console.warn('Viewer 3D já foi inicializado');
    return;
  }
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container não encontrado:', containerId);
    return;
  }

  // Limpar container
  container.innerHTML = '';

  // Criar cena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0c);
  scene.fog = new THREE.Fog(0x0a0a0c, 10, 50);

  // Criar câmera
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(0, 2, cameraDistance);

  // Criar renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Adicionar iluminação
  setupLighting();

  // Criar carro base
  createCarBase();

  // Adicionar grid e eixos (opcional, para debug)
  // const gridHelper = new THREE.GridHelper(10, 10, 0x333333, 0x222222);
  // scene.add(gridHelper);
  // const axesHelper = new THREE.AxesHelper(2);
  // scene.add(axesHelper);

  // Event listeners para controles
  setupControls(container);

  isInitialized = true;

  // Iniciar animação
  animate();

  // Resize handler
  window.addEventListener('resize', () => handleResize(container));
}

// Configurar iluminação
function setupLighting() {
  // Luz ambiente
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Luz direcional principal
  const directionalLight = new THREE.DirectionalLight(0x00d4d4, 0.8);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Luz de preenchimento
  const fillLight = new THREE.DirectionalLight(0x0066ff, 0.3);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  // Luz pontual para destaque
  const pointLight = new THREE.PointLight(0x00d4d4, 0.5, 100);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);
}

// Criar carro base (simplificado)
function createCarBase() {
  const carGroup = new THREE.Group();

  // Corpo principal do carro
  const bodyGeometry = new THREE.BoxGeometry(2.5, 1, 4.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    metalness: 0.7,
    roughness: 0.3
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.5;
  body.castShadow = true;
  body.receiveShadow = true;
  carGroup.add(body);

  // Teto
  const roofGeometry = new THREE.BoxGeometry(2, 0.8, 2.5);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    metalness: 0.7,
    roughness: 0.3
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 1.2, -0.3);
  roof.castShadow = true;
  carGroup.add(roof);

  // Para-brisa (vidro)
  const windshieldGeometry = new THREE.BoxGeometry(2.1, 0.3, 1.5);
  const windshieldMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3,
    metalness: 0.1,
    roughness: 0.1
  });
  const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
  windshield.position.set(0, 1.1, 0.5);
  carGroup.add(windshield);

  // Rodas (simplificadas)
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  
  const wheelPositions = [
    { x: -1.1, y: 0.4, z: 1.3 },
    { x: 1.1, y: 0.4, z: 1.3 },
    { x: -1.1, y: 0.4, z: -1.3 },
    { x: 1.1, y: 0.4, z: -1.3 }
  ];

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, pos.y, pos.z);
    wheel.castShadow = true;
    carGroup.add(wheel);
  });

  carBase = carGroup;
  scene.add(carBase);
}

// Criar peça do bodykit
function createBodykitPart(partId, partType, color) {
  // Remover peça existente se houver
  if (bodykitParts[partId]) {
    scene.remove(bodykitParts[partId]);
    delete bodykitParts[partId];
  }

  const partGroup = new THREE.Group();
  let geometry, material;

  material = new THREE.MeshStandardMaterial({
    color: color || 0x1a1a22,
    metalness: 0.8,
    roughness: 0.2,
    emissive: new THREE.Color(color || 0x1a1a22).multiplyScalar(0.1)
  });

  switch (partId) {
    case 'para-choque-dianteiro':
      geometry = new THREE.BoxGeometry(2.6, 0.4, 0.3);
      const frontBumper = new THREE.Mesh(geometry, material);
      frontBumper.position.set(0, 0.2, 2.4);
      frontBumper.castShadow = true;
      partGroup.add(frontBumper);
      
      // Adicionar detalhes baseado no tipo
      if (partType === 'agressivo') {
        const detail1 = new THREE.BoxGeometry(0.3, 0.2, 0.1);
        const detailMesh1 = new THREE.Mesh(detail1, material);
        detailMesh1.position.set(-0.8, 0.1, 2.5);
        partGroup.add(detailMesh1);
        
        const detailMesh2 = new THREE.Mesh(detail1, material);
        detailMesh2.position.set(0.8, 0.1, 2.5);
        partGroup.add(detailMesh2);
      }
      break;

    case 'para-choque-traseiro':
      geometry = new THREE.BoxGeometry(2.6, 0.4, 0.3);
      const rearBumper = new THREE.Mesh(geometry, material);
      rearBumper.position.set(0, 0.2, -2.4);
      rearBumper.castShadow = true;
      partGroup.add(rearBumper);
      break;

    case 'spoiler':
      const spoilerHeight = partType === 'alto' ? 0.6 : partType === 'medio' ? 0.4 : 0.3;
      geometry = new THREE.BoxGeometry(2.2, spoilerHeight, 0.2);
      const spoiler = new THREE.Mesh(geometry, material);
      spoiler.position.set(0, 1.5, -2.3);
      spoiler.castShadow = true;
      partGroup.add(spoiler);
      break;

    case 'saias-laterais':
      geometry = new THREE.BoxGeometry(0.15, 0.3, 4);
      const leftSkirt = new THREE.Mesh(geometry, material);
      leftSkirt.position.set(-1.25, 0.15, 0);
      leftSkirt.castShadow = true;
      partGroup.add(leftSkirt);
      
      const rightSkirt = new THREE.Mesh(geometry, material);
      rightSkirt.position.set(1.25, 0.15, 0);
      rightSkirt.castShadow = true;
      partGroup.add(rightSkirt);
      break;

    case 'capo':
      geometry = new THREE.BoxGeometry(2.1, 0.1, 1.8);
      const hood = new THREE.Mesh(geometry, material);
      hood.position.set(0, 1.05, 0.8);
      hood.castShadow = true;
      partGroup.add(hood);
      
      // Entrada de ar
      if (partType === 'dupla') {
        const vent1 = new THREE.BoxGeometry(0.3, 0.15, 0.8);
        const ventMesh1 = new THREE.Mesh(vent1, new THREE.MeshStandardMaterial({ color: 0x000000 }));
        ventMesh1.position.set(-0.4, 1.1, 0.8);
        partGroup.add(ventMesh1);
        
        const ventMesh2 = new THREE.Mesh(vent1, new THREE.MeshStandardMaterial({ color: 0x000000 }));
        ventMesh2.position.set(0.4, 1.1, 0.8);
        partGroup.add(ventMesh2);
      } else {
        const vent = new THREE.BoxGeometry(0.5, 0.15, 0.8);
        const ventMesh = new THREE.Mesh(vent, new THREE.MeshStandardMaterial({ color: 0x000000 }));
        ventMesh.position.set(0, 1.1, 0.8);
        partGroup.add(ventMesh);
      }
      break;

    case 'saia-dianteira':
      geometry = new THREE.BoxGeometry(2.4, 0.2, 0.4);
      const frontSkirt = new THREE.Mesh(geometry, material);
      frontSkirt.position.set(0, 0.1, 2.1);
      frontSkirt.castShadow = true;
      partGroup.add(frontSkirt);
      break;
  }

  bodykitParts[partId] = partGroup;
  scene.add(partGroup);
}

// Atualizar peça do bodykit
export function updateBodykitPart(partId, active, partType, color) {
  if (!isInitialized || !scene) {
    console.warn('Viewer 3D não inicializado');
    return;
  }
  
  if (active) {
    createBodykitPart(partId, partType, color);
  } else {
    if (bodykitParts[partId]) {
      scene.remove(bodykitParts[partId]);
      delete bodykitParts[partId];
    }
  }
}

// Configurar controles
function setupControls(container) {
  const canvas = renderer.domElement;

  // Rotação com mouse
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    cameraRotation.y += deltaX * 0.01;
    cameraRotation.x += deltaY * 0.01;
    cameraRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotation.x));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  // Zoom com scroll
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    cameraDistance += e.deltaY * 0.01;
    cameraDistance = Math.max(3, Math.min(15, cameraDistance));
  });

  // Controles de botões
  document.getElementById('btnRotate')?.addEventListener('click', () => {
    cameraRotation.y += Math.PI / 4;
  });

  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    cameraDistance = Math.max(3, cameraDistance - 0.5);
  });

  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    cameraDistance = Math.min(15, cameraDistance + 0.5);
  });

  document.getElementById('btnReset')?.addEventListener('click', () => {
    cameraDistance = 5;
    cameraRotation = { x: 0, y: 0 };
  });
}

// Atualizar posição da câmera
function updateCamera() {
  const x = Math.sin(cameraRotation.y) * cameraDistance;
  const z = Math.cos(cameraRotation.y) * cameraDistance;
  const y = 2 + Math.sin(cameraRotation.x) * 2;

  camera.position.set(x, y, z);
  camera.lookAt(0, 0.5, 0);
}

// Animação
function animate() {
  requestAnimationFrame(animate);
  updateCamera();
  renderer.render(scene, camera);
}

// Resize handler
function handleResize(container) {
  if (!camera || !renderer) return;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Limpar recursos
export function disposeViewer3D() {
  if (renderer) {
    renderer.dispose();
  }
  bodykitParts = {};
  scene = null;
  camera = null;
  renderer = null;
  isInitialized = false;
}

