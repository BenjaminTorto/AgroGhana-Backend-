import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth.js';
import OpenAI from 'openai';
import multer from 'multer';
import fs from 'fs';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Store audio file with original extension
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// POST /api/voice/transcribe
router.post('/transcribe', protect, upload.single('audio'), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-1',
    });

    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      text: transcription.text,
    });

  } catch (err: any) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error('Whisper error:', err.message);
    return res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// POST /api/voice/ask
router.post('/ask', protect, upload.single('audio'), async (req: AuthRequest, res: Response) => {
  const { farmId, language = 'en' } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  if (!farmId) {
    return res.status(400).json({ error: 'farmId is required' });
  }

  try {
    // Step 1 — Transcribe audio
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-1',
    });

    fs.unlinkSync(req.file.path);

    const question = transcription.text;

    // Step 2 — Send transcribed question to Kundozori
    const advisoryRes = await fetch(`http://localhost:${process.env.PORT || 3000}/api/advisory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization!,
      },
      body: JSON.stringify({ farmId, question, language }),
    });

    const advisory = await advisoryRes.json();

    return res.json({
      success: true,
      transcription: question,
      advisory,
    });

  } catch (err: any) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error('Voice ask error:', err.message);
    return res.status(500).json({ error: 'Failed to process voice question' });
  }
});

export default router;

