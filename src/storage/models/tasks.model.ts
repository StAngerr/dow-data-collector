import mongoose, { Document } from "mongoose";
import { ScrappingTask, scrappingTaskSchema } from "../schemas/ScrappingTask";
import { TaskStatusEnum } from "../../types";

const ScrappingTaskModel = mongoose.model("ScrappingTask", scrappingTaskSchema);

export const createScrappingTask = async (
  taskId: string,
  from: string,
  to: string
): Promise<Document<ScrappingTask>> => {
  const task = new ScrappingTaskModel({
    id: taskId,
    from,
    to,
    status: TaskStatusEnum.inProgress,
    startedAt: new Date(),
  });

  // TODO fix issue with ts
  // @ts-ignore
  return task.save();
};

export const getAllTasks = async () => {
  return ScrappingTaskModel.find().exec();
};

export const checkIfTaskRunning = async (): Promise<boolean> => {
  const runningTask = await ScrappingTaskModel.findOne({
    status: TaskStatusEnum.inProgress,
  }).exec();

  return !!runningTask;
};

export const updateScrappingTaskStatus = async (
  taskId: string,
  status: TaskStatusEnum
) => {
  return ScrappingTaskModel.findOneAndUpdate({ id: taskId }, { status }).exec();
};
