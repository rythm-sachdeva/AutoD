import { Router } from "express";
import { signUp,signin } from "../controllers/user.controller";

const router = Router();

router.post("/signup",signUp)
router.get("/signin",signin)


export const userRouter = router;