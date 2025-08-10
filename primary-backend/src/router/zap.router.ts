import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { getZap, zapCreator, zapsGetter } from "../controllers/zap.controller";

const router = Router();


router.post('/',authMiddleWare,zapCreator)
router.get('/',authMiddleWare,zapsGetter)
router.get('/:zapId',authMiddleWare,getZap)


export const zapRouter = router;