import { Router } from "express";
import { availableTriggers } from "../controllers/trigger.controller";

const router = Router();

router.get('/availiable',availableTriggers);

export const triggerRouter = router;

