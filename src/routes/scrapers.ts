import { Router } from "express";
import { processRunScrapper } from "../controllers/pravda.controller";
import { getALlUniqDates } from "../controllers/scrapper.controller";
import { getTotalDaysTillToday } from "../utils/date.utils";

const router = Router();

router.get("/run", (req, res) => {
  const { from, to } = req.query;
  processRunScrapper(from, to);
  res.json({
    msg: "process started",
  });
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
