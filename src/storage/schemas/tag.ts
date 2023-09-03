import { Schema, Document } from "mongoose";

export interface Tag {
  _id: string;
  label: string;
}

export interface TagDocument extends Document {}

const TagSchemaDef = new Schema<Tag>({
  label: {
    type: String,
    unique: true,
  },
});

TagSchemaDef.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v; // Optionally, remove the version field if present
  },
});

export default TagSchemaDef;
