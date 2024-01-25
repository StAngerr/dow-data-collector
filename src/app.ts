import express, { NextFunction } from "express";
import mongoose from "mongoose";
import ArticlesRoutes from "./routes/articles";
import TagsRoutes from "./routes/tags";
import ScrapersRoutes from "./routes/scrapers";
import * as dotenv from "dotenv";
import { logger } from "./logger/logger";
import { everyRequestLogger } from "./logger/generalRoute.logger";
import * as http from "http";
import cors from "cors";
import socketIOInit from "./socket-handlers";
import bodyParser from "body-parser";

dotenv.config({ path: "./config/dev.env" });
const app = express();


const server = http.createServer(app);
const io = socketIOInit(server);

// TODO: figureout how this can be fixed. Issue that localhost cant relolve SSL sertificate
// Ignore SSL certificate validation (for debugging purposes)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.set("io", io);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

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

app.get("/test", (req, res, next) => {

  // fetch('https://www.pravda.com.ua/news/date_11012024').then((resp) => {
  //   resp.text().then((data) => res.send(data))
  // }).catch((e) => res.json(e))
  // res.json({ test: "ok" });
});




app.use("/data", ArticlesRoutes);
app.use("/data", TagsRoutes);

app.use("/scrappers", ScrapersRoutes);

server.listen(process.env.PORT, () => {
  logger.info("----App started---");
  console.log(`Example app listening on port ${process.env.PORT}`);
});

export { app };
