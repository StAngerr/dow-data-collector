import axios from "axios";
import { PRAVDA_NEWS_FEED_URL } from "../../constants";

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
      // TODO:
      .catch((e) => {
        console.log(e);
        return null;
      })
  );
};
