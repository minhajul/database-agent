import {AzureOpenAI} from "openai"
import {db} from '../db/index.js'

const client = new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion : process.env.AZURE_API_VERSION,
    deployment: process.env.AZURE_DEPLOYMENT
})

export async function generateData(userPrompt) {
    try {
        const systemPrompt = `
        You are a database assistant.
        Based on the following prompt, generate valid SQL queries for PostgreSQL from user prompts.
        Consider that if verified_at is null, user does not verified their identity for users table.
        If user asked to give total order amount, calculate total_price column value from orders table.
        Only return the SQL query, do not include any explanations or additional text.
        `;

        const prompt = `Generate a SQL query for: "${userPrompt}". Respond only with JSON format like: { "query": "YOUR_SQL_QUERY" }.`

        const aiResponse = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const response = aiResponse.choices[0].message.content;

        const sqlQuery = JSON.parse(response).query;

        const results = await db.execute(sqlQuery);

        return {
            success: true,
            data: results
        };

    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}