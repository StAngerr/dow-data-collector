import {
  addDays,
  differenceInDays,
  format,
  isEqual,
  isSameDay,
  parse,
} from "date-fns";
import { START_DATE } from "../constants";

export const toDateRange = (start: Date, end: Date) => {
  console.log("start", start);
  console.log("end", end);
  const range = [start];
  let current = start;

  while (!isSameDay(end, current)) {
    current = addDays(current, 1);
    range.push(current);
  }
  return range;
};

export const dateToPravdaFormat = (date: Date) => {
  const PRAVDA_URL_FORMAT = "ddMMyyyy";
  return `date_${format(date, PRAVDA_URL_FORMAT)}`;
};

export const getTotalDaysTillToday = (): number => {
  const startDate: Date = parse(START_DATE, "MM-dd-yyyy", new Date());
  const today: Date = new Date();

  return differenceInDays(today, startDate);
};
