import { Router } from "express";
import { processRunScrapper } from "../controllers/pravda.controller";
import { getALlUniqDates } from "../controllers/scrapper.controller";
import { getTotalDaysTillToday } from "../utils/date.utils";
import { checkIfTaskRunning, getAllTasks } from "../storage/models/tasks.model";

const router = Router();

router.get("/run", async (req, res) => {
  const { from, to } = req.query;
  const hasRunningTask = await checkIfTaskRunning();
  if (!hasRunningTask) {
    res.status(409).json({
      msg: "process already running",
    });
  }
  processRunScrapper(from, to);
  res.status(202).json({
    msg: "process started",
  });
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
