import  { Request,Response } from "express";
import { analyseErrorWithAI } from "../services/ai.service";

export const GetAIResponse = async (req: Request, res: Response): Promise<void> => {
    try {
     const { error, code } = req.body;  
     const err = error.trim();
     const cod = code.trim();
        
     const result = await analyseErrorWithAI(err, cod);
    res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to analyze error with AI' , err });
    }
}