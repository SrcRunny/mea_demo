# แหล่งหา 3D Models สำหรับ Interior (ประตู ชั้นวางของ เฟอร์นิเจอร์)

ใช้กับ Babylon.js ได้ดีถ้าเลือก **GLB หรือ GLTF** (รองรับโดย `@babylonjs/loaders`)

---

## แนะนำ: โหลดฟรี + ใช้ในโปรเจกต์ได้

| แหล่ง | รูปแบบ | หมายเหตุ |
|--------|--------|----------|
| **[Poly Pizza](https://poly.pizza)** | GLB, FBX | **Quaternius – Ultimate House Interior Pack** มีประตู หน้าต่าง เฟอร์นิเจอร์ 80+ ชิ้น, ฟรี CC0 |
| **[Sketchfab](https://sketchfab.com)** | ดาวน์โหลดเป็น GLTF | กรอง "Downloadable" + "Free" แล้วเลือก GLB/GLTF |
| **[Kenney](https://kenney.nl/assets)** | หลายฟอร์แมต | ชุด Furniture, Office, Kitchen ฟรี ไม่มีลิขสิทธิ์ |
| **[OpenGameArt](https://opengameart.org)** | OBJ, FBX, Blend | ค้น "furniture", "door" แล้วแปลงเป็น GLB ด้วย Blender ได้ |
| **[Free3D](https://free3d.com)** | OBJ, FBX, Blend | มีประตู เฟอร์นิเจอร์ ต้องเช็ค license แต่ละชิ้น |

---

## ถ้าจะใช้ Blender แปลงเป็น GLB

- โหลดจาก **BlenderKit** (ฟรีมีให้) หรือที่อื่น แล้ว export เป็น **glTF 2.0 (.glb)**  
- ใส่ไฟล์ในโปรเจกต์ที่โฟลเดอร์ `public/models/` แล้วใช้ฟังก์ชัน `loadModel()` ในโค้ด

---

## โฟลเดอร์ในโปรเจกต์

- **`public/models/`** – เก็บไฟล์ .glb / .gltf (ประตู, ชั้นวางของ, โต๊ะ ฯลฯ)  
- **`src/components/babylon/interior/`** – ฟังก์ชัน/component ที่โหลดและวางโมเดลใน scene (แยกตามประเภท เช่น ประตู, เฟอร์นิเจอร์)

---

## โครง component ที่แยกไว้ให้

```
src/components/babylon/
├── interior/
│   ├── index.ts          ← export ทั้งหมด (โหลดโมเดล + placeholder)
│   ├── loadModel.ts      ← โหลดไฟล์ .glb/.gltf จาก URL
│   └── placeholders.ts   ← สร้างประตู/ชั้นวางของแบบกล่อง (ไม่ต้องมีไฟล์)
public/models/            ← ใส่ไฟล์ .glb ตรงนี้ เช่น doors/door-01.glb
```

- **ใช้โมเดลจากไฟล์**: เรียก `loadInteriorModel(scene, "/models/.../file.glb", options)` ใน `createContent` หรือ `onSceneReady`
- **ใช้ placeholder (ไม่มีไฟล์)**: เรียก `createDoorPlaceholder(scene, "door1", { x, y, z })` หรือ `createShelfPlaceholder(...)` จาก `@/components/babylon/interior`

---

## ตัวอย่างการใช้งานในโค้ด

**โหลดโมเดล GLB (ประตู / เฟอร์นิเจอร์):**
```ts
import { loadInteriorModel } from "@/components/babylon/interior";

// ใน createContent(scene) หรือ onSceneReady (async ได้):
await loadInteriorModel(scene, "/models/doors/door-01.glb", {
  position: { x: 0, y: 1, z: 5 },
  scaling: 1,
  name: "room_door_802",
});
```

**ใช้ placeholder (ไม่ต้องมีไฟล์):**
```ts
import { createDoorPlaceholder, createShelfPlaceholder } from "@/components/babylon/interior";

createDoorPlaceholder(scene, "door_802", { x: 2, y: 1, z: 3 }, 1, 2.2, 0.06);
createShelfPlaceholder(scene, "shelf_802", { x: -1.5, y: 0.5, z: 2 }, 1.2, 0.4, 4);
```

ดาวน์โหลดโมเดล → ใส่ใน `public/models/` → เรียก `loadInteriorModel()` ตาม path ที่ตั้งไว้
