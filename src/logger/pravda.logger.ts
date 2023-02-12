import { logger } from "./logger";
import { format } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "../constants";
import { UrlDate } from "../types";

export const dataScrapStartLog = (range: UrlDate[]) => {
  logger.info(
    `Data will be scrapped for range: ${range.map((i) => i.formatted)}`
  );
  logger.info(`Maximum time minutes: ${(range.length * 5) / 60}`);
  logger.info(`Estimated time minutes: ${(range.length * 2.5) / 60}`);
};

export const dataScrapIterationLog = (
  idx: number,
  date: Date,
  delayTime: number
) => {
  logger.info(
    `Iteration #${idx + 1} for date ${format(
      date,
      DEFAULT_DATE_FORMAT
    )} request delay ${delayTime}`
  );
};

export const dataScrapFinishLog = () => {
  logger.info("Scrap finished.");
};
