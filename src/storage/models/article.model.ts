import mongoose from "mongoose";
import { ArticleDocument, articleSchema } from "../schemas/article";
import { Article } from "../../types";

const ArticleModel = mongoose.model<ArticleDocument>("Article", articleSchema);

export const saveArticle = (article: Article) => {
  const newArticle = new ArticleModel(article);

  return newArticle.save();
};

export const saveBatchOfArticles = (articles: Article[]) => {
  return ArticleModel.insertMany(articles);
};

export const getArticleByDate = (date: string) => {
  // @ts-ignore
  return ArticleModel.find().allByDate(date).exec();
};
