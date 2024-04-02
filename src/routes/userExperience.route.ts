import { Router } from "express";
import { deleteExperience, getExperience, patchExperience, postExperience } from "../controllers/experience.controller";

const router = Router();

router.route('/')
  .get(getExperience)
  .post(postExperience)
  .patch(patchExperience)
  .delete(deleteExperience)

export { router as experienceRouter }
