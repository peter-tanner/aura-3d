import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

var scene, camera, renderer, controls;
var model;

init();
animate();

function init() {
  showLoadingOverlay();
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = -9.5 * Math.SQRT1_2;
  camera.position.x = 9.5 * Math.SQRT1_2;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var loader = new GLTFLoader();
  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderConfig({ type: "js" });
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);

  loader.load("AURA_web.glb", function (gltf) {
    model = gltf.scene;
    model.rotateY(-Math.PI / 2);
    model.rotateZ(-Math.PI / 2);
    scene.add(model);
    hideLoadingOverlay();
  });

  var global_illumination = new THREE.AmbientLight(0xeaf0e7, 0.1);
  scene.add(global_illumination);

  var sunlight1 = new THREE.DirectionalLight(0xeaf0e7, 1.2);
  sunlight1.position.set(5, 10, 5);
  sunlight1.target.position.set(0, 0, 0);
  sunlight1.castShadow = true;
  scene.add(sunlight1);

  var sunlight2 = new THREE.DirectionalLight(0xeaf0e7, 1.2);
  sunlight2.position.set(-5, 10, -5);
  sunlight2.target.position.set(0, 0, 0);
  sunlight2.castShadow = true;
  scene.add(sunlight2);

  // const light = new THREE.PointLight(0xff0000, 100, 100, 5);
  // light.position.set(-2, -2, 2);
  // scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;

  renderer.setClearColor(0x000000, 1);
  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener(
    "mousedown",
    () => (controls.autoRotate = false),
    false
  );
  document.addEventListener(
    "mouseup",
    () => (controls.autoRotate = true),
    false
  );
  document
    .getElementById("resetButton")
    .addEventListener("click", () => controls.reset());
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function showLoadingOverlay() {
  document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoadingOverlay() {
  controls.reset();
  document.getElementById("loadingOverlay").classList.add("fade-out");
  setTimeout(() => {
    document.getElementById("loadingOverlay").style.display = "none";
  }, 1000);
}
