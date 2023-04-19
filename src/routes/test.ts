import { getArticleByDate } from "../storage/models/article.model";
import { Router } from "express";

const router = Router();

router.get("/articles/:date", (req, res) => {
  console.log("test route");
  getArticleByDate("date1").then((data) => {
    res.send(data);
  });
});

export default router;
