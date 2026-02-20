"use client";

import { useCallback } from "react";
import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import { BabylonCanvas } from "./BabylonCanvas";
import { createDefaultSceneContent } from "./defaultSceneContent";

export interface Scene3DProps {
  className?: string;
  style?: React.CSSProperties;
  /** Custom scene content. Default: torus knot + ground. */
  createContent?: (scene: Scene, context?: unknown) => void;
  /** Optional context passed to createContent (e.g. viewMode, setViewMode for interactive scenes). */
  sceneContext?: unknown;
}

/**
 * Ready-to-use 3D scene component. Uses BabylonCanvas with default content.
 * Override createContent to use your own scene content.
 */
export function Scene3D({
  className,
  style,
  createContent = createDefaultSceneContent,
  sceneContext,
}: Scene3DProps) {
  const onSceneReady = useCallback(
    (_engine: Engine, scene: Scene, ctx?: unknown) => createContent(scene, ctx),
    [createContent]
  );

  return (
    <BabylonCanvas
      className={className}
      style={style}
      onSceneReady={onSceneReady}
      sceneContext={sceneContext}
    />
  );
}
