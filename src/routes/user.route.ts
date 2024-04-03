import { Router } from "express";
import { deleteUser, getUser, patchUser, postUserLogin, postUserSignup } from "../controllers/user.controller";

const router = Router();

router.route('/signup').post(postUserSignup);
router.route('/login').post(postUserLogin)
router.route('/').get(getUser).patch(patchUser).delete(deleteUser)

export { router as userRouter }