import { MESSAGES } from "../constants/socket.constants";

export const PREFIX = "scrapping-";

export const emitTaskStarted = (io, taskId: string) =>
  io.emit(PREFIX + MESSAGES.task.start, taskId);
export const emitTaskEnded = (io, taskId: string) =>
  io.emit(PREFIX + MESSAGES.task.success, taskId);
export const emitTaskFailed = (io, data) =>
  io.emit(PREFIX + MESSAGES.task.failed, data);
