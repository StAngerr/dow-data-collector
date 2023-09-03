import { Router, Response, Request } from "express";
import { createTag, getAllTags } from "../storage/models/tags.model";
import { Tag } from "../storage/schemas/tag";

const router = Router();

router.post("/tags", (req: Request, resp: Response) => {
  const body = req.body as Omit<Tag, "id">;
  createTag(body)
    .then((data) => resp.json(data))
    .catch((e) => resp.status(409).json(e));
});

router.get("/tags", (req, res) => {
  const { q } = req.query;

  getAllTags(q).then((tags) => res.json(tags));
});

export default router;
