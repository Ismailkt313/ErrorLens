import { Router } from "express";
import { GetAIResponse } from "../controllers/controller";

const router = Router();

router.post('/api/analyze', GetAIResponse);

export default router;
