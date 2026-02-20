"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Scene3D,
  createStoryboardSceneContent,
  type ViewMode,
  type PopupInfo,
} from "@/components/babylon";

export default function RunPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("hotel");
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const viewModeRef = useRef<ViewMode>(viewMode);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  const sceneContext = {
    getViewMode: useCallback(() => viewModeRef.current, []),
    setViewMode,
    setPopup,
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-900">
      <Scene3D
        className="absolute inset-0"
        createContent={createStoryboardSceneContent}
        sceneContext={sceneContext}
      />

      {/* Left panel */}
      <div className="absolute left-4 top-4 w-72 rounded-xl border border-white/10 bg-black/70 p-4 shadow-xl backdrop-blur">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          โรงแรม
        </h2>
        <p className="mb-3 text-lg font-medium text-white">
          โรงแรมตัวอย่าง MEA Demo
        </p>
        {(viewMode === "hotel" || viewMode === "floorExploded") && (
          <>
            <p className="mb-1 text-xs text-zinc-400">
              ดัชนีความเชื่อถือได้ของระบบไฟฟ้า
            </p>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-700">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: "85%" }}
              />
            </div>
            <p className="text-sm font-medium text-emerald-400">85 / 100 ปกติ</p>
          </>
        )}
        {viewMode === "floor8" && (
          <>
            <p className="mb-1 text-xs text-zinc-400">ภาพรวมชั้น 8</p>
            <p className="mb-1 text-sm text-white">จำนวนผู้ใช้ไฟฟ้า: 12 ห้อง</p>
            <p className="text-xs text-zinc-400">Peak demand เฉพาะชั้น — ดูช่วงใช้ไฟหนัก</p>
          </>
        )}
        {viewMode === "room802" && (
          <>
            <p className="mb-1 text-xs text-zinc-400">ข้อมูลห้องพัก</p>
            <p className="mb-1 text-sm font-medium text-white">ห้อง 802</p>
            <p className="mb-1 text-sm text-zinc-300">ชื่อผู้เข้าพัก: สมชาย ใจดี</p>
            <p className="mb-1 text-sm text-zinc-300">จำนวนผู้เข้าพัก: 2 ท่าน</p>
            <p className="text-xs text-zinc-400">Check-in: 18 ก.พ. 2025 — Check-out: 20 ก.พ. 2025</p>
          </>
        )}
      </div>

      {/* Right panel */}
      <div className="absolute right-4 top-4 w-72 rounded-xl border border-white/10 bg-black/70 p-4 shadow-xl backdrop-blur">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          สถานการณ์ระบบไฟฟ้า
        </h2>
        {(viewMode === "hotel" || viewMode === "floorExploded") && (
          <>
            <p className="mb-2 text-xs text-zinc-400">
              รายงานสถานการณ์การจำหน่ายไฟฟ้า
            </p>
            <div className="mb-3 h-20 rounded-lg bg-zinc-800/80 p-2 flex items-end gap-0.5">
              {[40, 65, 45, 80, 55, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-emerald-500/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-sm text-white">
              ความต้องการไฟสูงสุดของทั้งโรงแรม ณ ปัจจุบัน:{" "}
              <span className="font-semibold text-amber-400">342 kW</span>
            </p>
          </>
        )}
        {viewMode === "floor8" && (
          <p className="text-sm text-zinc-300">
            กราฟ peak demand ชั้น 8 — โหลดตามช่วงเวลา
          </p>
        )}
        {viewMode === "room802" && (
          <>
            <p className="mb-2 text-xs text-zinc-400">รายละเอียดการใช้ไฟรายห้อง</p>
            <div className="mb-2 h-16 rounded bg-zinc-800/80 p-2 flex items-end gap-1">
              {[30, 50, 45, 60, 55].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-blue-500/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-400">สถานการณ์จ่ายไฟในห้อง: ปกติ</p>
            <p className="text-sm text-white">มิเตอร์ห้อง 802: 12.5 kWh (วันนี้)</p>
          </>
        )}
      </div>

      {/* Top bar: view mode button + back */}
      <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-2">
        {(viewMode === "hotel" || viewMode === "floorExploded") && (
          <button
            type="button"
            onClick={() =>
              setViewMode(viewMode === "hotel" ? "floorExploded" : "hotel")
            }
            className="rounded-lg border border-white/20 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
          >
            {viewMode === "hotel"
              ? "มุมมองแยกชั้น"
              : "กลับมุมมองรวม"}
          </button>
        )}
        {(viewMode === "floor8" || viewMode === "room802") && (
          <button
            type="button"
            onClick={() =>
              setViewMode(viewMode === "floor8" ? "floorExploded" : "floor8")
            }
            className="rounded-lg border border-white/20 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
          >
            {viewMode === "room802" ? "กลับไปแผนผังชั้น" : "กลับมุมมองรวม"}
          </button>
        )}
        {viewMode === "room802" && (
          <button
            type="button"
            onClick={() => setViewMode("floorExploded")}
            className="rounded-lg border border-white/20 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
          >
            ซูมออก — ภาพรวมโรงแรม
          </button>
        )}
      </div>

      {/* Popup (hover) */}
      {popup && (
        <div
          className="pointer-events-none fixed z-10 rounded-lg border border-white/20 bg-black/90 px-3 py-2 text-sm text-white shadow-xl backdrop-blur"
          style={{
            left: popup.x + 12,
            top: popup.y + 12,
          }}
        >
          {popup.type === "cabinet" && (
            <>
              <p className="font-medium text-amber-300">ตู้ไฟประจำชั้น 8</p>
              <p className="text-zinc-300">
                Breaker ย่อย: {popup.breakerStatus ?? "—"}
              </p>
              <p className="text-zinc-300">อุณหภูมิภายในตู้: {popup.temperature ?? "—"}</p>
            </>
          )}
          {popup.type === "room" && (
            <>
              <p className="font-medium text-emerald-300">ห้อง {popup.room}</p>
              <p className="text-zinc-300">สถานะ: {popup.status ?? "—"}</p>
              <p className="text-zinc-300">จำนวนผู้พัก: {popup.guests ?? 0} ท่าน</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
