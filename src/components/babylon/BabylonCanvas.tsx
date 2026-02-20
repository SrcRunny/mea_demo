"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import { Engine as BabylonEngine } from "@babylonjs/core/Engines/engine";
import { Scene as BabylonScene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color4 } from "@babylonjs/core/Maths/math.color";

export type OnSceneReady = (engine: Engine, scene: Scene) => void | (() => void);

export interface BabylonCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  onSceneReady: OnSceneReady;
  antialias?: boolean;
  adaptToDeviceRatio?: boolean;
}

/**
 * Reusable canvas component that initializes Babylon.js engine and scene.
 * Provides a default ArcRotateCamera and HemisphericLight.
 * Callback onSceneReady(engine, scene) can return a cleanup function.
 */
export function BabylonCanvas({
  className,
  style,
  onSceneReady,
  antialias = true,
  adaptToDeviceRatio = true,
}: BabylonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | void>(undefined);

  const onReady = useCallback(
    (engine: Engine, scene: Scene) => {
      cleanupRef.current = onSceneReady(engine, scene);
    },
    [onSceneReady]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new BabylonEngine(canvas, antialias, {
      adaptToDeviceRatio,
      preserveDrawingBuffer: true,
      stencil: true,
    });

    const scene = new BabylonScene(engine);

    // Default camera: ArcRotate around target
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      8,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 50;
    camera.minZ = 0.1;

    // Default light
    new HemisphericLight(
      "light1",
      new Vector3(0, 1, 0),
      scene
    ).intensity = 1;

    scene.clearColor = new Color4(0.06, 0.08, 0.12, 1);

    onReady(engine, scene);

    const resize = () => engine.resize();
    window.addEventListener("resize", resize);

    engine.runRenderLoop(() => scene.render());

    return () => {
      window.removeEventListener("resize", resize);
      if (typeof cleanupRef.current === "function") cleanupRef.current();
      scene.dispose();
      engine.dispose();
    };
  }, [antialias, adaptToDeviceRatio, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
    />
  );
}
