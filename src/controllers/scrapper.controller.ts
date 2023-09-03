import { getAllUniqDates } from "../storage/models/article.model";

export const getALlUniqDates = () => {
  return getAllUniqDates().then((data) => {
    return data;
  });
};
