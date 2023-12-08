import { isValidDate } from "../utils/validation.utils";
import { dateToPravdaFormat, toDateRange } from "../utils/date.utils";
import { format, parse } from "date-fns";
import { Document } from "mongoose";
import { DEFAULT_DATE_FORMAT } from "../constants";
import { generateRandomTimeInMS, mapAMap } from "../utils/general.utils";
import { startScrapping } from "../scrappers/pravda/pravda";
import iconv from "iconv-lite";
import { Article, TaskStatusEnum, UrlDate } from "../types";
import { elementToDataObject } from "../scrappers/pravda/pravda-data-processor";
import { v4 as uuidv4 } from "uuid";
import {
  dataScrapFinishLog,
  dataScrapIterationLog,
  dataScrapStartLog,
} from "../logger/pravda.logger";
import { isMainThread, Worker } from "node:worker_threads";
import {
  createScrappingTask,
  updateScrappingTaskStatus,
} from "../storage/models/tasks.model";
import { saveAllArticles } from "../storage/models/article.model";
import {
  emitTaskEnded,
  emitTaskFailed,
  emitTaskStarted,
} from "../socket-handlers/scrapping-tasks";
import {
  ScrappingTask,
  ScrappingTaskDocument,
} from "../storage/schemas/ScrappingTask";

const requestWrapper = (urlKey: string, time): Promise<Buffer> => {
  return new global.Promise(async (res) => {
    await setTimeout(async () => {
      const data = await startScrapping(urlKey);
      res(data);
    }, time);
  });
};

export const createRangeForDates = (from: string, to: string) =>
  toDateRange(
    parse(from, DEFAULT_DATE_FORMAT, new Date()),
    parse(to, DEFAULT_DATE_FORMAT, new Date())
  ).map(
    (item): UrlDate => ({ original: item, formatted: dateToPravdaFormat(item) })
  );
export const startRequestsForRange = async (
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

export const decodeHtml = (htmlBuffer: Buffer, encoding = "utf-8"): string => {
  return iconv.decode(htmlBuffer, encoding);
};

export const htmlToData = (data: Map<Date, Buffer>): Article[] => {
  return Array.from(
    mapAMap(data, ([key, value]: [Date, Buffer]) => [
      key,
      decodeHtml(value, "win1251"),
    ])
  ).reduce(
    (acc: Article[], [date, html]: [Date, string]) =>
      acc.concat(elementToDataObject(html, date)),
    [] as Article[]
  );
};

export const createNewWorker = (from, to) =>
  new Worker("./src/workers/pravda.worker.ts", {
    workerData: {
      from,
      to,
    },
  });

export const errorCb = (e, taskId: string, io) => {
  console.log(`task error ${taskId}`, e);
  emitTaskFailed(io, e);
  updateScrappingTaskStatus(taskId, TaskStatusEnum.failed);
};

export const messageCb = (worker, message, from, to, taskId, io) => {
  if (message.type === "task-complete") {
    worker.terminate();
    emitTaskEnded(io, taskId);
    saveAllArticles(
      message.data,
      createRangeForDates(from, to).map((dateObj) =>
        format(dateObj.original, DEFAULT_DATE_FORMAT)
      )
    ).then(() => updateScrappingTaskStatus(taskId, TaskStatusEnum.success));
  }
};

export const processRunScrapper = async (
  from: string,
  to: string,
  io: WebSocket
) => {
  if (!(isValidDate(from) && isValidDate(to))) {
    // TODO: why here global ?
    return global.Promise.reject("Invalid range");
  }

  if (isMainThread) {
    const taskId = uuidv4();

    emitTaskStarted(io, taskId);

    const worker = createNewWorker(from, to);

    const newTask: Document<ScrappingTask> = await createScrappingTask(
      taskId,
      from,
      to
    );
    // save taskId to db
    worker.on("error", (e) => () => errorCb(e, taskId, io));

    worker.on("message", (message) =>
      messageCb(worker, message, from, to, taskId, io)
    );

    return newTask.toJSON();
  }
};
