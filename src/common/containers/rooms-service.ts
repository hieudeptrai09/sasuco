import type { Room } from "../types/room";
import { STORAGE_KEYS } from "../constants/storage-keys";
import { generateId, readCollection, writeCollection } from "./storage";
import { isRoomAssigned } from "./courses-service";

export type RoomInput = Omit<Room, "id" | "createdAt">;

export function listRooms(): Room[] {
  return readCollection<Room>(STORAGE_KEYS.rooms);
}

export function getRoom(id: string): Room | undefined {
  return listRooms().find((r) => r.id === id);
}

export function createRoom(input: RoomInput): Room {
  const room: Room = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  writeCollection(STORAGE_KEYS.rooms, [...listRooms(), room]);
  return room;
}

export function updateRoom(id: string, patch: Partial<RoomInput>): Room | undefined {
  const rooms = listRooms();
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  const updated = { ...rooms[index], ...patch };
  rooms[index] = updated;
  writeCollection(STORAGE_KEYS.rooms, rooms);
  return updated;
}

export function deleteRoom(id: string): void {
  if (isRoomAssigned(id)) {
    throw new Error(
      "Vui lòng gỡ phòng học này khỏi các khóa học liên quan trước khi xóa."
    );
  }
  writeCollection(
    STORAGE_KEYS.rooms,
    listRooms().filter((r) => r.id !== id)
  );
}
