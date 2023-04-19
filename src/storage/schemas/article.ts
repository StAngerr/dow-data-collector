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

const articleSchemaDef = new Schema<Article>(
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
    virtuals: {
      id: {
        get() {
          return this._id;
        },
      },
    },
  }
);

articleSchemaDef.index({ date: 1 });

export const articleSchema = articleSchemaDef;
