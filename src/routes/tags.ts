import { Router, Response, Request } from "express";
import { createTag, getAllTags } from "../storage/models/tags.mode";
import { Tag } from "../storage/schemas/tag";

const router = Router();

router.post("/tags", (req: Request, resp: Response) => {
  const body = req.body as Omit<Tag, "id">;
  createTag(body).then((data) => resp.json(data));
});

router.get("/tags", (req, res) => {
  getAllTags().then((tags) => res.json(tags)));
};

export default router;
