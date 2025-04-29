import cluster from 'cluster';
import os from 'os';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimiter from './middlewares/rateLimiter.js';
import agentRoutes from './routes/agentRoutes.js';

dotenv.config();

const numCPUs = os.cpus().length;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rateLimiter.rateLimiterMiddleware);
app.enable('trust proxy');

// Routes
app.get('/health', (req, res) => res.status(200).send('OK'));
app.use('/api/database-agents', agentRoutes);

// Global Error Handler (Prevents Server Crash)
app.use((err, req, res, next) => {
    console.error("Unexpected Error:", err);
    res.status(500).json({error: "Internal Server Error"});
});

if (cluster.isPrimary) {
    console.log(`Primary process running on PID: ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Backend server is running on port ${PORT}, PID: ${process.pid}`);
    });
}
