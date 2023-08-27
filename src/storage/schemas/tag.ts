import { Schema, Document } from "mongoose";

export interface Tag {
  id: string;
  label: string;
}

export interface TagDocument extends Document {}

const TagSchemaDef = new Schema<Tag>(
  {
    // @ts-ignore
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    label: String,
  },
  {
    _id: false,
    id: true,
  }
);

TagSchemaDef.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v; // Optionally, remove the version field if present
  },
});

export default TagSchemaDef;
