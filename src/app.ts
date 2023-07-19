import express, { NextFunction } from "express";
import mongoose from "mongoose";
import ArticlesRoutes from "./routes/articles";
import ScrapersRoutes from "./routes/scrapers";
import * as dotenv from "dotenv";
import { logger } from "./logger/logger";
import { everyRequestLogger } from "./logger/generalRoute.logger";
import * as http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { scrappingTasks } from "./socket-handlers/scrapping-tasks";
dotenv.config({ path: "./config/dev.env" });
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

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

io.on("connection", (socket) => {
  console.log("connection attempt");
  // connectionHandler(socket);
  scrappingTasks(io, socket);
});

// root
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  // rootRequestLogger();
  next();
});

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

server.listen(process.env.PORT, () => {
  logger.info("----App started---");
  console.log(`Example app listening on port ${process.env.PORT}`);
});

export { app };
