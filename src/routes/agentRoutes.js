import express from 'express';
import {generateData} from '../agents/aiAgent.js';

const router = express.Router();

/**
 * POST /api/database-agents
 * Processes a prompt to generate SQL data via AI agent.
 */
router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'A valid prompt is required.',
            });
        }

        const results = await generateData(prompt);

        return res.status(200).json({
            status: 'ok',
            data: results
        });
    } catch (error) {
        console.error('Agent Route Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
})

export default router;