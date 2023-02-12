import { Router } from "express";
import { isValidDate } from "../utils/validation.utils";
import { dateToPravdaFormat, toDateRange } from "../utils/date.utils";
import { format, parse } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "../constants";
import { startScrapping } from "../scrappers/pravda/pravda";
import { generateRandomTimeInMS } from "../utils/general.utils";
import { processRunScrapper } from "../controllers/pravda.controller";

const router = Router();

router.get("/run", (req, res) => {
  const { from, to } = req.query;
  processRunScrapper(from, to);
  res.json({
    msg: "process started",
  });
});

export default router;
