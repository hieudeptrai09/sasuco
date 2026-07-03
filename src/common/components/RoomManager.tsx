"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Room } from "../types/room";
import { createRoom, deleteRoom, listRooms, updateRoom } from "../containers/rooms-service";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

interface RoomFormState {
  id: string | null;
  name: string;
  capacity: string;
}

const EMPTY_FORM: RoomFormState = { id: null, name: "", capacity: "20" };

export function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<RoomFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setRooms(listRooms());
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const capacity = Number.parseInt(form.capacity, 10);
    if (!Number.isFinite(capacity) || capacity < 1) {
      setError("Sức chứa phải là một số dương.");
      return;
    }
    try {
      if (form.id) {
        updateRoom(form.id, { name: form.name, capacity });
      } else {
        createRoom({ name: form.name, capacity });
      }
      setForm(EMPTY_FORM);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu phòng học.");
    }
  }

  function handleEdit(room: Room) {
    setForm({ id: room.id, name: room.name, capacity: String(room.capacity) });
  }

  function handleDelete(room: Room) {
    setError(null);
    if (!window.confirm(`Xóa phòng học "${room.name}"?`)) return;
    try {
      deleteRoom(room.id);
      if (form.id === room.id) {
        setForm(EMPTY_FORM);
      }
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa phòng học.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {form.id ? "Chỉnh sửa phòng học" : "Thêm phòng học"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Tên phòng</label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Sức chứa</label>
            <Input
              type="number"
              min={1}
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
          </div>
          <div className="flex items-end gap-3 sm:col-span-2">
            <Button type="submit">{form.id ? "Lưu thay đổi" : "Thêm phòng học"}</Button>
            {form.id && (
              <Button type="button" variant="secondary" onClick={() => setForm(EMPTY_FORM)}>
                Hủy
              </Button>
            )}
          </div>
        </form>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Danh sách phòng học
        </h2>
        <div className="flex flex-col gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between gap-4 border-b border-black/[.08] pb-4 last:border-none dark:border-white/[.145]"
            >
              <div>
                <h3 className="font-medium text-zinc-950 dark:text-zinc-50">{room.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Sức chứa: {room.capacity}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => handleEdit(room)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDelete(room)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Chưa có phòng học nào.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
