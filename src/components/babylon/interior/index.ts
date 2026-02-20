/**
 * Interior assets: โหลดโมเดล GLB หรือสร้าง placeholder (ประตู ชั้นวางของ ฯลฯ)
 * ใช้ใน scene ได้โดย import จากที่นี่
 */
export {
  loadInteriorModel,
  registerGLTFLoader,
  type LoadModelOptions,
} from "./loadModel";
export {
  createDoorPlaceholder,
  createShelfPlaceholder,
  type PlaceAt,
} from "./placeholders";
