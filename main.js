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
  camera.position.z = -10.5 * Math.SQRT1_2;
  camera.position.x = 10.5 * Math.SQRT1_2;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var loader = new GLTFLoader();
  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderConfig({ type: "js" });
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);

  loader.load("neptunium_web.draco.gltf", function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0.25, 0);
    //   model.rotateY(Math.PI);
    //   model.rotateX(Math.PI);
    model.rotateZ(-Math.PI / 2);
    model.scale.set(100, 100, 100);
    scene.add(model);
    hideLoadingOverlay();
  });

  var global_illumination = new THREE.AmbientLight(0xffffff, 1);
  scene.add(global_illumination);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;

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
  document.getElementById("loadingOverlay").classList.add("fade-out");

  setTimeout(() => {
    document.getElementById("loadingOverlay").style.display = "none";
  }, 1000);
}
