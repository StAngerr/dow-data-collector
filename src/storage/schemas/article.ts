import { DataSourcesEnum, ImportanceLevel } from "../../types";
import mongoose, { Schema, Document } from "mongoose";
import { Tag } from "./tag";

interface Article {
  title: string;
  url: string;
  fullDate?: string;
  time: string;
  date: string;
  level: ImportanceLevel;
  source: DataSourcesEnum;
  tags: Tag[];
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
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    query: {
      allByDate(date: string) {
        return this.where("date").equals(date);
      },
    },
  }
);

articleSchemaDef.index({ date: 1 });

export const tagsTransform = (doc, ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

articleSchemaDef.set("toJSON", {
  transform: tagsTransform,
});

export const articleSchema = articleSchemaDef;
