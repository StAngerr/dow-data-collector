import express, { NextFunction } from "express";
import mongoose from "mongoose";
import ArticlesRoutes from "./routes/articles";
import ScrapersRoutes from "./routes/scrapers";
import * as dotenv from "dotenv";
import { logger } from "./logger/logger";
import { everyRequestLogger } from "./logger/generalRoute.logger";

dotenv.config({ path: "./config/dev.env" });
const app = express();
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL, {
    autoIndex: true,
  });
  console.log("DB connected");
}
//every
app.use((req: Request, res: Response, next: NextFunction) => {
  everyRequestLogger(req.url);
  next();
});

// root
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  // rootRequestLogger();
  next();
});
console.log(10 + 10);
app.get("/test", (req, res, next) => {
  console.log("test route");
  // getArticleByDate("date1").then((data) => {
  //   res.send(data);
  // });
  // next();
  res.json({ test: "ok" });
});

app.use("/data", ArticlesRoutes);

app.use("/scrappers", ScrapersRoutes);

app.listen(process.env.PORT, () => {
  logger.info("----App started---");
  console.log(`Example app listening on port ${process.env.PORT}`);
});

export { app };
