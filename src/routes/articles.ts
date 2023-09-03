import { Router } from "express";
import {
  getArticleByDate,
  removeArticlesForDate,
  updateArticle,
} from "../storage/models/article.model";
import { ArticleDTO } from "../types";
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

router.put("/articles/:id", (req, res) => {
  const article = req.body as ArticleDTO;

  return updateArticle(article).then((article) => res.json(article));
});

export default router;
