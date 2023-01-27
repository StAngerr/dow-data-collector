import { DataSourcesEnum, ImportanceLevel } from "../../types";
import { Schema, Document } from "mongoose";

interface Article {
  title: string;
  url: string;
  fullDate?: string;
  time: string;
  date: string;
  level: ImportanceLevel;
  source: DataSourcesEnum;
}

export interface ArticleDocument extends Article, Document {}

export const articleSchema = new Schema<Article>(
  {
    title: String,
    url: String,
    fullDate: String,
    time: String,
    date: String,
    level: Number,
    source: {
      type: String,
      enum: DataSourcesEnum,
    },
  },
  {
    query: {
      allByDate(date: string) {
        return this.where("date").equals(date);
      },
    },
  }
);
