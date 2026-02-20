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
const ROOMS_PER_FLOOR = 8;
const CORRIDOR_W = 2.5 * S;
const ROOM_W = (FLOOR_W - CORRIDOR_W) / 2 / 2;
const ROOM_D = (FLOOR_D - 1.5) / 2;
const WINDOW_W = 1.2 * S;
const WINDOW_H = 1.1 * S;

/** แต่ละชั้นมี 8 ห้อง (ซ้าย 4 ขวา 4) และแต่ละห้องมีหน้าต่างบนผนังด้านนอก */
function createHotelFloors(scene: Scene): AbstractMesh[][] {
  const wallMat = new StandardMaterial("hotel_wall", scene);
  wallMat.diffuseColor = new Color3(0.92, 0.9, 0.88);
  wallMat.specularColor = new Color3(0.25, 0.25, 0.25);

  const windowMat = new StandardMaterial("hotel_window", scene);
  windowMat.diffuseColor = new Color3(0.6, 0.75, 0.95);
  windowMat.emissiveColor = new Color3(0.08, 0.1, 0.15);
  windowMat.alpha = 0.9;

  const floorSlabMat = new StandardMaterial("hotel_slab", scene);
  floorSlabMat.diffuseColor = new Color3(0.88, 0.86, 0.84);
  floorSlabMat.specularColor = new Color3(0.2, 0.2, 0.2);

  const allFloors: AbstractMesh[][] = [];

  for (let floorNum = 1; floorNum <= 8; floorNum++) {
    const floorMeshes: AbstractMesh[] = [];
    const baseY = (floorNum - 0.5) * FLOOR_H;

    const slab = MeshBuilder.CreateBox(
      `floor_${floorNum}`,
      { width: FLOOR_W, height: 0.15 * S, depth: FLOOR_D },
      scene
    );
    slab.position.y = baseY - FLOOR_H / 2 + 0.075;
    slab.material = floorSlabMat;
    slab.isPickable = true;
    floorMeshes.push(slab);

    if (floorNum === 1) {
      createReceptionFloor(scene, floorMeshes, baseY);
    } else {
      createGuestFloors(scene, floorMeshes, floorNum, baseY, wallMat, windowMat);
    }

    allFloors.push(floorMeshes);
  }
  return allFloors;
}

/** ชั้น 1: โถงรับ (Reception / Lobby) — เคาน์เตอร์รับลูกค้า กระจกด้านหน้า โซนล็อบบี้ */
function createReceptionFloor(
  scene: Scene,
  floorMeshes: AbstractMesh[],
  baseY: number
): void {
  const roomHeight = FLOOR_H - 0.2;

  const lobbyWallMat = new StandardMaterial("reception_wall", scene);
  lobbyWallMat.diffuseColor = new Color3(0.94, 0.92, 0.9);
  lobbyWallMat.specularColor = new Color3(0.2, 0.2, 0.2);

  const deskMat = new StandardMaterial("reception_desk", scene);
  deskMat.diffuseColor = new Color3(0.35, 0.32, 0.38);
  deskMat.specularColor = new Color3(0.15, 0.15, 0.2);

  const glassMat = new StandardMaterial("reception_glass", scene);
  glassMat.diffuseColor = new Color3(0.75, 0.85, 0.95);
  glassMat.emissiveColor = new Color3(0.05, 0.08, 0.12);
  glassMat.alpha = 0.75;

  const backWall = MeshBuilder.CreateBox(
    "floor_1_reception_back",
    { width: FLOOR_W - 2, height: roomHeight, depth: 0.2 },
    scene
  );
  backWall.position.set(0, baseY, -FLOOR_D / 2 + 0.5);
  backWall.material = lobbyWallMat;
  floorMeshes.push(backWall);

  const receptionDesk = MeshBuilder.CreateBox(
    "floor_1_reception_desk",
    { width: 10 * S, height: 1.05 * S, depth: 0.7 * S },
    scene
  );
  receptionDesk.position.set(0, baseY - FLOOR_H / 2 + 0.525, FLOOR_D / 2 - 2.5);
  receptionDesk.material = deskMat;
  floorMeshes.push(receptionDesk);

  const glassW = 5 * S;
  const glassH = 1.6 * S;
  const glassThick = 0.04;
  for (let i = -1; i <= 1; i++) {
    const glass = MeshBuilder.CreateBox(
      `floor_1_glass_${i + 2}`,
      { width: i === 0 ? glassW + 1 : glassW, height: glassH, depth: glassThick },
      scene
    );
    glass.position.set(i * (glassW + 0.5), baseY, FLOOR_D / 2 + glassThick / 2);
    glass.material = glassMat;
    floorMeshes.push(glass);
  }

  const pillarMat = new StandardMaterial("reception_pillar", scene);
  pillarMat.diffuseColor = new Color3(0.85, 0.83, 0.8);
  [-FLOOR_W / 2 + 2, FLOOR_W / 2 - 2].forEach((x, i) => {
    const pillar = MeshBuilder.CreateCylinder(
      `floor_1_pillar_${i}`,
      { height: roomHeight, diameter: 0.6 * S },
      scene
    );
    pillar.position.set(x, baseY, 0);
    pillar.material = pillarMat;
    floorMeshes.push(pillar);
  });
}

