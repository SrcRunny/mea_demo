import type { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

export type ViewMode = "hotel" | "floorExploded" | "floor8" | "room802";

export interface StoryboardSceneContext {
  getViewMode: () => ViewMode;
  setViewMode: (m: ViewMode) => void;
  setPopup: (p: PopupInfo | null) => void;
}

export interface PopupInfo {
  type: "cabinet" | "room";
  x: number;
  y: number;
  room?: number;
  status?: string;
  guests?: number;
  breakerStatus?: string;
  temperature?: string;
}

const S = 1;
const FLOOR_W = 24 * S;
const FLOOR_D = 14 * S;
const FLOOR_H = 2 * S;

function createHotelFloors(scene: Scene): AbstractMesh[] {
  const floors: AbstractMesh[] = [];
  const wallMat = new StandardMaterial("hotel_wall", scene);
  wallMat.diffuseColor = new Color3(0.92, 0.9, 0.88);
  wallMat.specularColor = new Color3(0.25, 0.25, 0.25);

  for (let i = 1; i <= 8; i++) {
    const floor = MeshBuilder.CreateBox(
      `floor_${i}`,
      { width: FLOOR_W, height: FLOOR_H, depth: FLOOR_D },
      scene
    );
    floor.position.y = (i - 0.5) * FLOOR_H;
    floor.material = wallMat;
    floor.isPickable = true;
    floors.push(floor);
  }
  return floors;
}

function createGround(scene: Scene): AbstractMesh {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 80 * S, height: 80 * S },
    scene
  );
  ground.position.y = -0.02;
  const mat = new StandardMaterial("ground_mat", scene);
  mat.diffuseColor = new Color3(0.35, 0.45, 0.3);
  ground.material = mat;
  return ground;
}

function createFloor8Plan(scene: Scene): { root: AbstractMesh; room802: AbstractMesh; cabinet: AbstractMesh } {
  const floorPlane = MeshBuilder.CreateGround(
    "floor8_plane",
    { width: FLOOR_W + 4, height: FLOOR_D + 4 },
    scene
  );
  floorPlane.position.y = 0.02;
  const floorMat = new StandardMaterial("floor8_plane_mat", scene);
  floorMat.diffuseColor = new Color3(0.9, 0.88, 0.85);
  floorPlane.material = floorMat;

  const corridor = MeshBuilder.CreateBox(
    "floor8_corridor",
    { width: 3 * S, height: 0.1 * S, depth: FLOOR_D },
    scene
  );
  corridor.position.set(0, 0.05, 0);
  corridor.material = new StandardMaterial("corridor_mat", scene);
  (corridor.material as StandardMaterial).diffuseColor = new Color3(0.7, 0.7, 0.72);

  const roomW = 4 * S;
  const roomD = 3.5 * S;
  const grayMat = new StandardMaterial("room_gray", scene);
  grayMat.diffuseColor = new Color3(0.65, 0.65, 0.67);
  const greenMat = new StandardMaterial("room_green", scene);
  greenMat.diffuseColor = new Color3(0.35, 0.7, 0.45);

  let room802Mesh: AbstractMesh | null = null;
  for (let side = 0; side < 2; side++) {
    const sign = side === 0 ? 1 : -1;
    for (let r = 0; r < 5; r++) {
      const roomNum = 801 + side * 5 + r;
      const room = MeshBuilder.CreateBox(
        `room_${roomNum}`,
        { width: roomW, height: 0.15 * S, depth: roomD },
        scene
      );
      room.position.set(
        sign * (FLOOR_W / 2 - roomW / 2 - 1),
        0.08,
        -FLOOR_D / 2 + 1.5 + r * (roomD + 0.3)
      );
      room.isPickable = true;
      room.material = roomNum === 802 ? greenMat : grayMat;
      if (roomNum === 802) room802Mesh = room;
    }
  }

  const cabinet = MeshBuilder.CreateBox(
    "cabinet_8",
    { width: 1.5 * S, height: 1.2 * S, depth: 0.8 * S },
    scene
  );
  cabinet.position.set(FLOOR_W / 2 - 1, 0.6, 0);
  cabinet.material = new StandardMaterial("cabinet_mat", scene);
  (cabinet.material as StandardMaterial).diffuseColor = new Color3(0.4, 0.4, 0.45);
  cabinet.isPickable = true;

  const root = floorPlane;
  root.setParent(null);
  return {
    root: floorPlane,
    room802: room802Mesh!,
    cabinet,
  };
}

