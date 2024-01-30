import { getAllStats, getByDate } from "../storage/models/loss-stats.model";
import { isValidDate } from "../utils/validation.utils";

type YearMonthFormat = `${number}-${number}`;

export const getAllStatsForPeriod = async (
  from: YearMonthFormat,
  to: YearMonthFormat
) => {
  if (!from && !to) {
    const data = await getAllStats();
    return data;
  }

  if (!from || !to || !isValidDate(from) || !isValidDate(to)) {
    throw new Error("Invalid date format in query parameters");
  }

  return getByDate(from, to);
};
