import { Schema } from "mongoose";
import { LossType } from "../../types/loss-stats";

export interface LossStats {
  id: string;
  date: string;
  type: LossType;
  total: number;
  change: number;
}

export const OriginalDataSchema = new Schema<LossStats>({
  date: String,
  type: String,
  total: Number,
  change: Number,
});

export const LossStatsSchema = new Schema<LossStats>({
  date: String,
  type: String,
  total: Number,
  change: Number,
});
