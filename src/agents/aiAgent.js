import {AzureOpenAI} from "openai"
import {db} from '../db/index.js'

const client = new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion : process.env.AZURE_API_VERSION,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT
})

export async function generateData(userPrompt) {

    try {
        const systemPrompt = `
            You are an expert SQL assistant specialized in PostgreSQL.
            
            Your task is to generate syntactically correct and optimized SQL queries based on the user's prompt.
            
            Context:
            - Use PostgreSQL syntax.
            - The database contains a users table where a user is considered unverified if verified_at is NULL.
            - The orders table includes a total_price column that represents the order amount. Use this for any total or sum-related queries.
            - Only return the raw SQL query. Do not include explanations, comments, or additional text.
            
            Always infer the most appropriate and efficient query based on the user's request.
        `;

        const prompt = `Generate a SQL query for: "${userPrompt}". Respond only with JSON format like: { "query": "YOUR_SQL_QUERY" }.`

        const aiResponse = await client.chat.completions.create({
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: prompt}
            ],
            temperature: 0.7,
            response_format: {type: "json_object"}
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