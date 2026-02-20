import type { Scene } from "@babylonjs/core/scene";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";

/**
 * Adds a reusable default 3D scene: torus knot + ground with PBR-style materials.
 * Call from onSceneReady: createDefaultSceneContent(scene)
 */
export function createDefaultSceneContent(scene: Scene, _context?: unknown): void {
  const knot = MeshBuilder.CreateTorusKnot("knot", {
    radius: 0.8,
    tube: 0.25,
    radialSegments: 128,
    tubularSegments: 64,
    p: 2,
    q: 3,
  }, scene);
  knot.position.y = 1.2;

  const knotMat = new PBRMaterial("knotMat", scene);
  knotMat.albedoColor = new Color3(0.95, 0.4, 0.1);
  knotMat.metallic = 0.85;
  knotMat.roughness = 0.2;
  knotMat.environmentIntensity = 1;
  knot.material = knotMat;

  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );
  ground.position.y = -0.01;

  const groundMat = new StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new Color3(0.15, 0.18, 0.22);
  groundMat.specularColor = new Color3(0.1, 0.1, 0.12);
  ground.material = groundMat;

  // Optional: subtle rotation animation
  scene.onBeforeRenderObservable.add(() => {
    knot.rotation.y += 0.004;
  });
}
