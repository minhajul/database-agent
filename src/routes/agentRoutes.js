import express from 'express';
import {generateData} from '../agents/aiAgent.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const results = await generateData(prompt);

        res.status(200).json({
            status: 'ok',
            data: results
        });
    } catch (error) {
        res.status(500).json({
            status: 'error'
        });
    }
})

export default router;