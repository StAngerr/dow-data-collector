import { Router } from "express";
import { getAllStatsForPeriod } from "../controllers/lost-stats.controller";
const router = Router();

router.get("/loss-stats", async (req, res) => {
  const { from, to } = req.query;

  return getAllStatsForPeriod(from, to)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => res.status(400).send(e));
});

export default router;
