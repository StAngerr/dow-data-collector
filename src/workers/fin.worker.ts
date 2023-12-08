import { register } from "ts-node";
import { parentPort, workerData } from "node:worker_threads";
import { transformToDate } from "../controllers/fin.controller";

register();

const { from, to } = workerData;

startRequestsForRange(from, to).then((data) => {
  const extractedData = transformToDate(data);
  parentPort.postMessage({ type: "task-complete", data: extractedData });
  return extractedData.length;
});
