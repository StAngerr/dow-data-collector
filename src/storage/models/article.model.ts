import mongoose from "mongoose";
import { ArticleDocument, articleSchema } from "../schemas/article";
import { Article, ArticleCl } from "../../types";
import { InsertManyResult } from "mongodb";

const ArticleModel = mongoose.model<ArticleDocument>("Article", articleSchema);

export const saveArticle = (article: Article) => {
  const newArticle = new ArticleModel(article);

  return newArticle.save();
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

export const saveBatchOfArticles = (articles: Article[]) => {
  return ArticleModel.insertMany(articles);
};

export const removeArticlesForDates = (dates: string[]) => {
  console.log("Removing articles for dates: ", dates);
  return ArticleModel.deleteMany({ date: { $in: dates } }).then((result) => {
    console.log("Articles removed: ", result.deletedCount);
    return result.deletedCount;
  });
};

export const getArticleByDate = (date: string) => {
  return (
    ArticleModel.find()
      // @ts-ignore
      .allByDate(date)
      .exec()
      .then((articles) =>
        articles.map((article) => ArticleCl.fromModelToResponseObj(article))
      )
  );
};

export const removeArticlesForDate = (date: string) => {
  return removeArticlesForDates([date]);
};
