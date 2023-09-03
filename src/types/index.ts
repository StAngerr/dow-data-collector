// 5 highest priority
import { ArticleDocument } from "../storage/schemas/article";
import { da } from "date-fns/locale";
import { tagToDTOFormat } from "../utils/tsgs.utils";

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

export type ArticleDTO = Article & { tags: string[] };

export class ArticleCl {
  static fromModelToResponseObj(model: ArticleDocument) {
    const { _id, tags, ...rest } = model.toObject();
    return {
      id: _id.toString(),
      tags: tags.map(tagToDTOFormat),
      ...rest,
    };
  }
}

export interface UrlDate {
  original: Date;
  formatted: string;
}

export enum TaskStatusEnum {
  success = "success",
  inProgress = "in progress",
  failed = "failed",
}

export type TaskStatus = "success" | "in progress" | "failed";
