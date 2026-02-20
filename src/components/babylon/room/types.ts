/**
 * ตัวเลือกสำหรับสร้างห้องและเฟอร์นิเจอร์
 * แก้ไขขนาดห้อง / เพิ่ม-ลด-ย้าย furniture ได้ที่ roomInterior.ts
 */
export interface RoomInteriorOptions {
  /** prefix ชื่อ mesh เช่น "room802" → room802_floor, room802_bed */
  meshPrefix?: string;
  /** ความกว้างห้อง (แนว X) */
  roomWidth?: number;
  /** ความลึกห้อง (แนว Z) */
  roomDepth?: number;
  /** ความสูงห้อง */
  roomHeight?: number;
  /** รายการเฟอร์นิเจอร์ (ไม่ส่งจะใช้ defaultFurniture) */
  furniture?: FurnitureItem[];
}

/** รายการเฟอร์นิเจอร์ชิ้นหนึ่ง — แก้ตำแหน่ง/ขนาด/สีได้ใน defaultFurniture */
export interface FurnitureItem {
  id: string;
  size: { width: number; height: number; depth: number };
  position: { x: number; y: number; z: number };
  color: { r: number; g: number; b: number };
  /** สีเรือง (ถ้ามี เช่น โคม) */
  emissive?: { r: number; g: number; b: number };
}
