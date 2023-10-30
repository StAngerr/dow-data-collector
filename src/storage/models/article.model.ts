import mongoose from "mongoose";
import {
  ArticleDocument,
  articleSchema,
  tagsTransform,
} from "../schemas/article";
import { Article, ArticleCl, ArticleDTO } from "../../types";
import { InsertManyResult } from "mongodb";

const ArticleModel = mongoose.model<ArticleDocument>("Article", articleSchema);

export const getAllArticles = () => {
  return ArticleModel.find();
};

export const saveAllArticles = (articles: Article[], dates: string[]) => {
  return removeArticlesForDates(dates).then(() =>
    ArticleModel.collection
      .insertMany(articles)
      .then((result: InsertManyResult<ArticleDocument>) => {
        console.log("Articles are saved. total: ", result.insertedCount);
      })
      .catch((err) => console.log(err))
  );
};

export const removeArticlesForDates = (dates: string[]) => {
  return ArticleModel.deleteMany({ date: { $in: dates } }).then((result) => {
    console.log("Articles removed: ", result.deletedCount);
    return result.deletedCount;
  });
};

export const getArticleByDate = (date: string, visibleOnly = false) => {
  return (
    ArticleModel.find()
      // @ts-ignore
      .allByDate(date, visibleOnly)
      .populate("tags")
      .exec()
      .then((articles) =>
        articles.map((article) => ArticleCl.fromModelToResponseObj(article))
      )
  );
};

export const removeArticlesForDate = (date: string) => {
  return removeArticlesForDates([date]);
};

export const getAllUniqDates = () => {
  return ArticleModel.find().distinct("date");
};

export const updateArticle = (article: ArticleDTO) => {
  return ArticleModel.findOneAndUpdate(
    { _id: article.id },
    {
      ...article,
      tags: article.tags.map((id: string) => new mongoose.Types.ObjectId(id)),
    }
  );
};