/** ชั้น 2–8: ห้องพัก 8 ห้องต่อชั้น */
function createGuestFloors(
  scene: Scene,
  floorMeshes: AbstractMesh[],
  floorNum: number,
  baseY: number,
  wallMat: StandardMaterial,
  windowMat: StandardMaterial
): void {
  const roomHeight = FLOOR_H - 0.2;
  const halfW = (FLOOR_W - CORRIDOR_W) / 2;
  const leftCol1 = -FLOOR_W / 2 + halfW / 4;
  const leftCol2 = -FLOOR_W / 2 + (3 * halfW) / 4;
  const rightCol1 = FLOOR_W / 2 - (3 * halfW) / 4;
  const rightCol2 = FLOOR_W / 2 - halfW / 4;
  const row1 = FLOOR_D / 4;
  const row2 = -FLOOR_D / 4;
  const roomPositions: [number, number][] = [
    [leftCol1, row1],
    [leftCol1, row2],
    [leftCol2, row1],
    [leftCol2, row2],
    [rightCol1, row1],
    [rightCol1, row2],
    [rightCol2, row1],
    [rightCol2, row2],
  ];

  const winThick = 0.08;
  const exteriorLeftX = -FLOOR_W / 2 - winThick / 2;
  const exteriorRightX = FLOOR_W / 2 + winThick / 2;

  for (let r = 0; r < ROOMS_PER_FLOOR; r++) {
    const [rx, rz] = roomPositions[r];
    const room = MeshBuilder.CreateBox(
      `floor_${floorNum}_room_${r + 1}`,
      { width: ROOM_W, height: roomHeight, depth: ROOM_D },
      scene
    );
    room.position.set(rx, baseY, rz);
    room.material = wallMat;
    floorMeshes.push(room);

    const isLeft = rx < 0;
    const winX = isLeft ? exteriorLeftX : exteriorRightX;
    const win = MeshBuilder.CreateBox(
      `floor_${floorNum}_room_${r + 1}_window`,
      { width: winThick, height: WINDOW_H, depth: WINDOW_W },
      scene
    );
    win.position.set(winX, baseY, rz);
    win.material = windowMat;
    floorMeshes.push(win);
  }
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
    { width: CORRIDOR_W, height: 0.1 * S, depth: FLOOR_D },
    scene
  );
  corridor.position.set(0, 0.05, 0);
  corridor.material = new StandardMaterial("corridor_mat", scene);
  (corridor.material as StandardMaterial).diffuseColor = new Color3(0.7, 0.7, 0.72);

  const planRoomW = ROOM_W;
  const planRoomD = ROOM_D;
  const grayMat = new StandardMaterial("room_gray", scene);
  grayMat.diffuseColor = new Color3(0.65, 0.65, 0.67);
  const greenMat = new StandardMaterial("room_green", scene);
  greenMat.diffuseColor = new Color3(0.35, 0.7, 0.45);

  const planHalfW = (FLOOR_W - CORRIDOR_W) / 2;
  const planLeft1 = -FLOOR_W / 2 + planHalfW / 4;
  const planLeft2 = -FLOOR_W / 2 + (3 * planHalfW) / 4;
  const planRight1 = FLOOR_W / 2 - (3 * planHalfW) / 4;
  const planRight2 = FLOOR_W / 2 - planHalfW / 4;
  const planRow1 = FLOOR_D / 4;
  const planRow2 = -FLOOR_D / 4;
  const planPositions: [number, number][] = [
    [planLeft1, planRow1],
    [planLeft1, planRow2],
    [planLeft2, planRow1],
    [planLeft2, planRow2],
    [planRight1, planRow1],
    [planRight1, planRow2],
    [planRight2, planRow1],
    [planRight2, planRow2],
  ];
  let room802Mesh: AbstractMesh | null = null;
  for (let r = 0; r < 8; r++) {
    const roomNum = 801 + r;
    const [rx, rz] = planPositions[r];
    const room = MeshBuilder.CreateBox(
      `room_${roomNum}`,
      { width: planRoomW, height: 0.15 * S, depth: planRoomD },
      scene
    );
    room.position.set(rx, 0.08, rz);
    room.isPickable = true;
    room.material = roomNum === 802 ? greenMat : grayMat;
    if (roomNum === 802) room802Mesh = room;
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
    const baseYForFloor = (i: number) => (i + 0.5) * FLOOR_H;
    const explodeYOffset = (i: number) => 0.5 * FLOOR_H + i * explodeOffset;
    hotelFloors.forEach((floorMeshes, i) => {
      const baseY = baseYForFloor(i);
      const offset = viewMode === "floorExploded" ? explodeYOffset(i) : 0;
      floorMeshes.forEach((m) => {
        m.setEnabled(viewMode === "hotel" || viewMode === "floorExploded");
        if (m.name === `floor_${i + 1}`) {
          m.position.y = baseY - FLOOR_H / 2 + 0.075 + offset;
        } else {
          m.position.y = baseY + offset;
        }
      });
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
