import { Router, Response } from 'express';
import { buildFarmContext } from '../services/contextBuilder.js';
import { advisoryEngine } from '../services/advisoryEngine.js';
import { protect, AuthRequest } from '../middleware/auth.js';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const languageMap: Record<string, string> = {
  en: 'simple English',
  tw: 'Twi (Akan)',
  dag: 'Dagbani',
  ha: 'Hausa',
  ee: 'Ewe',
};

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  const { farmId, question, language = 'en' } = req.body;

  if (!farmId || !question) {
    res.status(400).json({ error: 'farmId and question are required' });
    return;
  }

  try {
    // 1. Build farm context (farm data + weather + season)
    const context = await buildFarmContext(farmId);
    if (!context) {
      res.status(404).json({ error: 'Farm not found' });
      return;
    }

    // 2. Get rules-based advice from Supabase crop_research
    const engineResult = await advisoryEngine.getAdvice({
      cropType: context.cropTypes[0],
      soilType: context.soilType,
      soilPh: context.soilPh,
      region: context.region,
      season: context.season,
      farmId: context.farmId,
      farmerId: context.farmerId,
      query: question,
    });

    // 3. Build multilingual system prompt
    const respondIn = languageMap[language] || 'simple English';

    const systemPrompt = `
You are Kundozori, a friendly and knowledgeable farming advisor for smallholder farmers in Ghana.
Respond ONLY in ${respondIn}. Do not mix languages.
Keep advice short, practical, and actionable for a subsistence farmer with no machinery, no irrigation, and limited resources.
Use simple words a farmer with no formal education can understand.
Respond ONLY as valid JSON:
{
  "summary": "one sentence answer to the farmer's question",
  "advice": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "urgency": "low | medium | high",
  "followUp": "one question to help the farmer further"
}`.trim();

    // 4. Build user message
    const userMessage = `
Farmer question: "${question}"
Farm context:
- Crops: ${context.cropTypes.join(', ')}
- Soil: ${context.soilType}, pH ${context.soilPh}
- Region: ${context.region}
- Season: ${context.season}
- Weather: ${context.weather.summary}
${engineResult ? `Research-based advice: ${engineResult.fertilizerAdvice}. ${engineResult.seasonalTip}` : ''}
`.trim();

    // 5. Send to GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.4,
      max_tokens: 600,
      response_format: { type: 'json_object' }
    });

    const raw = completion.choices[0].message.content ?? '{}';
    const advisory = JSON.parse(raw);

    res.json({ 
      success: true, 
      data: { 
        ...advisory, 
        context: { 
          crop: context.cropTypes[0], 
          region: context.region, 
          season: context.season, 
          weather: context.weather.summary,
          language: respondIn,
        } 
      } 
    });

  } catch (err) {
    console.error('Advisory route error:', err);
    res.status(500).json({ error: 'Failed to generate advisory' });
  }
});

export default router;
