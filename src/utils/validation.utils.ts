import { isMatch } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "../constants";

export const isValidDate = (date: string) => {
  return isMatch(date, DEFAULT_DATE_FORMAT)
}
