import axios from "axios";
import { PRAVDA_NEWS_FEED_URL } from "../../constants";
import iconv from "iconv-lite";
import { elementToDataObject } from "./pravda-data-processor";
export const startScrapping = () => {
  axios
    .get(PRAVDA_NEWS_FEED_URL, {
      responseType: "arraybuffer",
      responseEncoding: "binary",
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
        "Content-Type": "text/html;charset=windows-1251",
      },
    })
    .then((resp) => {
      const decodedHTML = iconv.decode(resp.data, "win1251");
      const date = new Date();
      elementToDataObject(decodedHTML, date);
    })
    .catch((e) => {
      console.log(e);
    });
};
