import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: '🌱 AgroGhana API is running!',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log('─────────────────────────────────────');
  console.log('🌱 AGRO-GHANA BACKEND IS STARTING...');
  console.log('─────────────────────────────────────');
  console.log(`✅ Server running on port ${PORT}`);
});
