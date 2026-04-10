import axios from 'axios';
import { supabase } from '../db.js';
import 'dotenv/config';
import type { CropType, SoilType, GhanaRegion } from '../types/supabase.js';

export interface FarmRow {
  id: string;
  farmer_id: string;
  farm_name: string;
  crop_types: CropType[];
  soil_type: SoilType;
  soil_ph: number;
  region: GhanaRegion;
  location_lat: number;
  location_lng: number;
}

export interface WeatherData {
  summary: string;
  tempC: number;
  condition: string;
}

export async function buildFarmContext(farmId: string) {
  // 1. Fetch Farm Data with Explicit Typing
  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .eq('id', farmId)
    .single();

  // Cast the data to your FarmRow type
  const farm = data as FarmRow;

  if (error || !farm) {
    console.error(`❌ Farm not found or DB error: ${error?.message}`);
    return null;
  }

  // 2. Ghana Season Logic (Major: Mar-July, Minor: Sept-Nov)
  const month = new Date().getMonth() + 1;
  const season = (month >= 3 && month <= 7) ? 'major' : 'minor';

  // 3. Robust Weather Fetching
  let weather: WeatherData = { summary: 'Data unavailable', tempC: 28, condition: 'clear' };
  
  const apiKey = process.env.WEATHER_API_KEY;

  if (apiKey && farm.location_lat && farm.location_lng) {
    try {
      const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: farm.location_lat,
          lon: farm.location_lng,
          appid: apiKey,
          units: 'metric'
        },
        timeout: 5000 // Prevent hanging the app if OpenWeather is slow
      });

      weather = {
        summary: `${weatherRes.data.main.temp}°C, ${weatherRes.data.weather[0].description}`,
        tempC: weatherRes.data.main.temp,
        condition: weatherRes.data.weather[0].main.toLowerCase()
      };
    } catch (e: any) {
      console.warn(`⚠️ Weather fetch failed for farm ${farmId}: ${e.message}`);
    }
  } else {
    console.warn('⚠️ Missing Weather API Key or Farm Coordinates. Using defaults.');
  }

  // 4. Return Structured Context
  return {
    farmId: farm.id,
    farmerId: farm.farmer_id,
    farmName: farm.farm_name,
    cropTypes: (farm.crop_types || []) as CropType[],
    soilType: (farm.soil_type || 'loamy') as SoilType,
    soilPh: farm.soil_ph ?? 6.5,
    region: (farm.region || 'greater_accra') as GhanaRegion,
    season: season as 'major' | 'minor',
    weather
  };
}