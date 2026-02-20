/**
 * Component ห้อง — สร้างผนัง พื้น และเฟอร์นิเจอร์ภายในห้อง
 * แก้ไข furniture: แก้ที่ defaultFurniture.ts หรือส่ง furniture เอง
 */
import type { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { RoomInteriorOptions, FurnitureItem } from "./types";
import { defaultFurniture } from "./defaultFurniture";

const DEFAULT_ROOM_W = 6;
const DEFAULT_ROOM_D = 4;
const DEFAULT_ROOM_H = 2.8;

/**
 * สร้างห้องพร้อมผนัง พื้น และเฟอร์นิเจอร์
 * คืนค่า mesh ตัวแรก (floor) — ใช้สำหรับอ้างอิง
 * แก้ไขเฟอร์นิเจอร์: แก้ที่ defaultFurniture.ts หรือส่ง options.furniture
 */
export function createRoomInterior(
  scene: Scene,
  options: RoomInteriorOptions = {}
): AbstractMesh {
  const prefix = options.meshPrefix ?? "room";
  const roomW = options.roomWidth ?? DEFAULT_ROOM_W;
  const roomD = options.roomDepth ?? DEFAULT_ROOM_D;
  const roomH = options.roomHeight ?? DEFAULT_ROOM_H;
  const furnitureList = options.furniture ?? defaultFurniture;

  const wallMat = new StandardMaterial(`${prefix}_wall`, scene);
  wallMat.diffuseColor = new Color3(0.95, 0.94, 0.92);

  const floor = MeshBuilder.CreateBox(
    `${prefix}_floor`,
    { width: roomW, height: 0.1, depth: roomD },
    scene
  );
  floor.position.y = 0.05;
  const floorMat = new StandardMaterial(`${prefix}_floor_mat`, scene);
  floorMat.diffuseColor = new Color3(0.6, 0.55, 0.5);
  floor.material = floorMat;

  const backWall = MeshBuilder.CreateBox(
    `${prefix}_back`,
    { width: roomW + 0.2, height: roomH, depth: 0.15 },
    scene
  );
  backWall.position.set(0, roomH / 2, -roomD / 2);
  backWall.material = wallMat;

  const leftWall = MeshBuilder.CreateBox(
    `${prefix}_left`,
    { width: 0.15, height: roomH, depth: roomD },
    scene
  );
  leftWall.position.set(-roomW / 2, roomH / 2, 0);
  leftWall.material = wallMat;

  const rightWall = MeshBuilder.CreateBox(
    `${prefix}_right`,
    { width: 0.15, height: roomH, depth: roomD },
    scene
  );
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.material = wallMat;

  furnitureList.forEach((item) => {
    const mesh = MeshBuilder.CreateBox(
      `${prefix}_${item.id}`,
      {
        width: item.size.width,
        height: item.size.height,
        depth: item.size.depth,
      },
      scene
    );
    mesh.position.set(item.position.x, item.position.y, item.position.z);
    const mat = new StandardMaterial(`${prefix}_${item.id}_mat`, scene);
    mat.diffuseColor = new Color3(item.color.r, item.color.g, item.color.b);
    if (item.emissive) {
      mat.emissiveColor = new Color3(
        item.emissive.r,
        item.emissive.g,
        item.emissive.b
      );
    }
    mesh.material = mat;
  });

  return floor;
}
