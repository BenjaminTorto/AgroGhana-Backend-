import './env.js';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import pingRouter from './routes/ping.js';
import advisoryRouter from './routes/advisory.js';
import soilHealthRouter from './routes/soilHealth.js';
import voiceRouter from './routes/voice.js';
import marketplaceRouter from './routes/marketplace.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/ping', pingRouter);
app.use('/api/advisory', advisoryRouter);
app.use('/api/soil', soilHealthRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/marketplace', marketplaceRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: '🌱 AgroGhana API is running!',
    version: '1.0.0'
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('─────────────────────────────────────');
  console.log('🌱 AGRO-GHANA BACKEND IS STARTING...');
  console.log('─────────────────────────────────────');
  console.log(`✅ Server running on port ${PORT}`);
});
