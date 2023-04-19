import { logger } from "./logger";

export const everyRequestLogger = (url: string) => {
  logger.info(`New request: ${url}`);
};

export const rootRequestLogger = () => {
  logger.info(`Root request`);
};
