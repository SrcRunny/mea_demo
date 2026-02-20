/**
 * สร้าง interior แบบง่ายจากกล่อง/รูปทรง (ไม่ต้องมีไฟล์ GLB)
 * ใช้เป็น placeholder หรือแทนโมเดลจริงได้
 */
import type { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

export interface PlaceAt {
  x: number;
  y: number;
  z: number;
}

/** ประตูแบบง่าย (กล่องบาง + กรอบ) */
export function createDoorPlaceholder(
  scene: Scene,
  name: string,
  at: PlaceAt,
  width = 1,
  height = 2.2,
  depth = 0.06
): AbstractMesh {
  const door = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
  door.position = new Vector3(at.x, at.y, at.z);
  const mat = new StandardMaterial(`${name}_mat`, scene);
  mat.diffuseColor = new Color3(0.45, 0.35, 0.28);
  mat.specularColor = new Color3(0.15, 0.15, 0.15);
  door.material = mat;
  return door;
}

/** ชั้นวางของแบบง่าย (กล่องแบนหลายชั้น) */
export function createShelfPlaceholder(
  scene: Scene,
  name: string,
  at: PlaceAt,
  width = 1.2,
  depth = 0.4,
  shelfCount = 4,
  shelfHeight = 0.03
): AbstractMesh[] {
  const meshes: AbstractMesh[] = [];
  const frameMat = new StandardMaterial(`${name}_frame`, scene);
  frameMat.diffuseColor = new Color3(0.35, 0.28, 0.22);
  frameMat.specularColor = new Color3(0.1, 0.1, 0.1);

  const totalHeight = shelfCount * 0.35;
  for (let i = 0; i < shelfCount; i++) {
    const shelf = MeshBuilder.CreateBox(
      `${name}_shelf_${i}`,
      { width, height: shelfHeight, depth },
      scene
    );
    shelf.position.set(at.x, at.y + i * 0.35 + shelfHeight / 2, at.z);
    shelf.material = frameMat;
    meshes.push(shelf);
  }
  const back = MeshBuilder.CreateBox(
    `${name}_back`,
    { width: width + 0.02, height: totalHeight, depth: 0.02 },
    scene
  );
  back.position.set(at.x, at.y + totalHeight / 2, at.z - depth / 2 - 0.01);
  back.material = frameMat;
  meshes.push(back);
  return meshes;
}
