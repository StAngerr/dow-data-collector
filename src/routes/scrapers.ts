import { Router } from "express";
import { processRunScrapper } from "../controllers/pravda.controller";
import { getALlUniqDates } from "../controllers/scrapper.controller";
import { getTotalDaysTillToday } from "../utils/date.utils";
import { checkIfTaskRunning, getAllTasks } from "../storage/models/tasks.model";
import { delayedFinRequest } from "../controllers/fin.controller";

const router = Router();

router.get("/run", async (req, res) => {
  const { from, to } = req.query;
  const hasRunningTask = await checkIfTaskRunning();

  if (hasRunningTask) {
    res.status(409).json({
      msg: "process already running",
    });
    return;
  }

  const io = req.app.get("io");

  processRunScrapper(from, to, io).then((data) => {
    res.status(202).json(data);
  });
});

router.get("/run-fin", (req, res) => {
  const date2022 = [
    "2022-02",
    "2022-03",
    "2022-04",
    "2022-05",
    "2022-06",
    "2022-07",
    "2022-08",
    "2022-09",
    "2022-10",
    "2022-11",
    "2022-12",
  ];
  const date2023 = [
    "2023-01",
    "2023-02",
    "2023-03",
    "2023-04",
    "2023-05",
    "2023-06",
    "2023-07",
    "2023-08",
    "2023-09",
    "2023-10",
    "2023-11",
    "2023-12",
  ];
  // const date2024 = [
  //   "2024-01",
  //   "2024-02",
  //   "2024-03",
  //   "2024-04",
  //   "2024-05",
  //   "2024-06",
  //   "2024-07",
  //   "2024-08",
  //   "2024-09",
  //   "2024-10",
  //   "2024-11",
  //   "2024-12",
  // ];

  for (let date of [...date2022, ...date2023]) {
    delayedFinRequest(date);
  }

  res.send("Fin started");
});

router.get("/tasks", async (req, res) => {
  const tasks = await getAllTasks();
  return res.json(tasks);
});

router.get("/days", (req, res) => {
  getALlUniqDates().then((data) => {
    res.json(data);
  });
});

router.get("/days/stats", (req, res) => {
  getALlUniqDates().then((data) => {
    res.json({
      totalFilledDays: data.length,
      totalDays: getTotalDaysTillToday(),
    });
  });
});

export default router;