function createRoom802Interior(scene: Scene): AbstractMesh {
  const roomW = 5 * S;
  const roomD = 4 * S;
  const roomH = 2.8 * S;

  const wallMat = new StandardMaterial("room_wall", scene);
  wallMat.diffuseColor = new Color3(0.95, 0.94, 0.92);

  const floor = MeshBuilder.CreateBox(
    "room802_floor",
    { width: roomW, height: 0.1, depth: roomD },
    scene
  );
  floor.position.y = 0.05;
  floor.material = new StandardMaterial("room_floor", scene);
  (floor.material as StandardMaterial).diffuseColor = new Color3(0.6, 0.55, 0.5);

  const backWall = MeshBuilder.CreateBox(
    "room802_back",
    { width: roomW + 0.2, height: roomH, depth: 0.15 },
    scene
  );
  backWall.position.set(0, roomH / 2, -roomD / 2);
  backWall.material = wallMat;

  const leftWall = MeshBuilder.CreateBox(
    "room802_left",
    { width: 0.15, height: roomH, depth: roomD },
    scene
  );
  leftWall.position.set(-roomW / 2, roomH / 2, 0);
  leftWall.material = wallMat;

  const rightWall = MeshBuilder.CreateBox(
    "room802_right",
    { width: 0.15, height: roomH, depth: roomD },
    scene
  );
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.material = wallMat;

  const bed = MeshBuilder.CreateBox(
    "room802_bed",
    { width: 2 * S, height: 0.5 * S, depth: 1.2 * S },
    scene
  );
  bed.position.set(-1, 0.25, -0.8);
  bed.material = new StandardMaterial("bed", scene);
  (bed.material as StandardMaterial).diffuseColor = new Color3(0.5, 0.4, 0.6);

  const ac = MeshBuilder.CreateBox(
    "room802_ac",
    { width: 1.2 * S, height: 0.3 * S, depth: 0.4 * S },
    scene
  );
  ac.position.set(0, roomH - 0.2, -roomD / 2 + 0.2);
  ac.material = new StandardMaterial("ac", scene);
  (ac.material as StandardMaterial).diffuseColor = new Color3(0.85, 0.85, 0.88);

  const lamp = MeshBuilder.CreateBox(
    "room802_lamp",
    { width: 0.3 * S, height: 0.5 * S, depth: 0.3 * S },
    scene
  );
  lamp.position.set(1.2, 0.25, 0.5);
  lamp.material = new StandardMaterial("lamp", scene);
  (lamp.material as StandardMaterial).diffuseColor = new Color3(0.9, 0.85, 0.5);
  (lamp.material as StandardMaterial).emissiveColor = new Color3(0.15, 0.12, 0.05);

  return floor;
}

