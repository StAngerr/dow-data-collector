import mongoose from "mongoose";
import TagSchemaDef, { Tag, TagDocument } from "../schemas/tag";
import { v4 as uuidv4 } from "uuid";
import { DbGeneral } from "../../constants/db-general";

const TagModel = mongoose.model<TagDocument>("Tag", TagSchemaDef);

export const createTag = (tag: Omit<Tag, "id">) => {
  const newTagDoc = new TagModel(tag);

  return newTagDoc.save().catch((e) => Promise.reject(DbGeneral[e.code]));
};

export const getAllTags = (q?: string) => {
  if (q) {
    return TagModel.find({
      label: {
        $regex: q,
        $options: "i",
      },
    });
  }
  return TagModel.find();
};
