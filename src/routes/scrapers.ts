import { Router } from "express";
import { isValidDate } from "../utils/validation.utils";
import { toDateRange } from "../utils/date.utils";
import { parse } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "../constants";

const router = Router();

router.get('/run', (req, res) => {
  const {from, to} = req.query;
  console.log(from, to)
  if (isValidDate(from), isValidDate(to)) {
    console.log(toDateRange(parse(from, DEFAULT_DATE_FORMAT, new Date()), parse(to, DEFAULT_DATE_FORMAT, new Date())))
  }
  res.send();
})

export default router;
