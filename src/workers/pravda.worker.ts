import {
  htmlToData,
  startRequestsForRange,
} from "../controllers/pravda.controller";
import { register } from "ts-node";
import { parentPort, workerData } from "node:worker_threads";

register();

const { from, to } = workerData;
startRequestsForRange(from, to).then((data) => {
  const extractedData = htmlToData(data);
  parentPort.postMessage({ type: "task-complete", data: extractedData });
  return extractedData.length;
});

// Path: src\workers\pravda.worker.ts
