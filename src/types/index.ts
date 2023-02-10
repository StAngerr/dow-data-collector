// 5 highest priority
import { ArticleDocument } from "../storage/schemas/article";
import { da } from "date-fns/locale";

export type ImportanceLevel = 1 | 2 | 3 | 4 | 5;

export enum DataSourcesEnum {
  pravda = "pravda",
}

export interface Article {
  id?: string;
  title: string;
  url: string;
  fullDate?: string; // MM-DD-YYYY HH:mm
  time: string;
  date: string; // MM-DD-YYYY
  level: ImportanceLevel;
  source: DataSourcesEnum;
}

export class ArticleCl {
  static fromModelToResponseObj(model: ArticleDocument) {
    const { _id, ...rest } = model.toObject();
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}

export interface UrlDate {
  original: Date;
  formatted: string;
}
