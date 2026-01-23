    import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const scene = new THREE.Scene();

loader.load('/assets/models/cars/supra.glb', (gltf) => {
  const car = gltf.scene;
  car.scale.set(1, 1, 1);
  car.position.set(0, 0, 0);
  scene.add(car);
});
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);
let currentSpoiler;

function changeSpoiler(path) {
  const loader = new GLTFLoader();
  if (currentSpoiler) scene.remove(currentSpoiler);

  loader.load(path, (gltf) => {
    currentSpoiler = gltf.scene;
    currentSpoiler.scale.set(1, 1, 1);
    scene.add(currentSpoiler);
  });
}
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
