import mongoose from "mongoose";
import {
  LossStats,
  LossStatsSchema,
  OriginalDataSchema,
} from "../schemas/loss-stats";

const LossStatsModel = mongoose.model<LossStats>("LossStats", LossStatsSchema);
const OriginalDataModel = mongoose.model<LossStats>(
  "LossStatsRaw",
  OriginalDataSchema
);

export const saveAllStats = async (data: Omit<LossStats, "id">[]) => {
  await removeStatsByDate(data.map((i) => i.date));
  return LossStatsModel.collection.insertMany(data);
};

export const removeStatsByDate = (dates: string[]) => {
  return LossStatsModel.collection
    .deleteMany({ date: { $in: dates } })
    .then((result) => {
      console.log("Stats days removed: ", result.deletedCount);
      return result.deletedCount;
    });
};
