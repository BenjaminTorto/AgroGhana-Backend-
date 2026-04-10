import { supabase } from '../db.js';
import type { AdvisoryLogInsert, CropResearchRow } from '../types/supabase.ts';

export type CropType = 'maize' | 'cassava' | 'cocoa' | 'rice' | 'yam' | 'vegetable' | 'other';

interface FarmContext {
  cropType: CropType;
  soilType: string;
  soilPh: number;
  region: string;
  season?: 'major' | 'minor';
  farmId: string;
  farmer_id: string; 
  query: string;
}

export const advisoryEngine = {
  async getAdvice(context: FarmContext) {
    const { cropType, soilType, soilPh, region, season = 'major', farmId, farmer_id, query } = context;

    // 1. Fetch Research Data
    const { data: research } = await supabase
      .from('crop_research')
      .select('*')
      .eq('crop_type', cropType)
      .eq('soil_type', soilType)
      .order('yield_metric', { ascending: false })
      .limit(1);

    const bestRecord = research?.[0] as CropResearchRow | undefined;

    // 2. Build advice array
    const adviceList = [
      `Your soil pH in the ${region} region is ${soilPh}.`,
      bestRecord 
        ? `Research suggests using ${bestRecord.fertilizer_type} at ${bestRecord.fertilizer_quantity_kg}kg/acre for ${cropType}.` 
        : `Apply standard organic or NPK fertilizer appropriate for ${cropType}.`,
      `For ${soilType} soil, maintain consistent irrigation to prevent stress.`
    ];

    // 3. Construct the dynamic result
    const result = {
      summary: `Management advice for ${cropType} in ${region}.`,
      advice: adviceList,
      urgency: 'medium',
      followUp: `How is the weather looking for your ${cropType} today?`,
      context: {
        crop: cropType,   // DYNAMIC: Maps to your DB crop
        region: region, // DYNAMIC: Maps to your DB region
        season: season,
        weather: "31°C, Sunny" // Placeholder until Weather API is added
      }
    };

    // 4. Log to DB (Audit Trail)
    const { error: logError } = await supabase
      .from('advisory_logs')
      .insert([{
        farm_id: farmId,
        farmer_id: farmer_id,
        crop_type: cropType,
        query: query,
        advice: result.advice.join(' '), // Log the full advice string
        season: season
      }]);

    if (logError) console.error('Logging Error:', logError.message);

    return result;
  }
};
