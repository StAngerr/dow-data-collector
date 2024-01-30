import mongoose from "mongoose";
import {
  LossStats,
  LossStatsSchema,
  OriginalDataSchema,
} from "../schemas/loss-stats";
import { parse } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "../../constants";

const LossStatsModel = mongoose.model<LossStats>("LossStats", LossStatsSchema);
const OriginalDataModel = mongoose.model<LossStats>(
  "LossStatsRaw",
  OriginalDataSchema
);

export const getAllStats = () => {
  return LossStatsModel.find().exec();
};

export const getByDate = async (from: string, to: string) => {
  const fromDate: Date = parse(from, DEFAULT_DATE_FORMAT, new Date());
  const toDate: Date = parse(to, DEFAULT_DATE_FORMAT, new Date());

  return LossStatsModel.find({
    date: {
      $gte: fromDate,
      $lte: toDate,
    },
  }).exec();
};

export const saveAllStats = async (data: Omit<LossStats, "id">[]) => {
  await removeStatsByDate(data.map((i) => i.date));
  return LossStatsModel.collection.insertMany(data);
};

export const removeStatsByDate = (dates: Date[]) => {
  return LossStatsModel.collection
    .deleteMany({
      date: { $in: dates },
    })
    .then((result) => {
      console.log("Stats days removed: ", result.deletedCount);
      return result.deletedCount;
    });
};
