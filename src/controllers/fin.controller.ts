import { readFinPage } from "../scrappers/fin/fin";
import { parse } from "date-fns";
import cheerio from "cheerio";
import { decodeHtml } from "./pravda.controller";
import * as fs from "fs";
import TagElement = cheerio.TagElement;
import { isNumber } from "../utils/general.utils";
import { UA_TO_US_KEY_LOSS_MAPPING } from "../constants/db-general";
import { formatFinDateKeys } from "../utils/date.utils";
import { saveAllStats } from "../storage/models/loss-stats.model";
import { LossStats } from "../storage/schemas/loss-stats";

export const runFinScrapper = async (date) => {
  const page = await getPage(date);
  const daysElements = parseToHtml(page);
  const data = htmlToData(daysElements);
  const dbData = dataToDbFormat(data);

  return saveToDb(dbData);
};

export const transformToDate = (htmlData: string): LossStats[] => {
  const daysElements = parseToHtml(htmlData);
  const data = htmlToData(daysElements);

  return dataToDbFormat(data);
};

export const saveToDb = (dbData) => {
  return saveAllStats(dbData);
};

export const dataToDbFormat = (data): LossStats[] => {
  return Object.keys(data.mapped)
    .map((dateKey: string) => {
      const dateObj = data.mapped[dateKey];
      const categories = Object.keys(dateObj);
      return categories.map((cat) => ({ date: dateKey, ...dateObj[cat] }));
    })
    .flat();
};

export const getPage = async (date: string): Promise<string> => {
  const rawData = await readFinPage(parse(date, "yyyy-MM-dd", new Date()));
  const decoded = decodeHtml(rawData);

  // TODO remove for testing
  fs.writeFileSync("./fin.html", decoded, { encoding: "utf8", flag: "w" });
  return decoded;
};

export const parseToHtml = (page: string) => {
  const $ = cheerio.load(page);
  return $(".see-also:eq(1) .gold");
};

function extractNumber(str = "") {
  const match = str.match(/\(\+(\d+)\)/);
  if (match) {
    return parseInt(match[1]);
  }
  return 0;
}

export const htmlToData = (data: cheerio.Cheerio) => {
  const originalMap = {};
  const resultMap = {};
  data.each((idx: number, el1: cheerio.Element) => {
    const $ = cheerio.load(el1);
    const date = formatFinDateKeys($(".black:eq(0)").html());
    const innerData = $(".casualties li");

    originalMap[date] = {};
    resultMap[date] = {};

    innerData.each((idx, innerEl) => {
      // @ts-ignore
      const a = cheerio.load(innerEl).text();
      const [label, rest] = a.split("—").map((i) => i.trim());
      const pattern = /\(\+\d+\)/;
      const [total, plus] = rest
        .split(" ")
        .filter((i) => isNumber(parseInt(i)) || pattern.test(i));

      originalMap[date][label] = {
        type: label,
        total: parseInt(total),
        change: extractNumber(plus),
      };

      const convertedLabel = UA_TO_US_KEY_LOSS_MAPPING[label.toLowerCase()];

      resultMap[date][convertedLabel] = {
        type: convertedLabel,
        total: parseInt(total),
        change: extractNumber(plus),
      };
    });
  });

  return {
    original: originalMap,
    mapped: resultMap,
  };
};
