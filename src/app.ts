import express from "express";
import mongoose from "mongoose";
import ArticlesRoutes from "./routes/articles";
import ScrapersRoutes from "./routes/scrapers";
import { getArticleByDate } from "./storage/models/article.model";
import * as dotenv from "dotenv";

dotenv.config({ path: "./config/dev.env" });
const app = express();
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("DB connected");
}

app.get("/", (req, res, next) => {
  console.log("Hello World!");
  next();
});

app.get("/test", (req, res, next) => {
  console.log("test route");
  getArticleByDate("date1").then((data) => {
    res.send(data);
  });
  next();
});

app.use("/data", ArticlesRoutes);

app.use("/scrappers", ScrapersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

export { app };
