import cheerio from "cheerio";
import { Article, DataSourcesEnum, ImportanceLevel } from "../../types";
import { DEFAULT_DATE_FORMAT, PRAVDA_URL } from "../../constants";
import Cheerio = cheerio.Cheerio;
import * as fs from "fs";
import { format } from "date-fns";

const ar = [];
const getElementsWithTopArticles = () => {};

export const elementToDataObject = (
  htmlPage: string,
  date: Date = new Date()
) => {
  const $ = cheerio.load(htmlPage, { decodeEntities: false });
  const important = $(".article_news_list.article_news_bold");
  const top = $(".article_news_list.article_news_red");
  const formattedDate = format(date, DEFAULT_DATE_FORMAT);
  const importantObj = extractData(important, 4, formattedDate);
  const topObj = extractData(top, 5, formattedDate);
  const result: Article[] = [...importantObj, ...topObj];

  return 1;
};

export const extractData = (
  el: Cheerio,
  level: ImportanceLevel,
  date: string
): Article[] => {
  const articles: Article[] = [];

  el.each((idx: number, el1: cheerio.Element) => {
    const current = cheerio.load(el1);
    const aRef = current(".article_header a");
    const time = current(".article_time").html();
    const title = aRef.html();
    const url = `${PRAVDA_URL}${aRef.attr("href")}`;
    articles.push({
      id: idx + 1 + "",
      time,
      title,
      url,
      level,
      fullDate: `${date} ${time}`,
      date,
      source: DataSourcesEnum.pravda,
    });
  });
  return articles;
};
