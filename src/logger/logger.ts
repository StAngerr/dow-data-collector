import winston, { format } from "winston";
const { combine, timestamp } = format;

export const logger = winston.createLogger({
  format: combine(timestamp(), format.json()),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      dirname: "logs",
      level: "error",
      options: { flags: "w" },
    }),
    new winston.transports.File({
      filename: "combined.log",
      dirname: "logs",
      options: { flags: "w" },
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
