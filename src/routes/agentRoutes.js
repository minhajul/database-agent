import express from 'express';
import {generateData} from '../agents/aiAgent.js';
import {AzureOpenAI} from "openai"

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

router.post('/image', async (req, res) => {
    try {

        const prompt = req.body.prompt;

        const client = new AzureOpenAI({
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            apiVersion : process.env.AZURE_API_VERSION,
            deployment: process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT
        })

        const response = await client.images.generate({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        })

        console.log(response);

        res.status(200).json({
            status: 'ok',
            data: response.data[0].url
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
})

export default router;