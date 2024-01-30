import { FIN_DAY_URL, FIN_DAY_URL_FORMAT } from "../../constants";
import { format } from "date-fns";
import axios from "axios";

export const readFinPage = (month: string) => {
  const url = FIN_DAY_URL.replace(":day", month);
  console.log("Requesting URL: ", url);
  return axios
    .get<Buffer>(url, {
      responseType: "arraybuffer",
      responseEncoding: "binary",
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
        "Content-Type": "text/html;charset=UTF-8",
      },
    })
    .then((resp) => resp.data as Buffer);
};
