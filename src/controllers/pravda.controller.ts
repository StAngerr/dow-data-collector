import { isValidDate } from "../utils/validation.utils";
import { dateToPravdaFormat, toDateRange } from "../utils/date.utils";
import { format, parse } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "../constants";
import { generateRandomTimeInMS, mapAMap } from "../utils/general.utils";
import { startScrapping } from "../scrappers/pravda/pravda";
import iconv from "iconv-lite";
import { Article, UrlDate } from "../types";
import { elementToDataObject } from "../scrappers/pravda/pravda-data-processor";
import { saveAllArticles } from "../storage/models/article.model";
import {
  dataScrapFinishLog,
  dataScrapIterationLog,
  dataScrapStartLog,
} from "../logger/pravda.logger";

const requestWrapper = (urlKey: string, time): Promise<Buffer> => {
  return new global.Promise(async (res) => {
    await setTimeout(async () => {
      const data = await startScrapping(urlKey);
      res(data);
    }, time);
  });
};

const createRangeForDates = (from: string, to: string) =>
  toDateRange(
    parse(from, DEFAULT_DATE_FORMAT, new Date()),
    parse(to, DEFAULT_DATE_FORMAT, new Date())
  ).map(
    (item): UrlDate => ({ original: item, formatted: dateToPravdaFormat(item) })
  );
const startRequestsForRange = async (
  from: string,
  to: string
): Promise<Map<Date, Buffer>> => {
  const range = createRangeForDates(from, to);
  const result: Map<Date, Buffer> = new Map();

  dataScrapStartLog(range);
  let i = 0;

  for (const urlDate of range) {
    const requestDelay = generateRandomTimeInMS(5, 1);

    dataScrapIterationLog(i, urlDate.original, requestDelay);

    const data = await requestWrapper(
      urlDate.formatted,
      generateRandomTimeInMS(5, 1)
    );
    result.set(urlDate.original, data);
    i++;
  }
  dataScrapFinishLog();
  return result;
};

const decodeHtml = (htmlBuffer: Buffer): string => {
  return iconv.decode(htmlBuffer, "win1251");
};

const htmlToData = (data: Map<Date, Buffer>): Article[] => {
  return Array.from(
    mapAMap(data, ([key, value]: [Date, Buffer]) => [key, decodeHtml(value)])
  ).reduce(
    (acc: Article[], [date, html]: [Date, string]) =>
      acc.concat(elementToDataObject(html, date)),
    [] as Article[]
  );
};

export const processRunScrapper = (
  from: string,
  to: string
): Promise<number> => {
  if (!(isValidDate(from) && isValidDate(to))) {
    return global.Promise.reject("Invalid range");
  }
  return startRequestsForRange(from, to).then((data) => {
    const extractedData = htmlToData(data);
    return saveAllArticles(
      extractedData,
      createRangeForDates(from, to).map((dateObj) =>
        format(dateObj.original, DEFAULT_DATE_FORMAT)
      )
    ).then(() => extractedData.length);
  });
};
