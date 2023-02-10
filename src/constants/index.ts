import * as dotenv from "dotenv";

dotenv.config({ path: "./config/dev.env" });
export const PRAVDA_URL = process.env.PRAVDA_URL;
export const PRAVDA_NEWS_FEED_URL_TODAY = `${PRAVDA_URL}/news`;
export const PRAVDA_NEWS_FEED_URL = `${PRAVDA_URL}/news/:day`;
export const DEFAULT_DATE_FORMAT = "MM-dd-yyyy";
