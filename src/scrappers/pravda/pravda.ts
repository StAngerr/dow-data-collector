import axios, { AxiosResponse } from "axios";
import { PRAVDA_NEWS_FEED_URL } from "../../constants";
import iconv from "iconv-lite";
import { elementToDataObject } from "./pravda-data-processor";
import { Promise } from "mongoose";
export const startScrapping = (dayKey: string) => {
  const url = PRAVDA_NEWS_FEED_URL.replace(":day", dayKey);
  console.log("Requesting URL: ", url);
  return (
    axios
      .get<Buffer>(url, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          "Accept-Encoding": "gzip,deflate,compress",
          "Content-Type": "text/html;charset=windows-1251",
        },
      })
      .then((resp) => resp.data as Buffer)
      // .then((resp) => {
      //   const decodedHTML = iconv.decode(resp.data, "win1251");
      //   const date = new Date();
      //   // elementToDataObject(decodedHTML, date);
      //   return Promise.resolve([date]);
      // })
      // TODO:
      .catch((e) => {
        console.log(e);
        return null;
      })
  );
};
