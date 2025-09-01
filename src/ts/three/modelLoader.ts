import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export async function loadLogo(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(draco);

  try {
    const gltf = await loader.loadAsync("/public/models/logo.glb");
    const model = gltf.scene;
    model.position.set(0, -0.6, 0);
    model.scale.set(1.2, 1.2, 1.2);
    scene.add(model);
  } catch (e) {
    console.warn("No se pudo cargar logo.glb:", e);
  }
}