export function createStoryboardSceneContent(
  scene: Scene,
  context?: unknown
): void {
  const ctx = context as StoryboardSceneContext | undefined;
  scene.clearColor = new Color4(0.53, 0.81, 0.92, 1);

  const sun = new DirectionalLight(
    "sun",
    new Vector3(-1, -1.2, -0.5),
    scene
  );
  sun.position = new Vector3(20, 25, 20);
  sun.intensity = 1.2;
  sun.diffuse = new Color3(1, 0.98, 0.95);

  const hemi = scene.getLightByName("light1");
  if (hemi) hemi.intensity = 0.5;

  const ground = createGround(scene);
  const hotelFloors = createHotelFloors(scene);
  createFloor8Plan(scene);
  createRoom802Interior(scene);

  const camera = scene.activeCamera as ArcRotateCamera | null;
  if (!camera || !("setTarget" in camera)) return;

  const defaultHotelTarget = new Vector3(0, 8, 0);
  const defaultHotelRadius = 45 * S;
  const defaultHotelAlpha = -Math.PI / 2 + 0.25;
  const defaultHotelBeta = Math.PI / 2.5;

  const explodeOffset = 1.5 * S;
  const floor8Target = new Vector3(0, 0, 0);
  const room802Target = new Vector3(0, 1.5, 0);

  let lastViewMode: ViewMode | null = null;

  scene.onBeforeRenderObservable.add(() => {
    const viewMode = ctx?.getViewMode() ?? "hotel";

    // ตั้งค่ากล้องเฉพาะเมื่อเปลี่ยน viewMode เท่านั้น (ให้ผู้ใช้หมุน/ซูมได้ในมุมเดิม)
    if (viewMode !== lastViewMode) {
      lastViewMode = viewMode;
      if (viewMode === "hotel" || viewMode === "floorExploded") {
        camera.setTarget(defaultHotelTarget);
        camera.radius = defaultHotelRadius;
        camera.alpha = defaultHotelAlpha;
        camera.beta = defaultHotelBeta;
      } else if (viewMode === "floor8") {
        camera.setTarget(floor8Target);
        camera.radius = 28;
        camera.alpha = -Math.PI / 2;
        camera.beta = Math.PI / 2.2;
      } else if (viewMode === "room802") {
        camera.setTarget(room802Target);
        camera.radius = 6;
        camera.alpha = -Math.PI / 2 + 0.4;
        camera.beta = Math.PI / 2.3;
      }
    }

    ground.setEnabled(viewMode === "hotel" || viewMode === "floorExploded");
    hotelFloors.forEach((f, i) => {
      f.setEnabled(viewMode === "hotel" || viewMode === "floorExploded");
      if (viewMode === "floorExploded") {
        f.position.y = (i + 1) * FLOOR_H + i * explodeOffset;
      } else {
        f.position.y = (i + 0.5) * FLOOR_H;
      }
    });

    scene.meshes
      .filter((m) => m.name.startsWith("floor8_") || m.name.startsWith("room_8") || m.name === "cabinet_8")
      .forEach((m) => m.setEnabled(viewMode === "floor8"));

    scene.meshes
      .filter((m) => m.name.startsWith("room802_"))
      .forEach((m) => m.setEnabled(viewMode === "room802"));
  });

  if (!ctx) return;

  scene.onPointerObservable.add((info) => {
    const viewMode = ctx.getViewMode();
    if (info.type === 1) {
      const pick = scene.pick(scene.pointerX, scene.pointerY);
      if (pick?.hit && pick.pickedMesh) {
        const name = pick.pickedMesh.name;
        if (viewMode === "floorExploded" && name === "floor_8") {
          scene.getEngine().getRenderingCanvas()!.style.cursor = "pointer";
        } else if (viewMode === "floor8") {
          if (name === "cabinet_8") {
            ctx.setPopup({
              type: "cabinet",
              x: scene.pointerX,
              y: scene.pointerY,
              breakerStatus: "ทำงานปกติ",
              temperature: "42 °C",
            });
          } else if (name === "room_802") {
            ctx.setPopup({
              type: "room",
              x: scene.pointerX,
              y: scene.pointerY,
              room: 802,
              status: "มีแขกเข้าพัก",
              guests: 2,
            });
          } else {
            ctx.setPopup(null);
          }
        } else {
          ctx.setPopup(null);
        }
        if (viewMode === "floor8" && (name?.startsWith("room_") || name === "cabinet_8")) {
          scene.getEngine().getRenderingCanvas()!.style.cursor = "pointer";
        }
      } else {
        ctx.setPopup(null);
        scene.getEngine().getRenderingCanvas()!.style.cursor = "default";
      }
    }
  });

  scene.onPointerObservable.add((info) => {
    if (info.type !== 2) return;
    const viewMode = ctx.getViewMode();
    const pick = scene.pick(scene.pointerX, scene.pointerY);
    if (!pick?.hit || !pick.pickedMesh) return;
    const name = pick.pickedMesh.name;
    if (viewMode === "floorExploded" && name === "floor_8") {
      ctx.setViewMode("floor8");
    } else if (viewMode === "floor8" && name === "room_802") {
      ctx.setViewMode("room802");
    }
  });
}
