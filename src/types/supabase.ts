export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ─── Crop Types ────────────────────────────────────────────────────────────────
export type CropType = 'maize' | 'cassava' | 'cocoa' | 'rice' | 'yam' | 'vegetable' | 'other'

export type SoilType = 'sandy' | 'clay' | 'loamy' | 'silt' | 'peaty' | 'chalky' | 'unknown'

export type GhanaRegion =
  | 'greater_accra'
  | 'ashanti'
  | 'northern'
  | 'upper_east'
  | 'upper_west'
  | 'western'
  | 'eastern'
  | 'central'
  | 'volta'
  | 'bono'
  | 'bono_east'
  | 'ahafo'
  | 'savannah'
  | 'north_east'
  | 'oti'
  | 'western_north'

// ─── Database Schema ───────────────────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {

      // ── Farmers ──────────────────────────────────────────────────────────────
      farmers: {
        Row: {
          id: string
          email: string
          password: string
          full_name: string
          phone_number: string
          region: GhanaRegion
          role: 'farmer' | 'extension_officer'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          full_name: string
          phone_number: string
          region: GhanaRegion
          role?: 'farmer' | 'extension_officer'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone_number?: string
          region?: GhanaRegion
          role?: 'farmer' | 'extension_officer'
          created_at?: string
        }
      }

      // ── Farms ─────────────────────────────────────────────────────────────────
      farms: {
        Row: {
          id: string
          farmer_id: string
          farm_name: string
          location_lat: number
          location_lng: number
          region: GhanaRegion
          soil_type: SoilType
          soil_ph: number | null
          size_hectares: number | null
          crop_types: CropType[]
          created_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          farm_name: string
          location_lat: number
          location_lng: number
          region: GhanaRegion
          soil_type: SoilType
          soil_ph?: number | null
          size_hectares?: number | null
          crop_types: CropType[]
          created_at?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          farm_name?: string
          location_lat?: number
          location_lng?: number
          region?: GhanaRegion
          soil_type?: SoilType
          soil_ph?: number | null
          size_hectares?: number | null
          crop_types?: CropType[]
          created_at?: string
        }
      }

      // ── Crop Research (replaces maize_research — now multi-crop) ─────────────
      crop_research: {
        Row: {
          id: string
          crop_type: CropType
          soil_type: SoilType
          soil_ph: number
          fertilizer_type: string
          fertilizer_quantity_kg_per_ha: number | null
          yield_metric: number
          yield_unit: string                  // e.g. "tons/ha"
          region: GhanaRegion | null
          season: 'major' | 'minor' | null    // Ghana has two farming seasons
          notes: string | null
          source: string | null               // e.g. "CSIR-SARI", "MoFA Ghana"
          created_at: string
        }
        Insert: {
          id?: string
          crop_type: CropType
          soil_type: SoilType
          soil_ph: number
          fertilizer_type: string
          fertilizer_quantity_kg_per_ha?: number | null
          yield_metric: number
          yield_unit?: string
          region?: GhanaRegion | null
          season?: 'major' | 'minor' | null
          notes?: string | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          crop_type?: CropType
          soil_type?: SoilType
          soil_ph?: number
          fertilizer_type?: string
          fertilizer_quantity_kg_per_ha?: number | null
          yield_metric?: number
          yield_unit?: string
          region?: GhanaRegion | null
          season?: 'major' | 'minor' | null
          notes?: string | null
          source?: string | null
          created_at?: string
        }
      }

      // ── Advisory Logs (stores AI advice given to farmers) ────────────────────
      advisory_logs: {
        Row: {
          id: string
          farm_id: string
          farmer_id: string
          crop_type: CropType
          query: string
          advice: string
          season: 'major' | 'minor' | null
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          farmer_id: string
          crop_type: CropType
          query: string
          advice: string
          season?: 'major' | 'minor' | null
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          farmer_id?: string
          crop_type?: CropType
          query?: string
          advice?: string
          season?: 'major' | 'minor' | null
          created_at?: string
        }
      }

    }
  }
}