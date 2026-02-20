/**
 * โหลดโมเดล 3D (GLB/GLTF) เข้า scene และตั้งตำแหน่ง/ขนาด
 * ต้อง register GLTF loader ก่อน (ครั้งเดียวในแอป)
 */
import type { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { ImportMeshAsync, RegisterSceneLoaderPlugin } from "@babylonjs/core/Loading/sceneLoader";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode";

// ลงทะเบียน GLTF/GLB loader (เรียกครั้งเดียวในแอป)
let gltfRegistered = false;
export function registerGLTFLoader(): Promise<void> {
  if (gltfRegistered) return Promise.resolve();
  return import("@babylonjs/loaders/glTF").then((m) => {
    const { GLTFFileLoader } = m;
    RegisterSceneLoaderPlugin(new GLTFFileLoader());
    gltfRegistered = true;
  });
}

export interface LoadModelOptions {
  position?: { x: number; y: number; z: number };
  rotation?: { x?: number; y?: number; z?: number };
  scaling?: number | { x: number; y: number; z: number };
  /** ชื่อที่ตั้งให้ root mesh (เพื่ออ้างอิงใน scene) */
  name?: string;
}

/**
 * โหลดโมเดลจาก URL (เช่น /models/doors/door-01.glb) แล้วใส่ใน scene
 * คืนค่า meshes ที่โหลดมา (จะอยู่ที่ position ที่กำหนด)
 */
export async function loadInteriorModel(
  scene: Scene,
  modelUrl: string,
  options: LoadModelOptions = {}
): Promise<AbstractMesh[]> {
  await registerGLTFLoader();

  const ext = modelUrl.includes(".glb") ? ".glb" : ".gltf";
  const result = await ImportMeshAsync(modelUrl, scene, {
    pluginExtension: ext,
  });

  const meshes = result.meshes.filter((m) => m.getClassName?.() === "TransformNode" || m.getClassName?.() === "Mesh") as AbstractMesh[];
  const set = new Set(meshes);
  // หา root จริงของโมเดล (โหนดบนสุดของ hierarchy) — บาง GLB มี root เป็น TransformNode ที่ไม่อยู่ใน result.meshes
  let node: TransformNode | AbstractMesh = meshes[0];
  while (node.parent && set.has(node.parent as AbstractMesh)) {
    node = node.parent as AbstractMesh;
  }
  const root: TransformNode =
    node.parent && !set.has(node.parent as AbstractMesh)
      ? (node.parent as TransformNode)
      : (node as TransformNode);
  if (!root) return meshes;

  if (options.name) root.name = options.name;

  if (options.position) {
    root.position = new Vector3(
      options.position.x,
      options.position.y,
      options.position.z
    );
  }

  if (options.rotation) {
    root.rotationQuaternion = null;
    const r = options.rotation;
    if (r.x != null) root.rotation.x = r.x;
    if (r.y != null) root.rotation.y = r.y;
    if (r.z != null) root.rotation.z = r.z;
  }

  if (options.scaling != null) {
    if (typeof options.scaling === "number") {
      root.scaling.setAll(options.scaling);
    } else {
      root.scaling.set(options.scaling.x, options.scaling.y, options.scaling.z);
    }
  }

  return meshes;
}
