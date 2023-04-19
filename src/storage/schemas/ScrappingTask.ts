import { TaskStatusEnum } from "../../types";
import { Schema } from "mongoose";

export interface ScrappingTask {
  id: string;
  from: string;
  to: string;
  status: TaskStatusEnum;
  startedAt: Date;
}

export interface ScrappingTaskDocument extends ScrappingTask, Document {}

export const scrappingTaskSchema = new Schema<ScrappingTask>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  from: String,
  to: String,
  status: {
    type: String,
    enum: TaskStatusEnum,
  },
  startedAt: Date,
});
