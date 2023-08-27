import mongoose from "mongoose";
import TagSchemaDef, { Tag, TagDocument } from "../schemas/tag";
import { v4 as uuidv4 } from "uuid";

const TagModel = mongoose.model<TagDocument>("Tag", TagSchemaDef);

export const createTag = (tag: Omit<Tag, "id">) => {
  const randomId = uuidv4();
  const newTag = {
    ...tag,
    id: randomId,
    _id: randomId,
  };

  console.log("before save \n", newTag);
  const newTagDoc = new TagModel(newTag);
  return newTagDoc.save();
};

export const getAllTags = () => {
  return TagModel.find();
};
