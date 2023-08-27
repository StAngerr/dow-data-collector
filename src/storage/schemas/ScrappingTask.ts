import { TaskStatusEnum } from "../../types";
import { Schema, Document } from "mongoose";

export interface ScrappingTask {
  id: string;
  from: string;
  to: string;
  status: TaskStatusEnum;
  startedAt: Date;
}

export interface ScrappingTaskDocument extends Document<ScrappingTask> {}

const scrappingTaskSchema = new Schema<ScrappingTask>({
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
// TODO find way to get rid of mongo props in objects
scrappingTaskSchema.set("strict", "throw");

export { scrappingTaskSchema };
