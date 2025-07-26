
import { Router } from "express";
import { availiableActions } from "../controllers/action.controller";

const router = Router();

router.get('/availiable', availiableActions);


export const actionRouter = router;
