import {email, z} from "zod";
import { availableTriggers } from "../controllers/trigger.controller";
import { availiableActions } from "../controllers/action.controller";

export const UserSchema = z.object({
    username: z.string().min(5),
    password : z.string().min(8,{message: "Password must be at least 8 characters long"}),
    email : z.email()
});

export const SigninSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availiableActionId:z.string(),
        actionMetaData: z.any().optional()
    }))
})