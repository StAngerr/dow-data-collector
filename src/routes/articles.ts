import { Router } from "express";
import {
  getArticleByDate,
  removeArticlesForDate,
} from "../storage/models/article.model";
const router = Router();

router.get("/articles/:date", (req, res) => {
  const desiredDate = req.params.date;

  getArticleByDate(desiredDate).then((data) => {
    res.send(data);
  });
});

router.delete("/articles/:date", (req, res) => {
  const desiredDate = req.params.date;

  removeArticlesForDate(desiredDate).then((data) => {
    res.send(data);
  });
});

export default router;
