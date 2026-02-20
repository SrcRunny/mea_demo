"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Scene3D,
  createStoryboardSceneContent,
  type ViewMode,
  type PopupInfo,
  type SelectedRoom,
} from "@/components/babylon";

export default function RunPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("room");
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [selectedFloor, setSelectedFloor] = useState(8);
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>({ floor: 8, room: 2 });
  const viewModeRef = useRef<ViewMode>(viewMode);
  const selectedFloorRef = useRef(selectedFloor);
  const selectedRoomRef = useRef<SelectedRoom | null>(selectedRoom);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);
  useEffect(() => {
    selectedFloorRef.current = selectedFloor;
  }, [selectedFloor]);
  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  const sceneContext = {
    getViewMode: useCallback(() => viewModeRef.current, []),
    setViewMode,
    setPopup,
    getSelectedFloor: useCallback(() => selectedFloorRef.current, []),
    setSelectedFloor,
    getSelectedRoom: useCallback(() => selectedRoomRef.current, []),
    setSelectedRoom,
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
        {viewMode === "floorPlan" && (
          <>
            <p className="mb-1 text-xs text-zinc-400">ภาพรวมชั้น {selectedFloor}</p>
            <p className="mb-1 text-sm text-white">จำนวนผู้ใช้ไฟฟ้า: 8 ห้อง</p>
            <p className="text-xs text-zinc-400">กดปุ่มด้านล่างเพื่อเข้าดูในห้อง</p>
          </>
        )}
        {viewMode === "room" && selectedRoom && (
          <>
            <p className="mb-1 text-xs text-zinc-400">ข้อมูลห้องพัก</p>
            <p className="mb-1 text-sm font-medium text-white">
              ห้อง {selectedRoom.floor * 100 + selectedRoom.room}
            </p>
            <p className="mb-1 text-sm text-zinc-300">
              ชื่อผู้เข้าพัก: {selectedRoom.floor === 8 && selectedRoom.room === 2 ? "สมชาย ใจดี" : "—"}
            </p>
            <p className="mb-1 text-sm text-zinc-300">
              จำนวนผู้เข้าพัก: {selectedRoom.floor === 8 && selectedRoom.room === 2 ? "2 ท่าน" : "0 ท่าน"}
            </p>
            <p className="text-xs text-zinc-400">
              {selectedRoom.floor === 8 && selectedRoom.room === 2
                ? "Check-in: 18 ก.พ. 2025 — Check-out: 20 ก.พ. 2025"
                : "ห้องว่าง"}
            </p>
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
        {viewMode === "floorPlan" && (
          <p className="text-sm text-zinc-300">
            กราฟ peak demand ชั้น {selectedFloor} — โหลดตามช่วงเวลา
          </p>
        )}
        {viewMode === "room" && selectedRoom && (
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
            <p className="text-sm text-white">
            มิเตอร์ห้อง {selectedRoom.floor * 100 + selectedRoom.room}: 12.5 kWh (วันนี้)
          </p>
          </>
        )}
      </div>

      {/* Top bar: view mode button + back */}
      <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 flex-wrap justify-center gap-2">
        {(viewMode === "hotel" || viewMode === "floorExploded") && (
          <>
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
            {viewMode === "floorExploded" &&
              [2, 3, 4, 5, 6, 7, 8].map((floorNum) => (
                <button
                  key={floorNum}
                  type="button"
                  onClick={() => {
                    setSelectedFloor(floorNum);
                    setViewMode("floorPlan");
                  }}
                  className="rounded-lg border-2 border-emerald-500/80 bg-emerald-600/90 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-emerald-500"
                >
                  แผนผังชั้น {floorNum}
                </button>
              ))}
          </>
        )}
        {(viewMode === "floorPlan" || viewMode === "room") && (
          <button
            type="button"
            onClick={() =>
              setViewMode(viewMode === "floorPlan" ? "floorExploded" : "floorPlan")
            }
            className="rounded-lg border border-white/20 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
          >
            {viewMode === "room" ? "กลับไปแผนผังชั้น" : "กลับมุมมองรวม"}
          </button>
        )}
        {viewMode === "room" && (
          <button
            type="button"
            onClick={() => setViewMode("floorExploded")}
            className="rounded-lg border border-white/20 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
          >
            ซูมออก — ภาพรวมโรงแรม
          </button>
        )}
      </div>

      {/* ปุ่มเข้าห้อง — แสดงเมื่ออยู่ที่แผนผังชั้น (ลอยกลางจอ อยู่บนสุด) */}
      {viewMode === "floorPlan" && (
        <div className="absolute left-1/2 top-20 z-50 w-full max-w-2xl -translate-x-1/2 rounded-2xl border-4 border-amber-400 bg-zinc-900 px-6 py-5 shadow-2xl">
          <p className="mb-4 text-center text-base font-bold text-amber-400">
            🚪 เข้าดูในห้อง — ชั้น {selectedFloor} (กดปุ่มด้านล่าง)
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((roomIndex) => {
              const roomNum = selectedFloor * 100 + roomIndex;
              return (
                <button
                  key={roomNum}
                  type="button"
                  onClick={() => {
                    setSelectedRoom({ floor: selectedFloor, room: roomIndex });
                    setViewMode("room");
                  }}
                  className="min-w-16 rounded-xl bg-amber-500 px-4 py-3 text-base font-bold text-black shadow-lg transition hover:bg-amber-400 hover:scale-105 active:scale-95"
                >
                  ห้อง {roomNum}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
              <p className="font-medium text-amber-300">ตู้ไฟประจำชั้น {popup.cabinetFloor ?? 8}</p>
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
