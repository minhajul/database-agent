import express from 'express';
import {z} from "zod";
import {generateData} from '../agents/aiAgent.js';

const router = express.Router();

const promptSchema = z.object({
    prompt: z.string().min(1, "A valid prompt is required."),
});

/**
 * POST /api/database-agents
 * Processes a prompt to generate SQL data via AI agent.
 */
router.post('/', async (req, res) => {
    try {
        const {prompt} = promptSchema.parse(req.body);

        const results = await generateData(prompt);

        return res.status(200).json({
            status: 'ok',
            data: results
        });
    } catch (error) {
        console.error('Agent Route Error:', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: 'error',
                message: error.errors?.[0]?.message || 'Invalid input.',
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
})

export default router;