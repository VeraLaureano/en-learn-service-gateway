import { Router } from "express";
import { postUserSignup } from "../controllers/user.controller";

const router = Router();

router.route('/signup')
  .post(postUserSignup);

export { router as userRouter }