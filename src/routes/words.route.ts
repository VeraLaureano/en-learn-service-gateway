import { Router } from "express";
import { getWord, getWords } from "../controllers/words.controller";

const router = Router()

router.route('/').get(getWords)
router.route('/:id').get(getWord)

export { router as wordsRouter }