import { app } from "../app";
import fs from "fs";
import { Router } from "express";
import { getArticleByDate } from "../storage/models/article.model";
const router = Router();

router.get("/articles/:date", (req, res) => {
  const desiredDate = req.params.date;

  getArticleByDate(desiredDate).then((data) => {
    res.send(data);
  });
});

export default router;
