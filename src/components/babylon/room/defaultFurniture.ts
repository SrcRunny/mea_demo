import type { FurnitureItem } from "./types";

const S = 1;

/**
 * รายการเฟอร์นิเจอร์ภายในห้อง (แก้ไขที่นี่เพื่อเพิ่ม/ลด/ย้าย/เปลี่ยนสี)
 * position คือจุดกึ่งกลางชิ้น furniture
 */
export const defaultFurniture: FurnitureItem[] = [
  {
    id: "bed",
    size: { width: 2 * S, height: 0.5 * S, depth: 1.2 * S },
    position: { x: -1, y: 0.25, z: -0.8 },
    color: { r: 0.5, g: 0.4, b: 0.6 },
  },
  {
    id: "ac",
    size: { width: 1.2 * S, height: 0.3 * S, depth: 0.4 * S },
    position: { x: 0, y: 2.6, z: -1.8 },
    color: { r: 0.85, g: 0.85, b: 0.88 },
  },
  {
    id: "lamp",
    size: { width: 0.3 * S, height: 0.5 * S, depth: 0.3 * S },
    position: { x: 1.2, y: 0.25, z: 0.5 },
    color: { r: 0.9, g: 0.85, b: 0.5 },
    emissive: { r: 0.15, g: 0.12, b: 0.05 },
  },
  {
    id: "desk",
    size: { width: 1 * S, height: 0.75 * S, depth: 0.6 * S },
    position: { x: 1.2, y: 0.375, z: -0.8 },
    color: { r: 0.4, g: 0.32, b: 0.28 },
  },
];
