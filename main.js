import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Render hedefi: model-container
const container = document.getElementById('model-container');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
camera.position.set(-10, 10, 10);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.target.set(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 120);
spotLight.position.set(5, 20, 10);
spotLight.castShadow = true;
scene.add(spotLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
scene.add(new THREE.DirectionalLight(0xffffff, 0.8));
scene.add(new THREE.PointLight(0xffffff, 0.3));

const loader = new GLTFLoader().setPath('/public/quacheck_box/');

loader.load('result.gltf', (gltf) => {
  const mesh = gltf.scene;
  mesh.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  mesh.scale.set(0.1, 0.1, 0.1);
  mesh.position.set(1, 1, 1);
  mesh.rotation.set(3 * Math.PI / 2, 0, Math.PI / 2);
  scene.add(mesh);

  // Yükleme bittiğinde gizle
  document.getElementById('progress-container').style.display = 'none';
},
xhr => {
  console.log(`Yükleniyor: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
},
error => {
  console.error('Model yüklenemedi:', error);
});

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

