import { Router } from "express";
import { signUp,signin, userDetails } from "../controllers/user.controller";
import { authMiddleWare } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup",signUp)
router.get("/signin",signin)
router.get("/",authMiddleWare,userDetails)


export const userRouter = router;