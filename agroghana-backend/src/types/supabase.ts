export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type CropType = 'maize' | 'cassava' | 'cocoa' | 'rice' | 'yam' | 'vegetable' | 'other'
export type SoilType = 'sandy' | 'clay' | 'loamy' | 'silt' | 'peaty' | 'chalky' | 'unknown'
export type GhanaRegion =
  | 'greater_accra' | 'ashanti' | 'northern' | 'upper_east' | 'upper_west'
  | 'western' | 'eastern' | 'central' | 'volta' | 'bono' | 'bono_east'
  | 'ahafo' | 'savannah' | 'north_east' | 'oti' | 'western_north'

export interface Database {
  public: {
    Tables: {
      farmers: {
        Row: { id: string; full_name: string; phone_number: string; region: GhanaRegion; role: 'farmer' | 'extension_officer'; created_at: string }
        Insert: { id?: string; full_name: string; phone_number: string; region: GhanaRegion; role?: 'farmer' | 'extension_officer'; created_at?: string }
        Update: { id?: string; full_name?: string; phone_number?: string; region?: GhanaRegion; role?: 'farmer' | 'extension_officer'; created_at?: string }
      }
      farms: {
        Row: { id: string; farmer_id: string; farm_name: string; location_lat: number; location_lng: number; region: GhanaRegion; soil_type: SoilType; soil_ph: number | null; size_hectares: number | null; crop_types: CropType[]; created_at: string }
        Insert: { id?: string; farmer_id: string; farm_name: string; location_lat: number; location_lng: number; region: GhanaRegion; soil_type: SoilType; soil_ph?: number | null; size_hectares?: number | null; crop_types: CropType[]; created_at?: string }
        Update: { id?: string; farmer_id?: string; farm_name?: string; location_lat?: number; location_lng?: number; region?: GhanaRegion; soil_type?: SoilType; soil_ph?: number | null; size_hectares?: number | null; crop_types?: CropType[]; created_at?: string }
      }
      crop_research: {
        Row: { id: string; crop_type: CropType; soil_type: SoilType; soil_ph: number; fertilizer_type: string; fertilizer_quantity_kg_per_ha: number | null; yield_metric: number; yield_unit: string; region: GhanaRegion | null; season: 'major' | 'minor' | null; notes: string | null; source: string | null; created_at: string }
        Insert: { id?: string; crop_type: CropType; soil_type: SoilType; soil_ph: number; fertilizer_type: string; fertilizer_quantity_kg_per_ha?: number | null; yield_metric: number; yield_unit?: string; region?: GhanaRegion | null; season?: 'major' | 'minor' | null; notes?: string | null; source?: string | null; created_at?: string }
        Update: { id?: string; crop_type?: CropType; soil_type?: SoilType; soil_ph?: number; fertilizer_type?: string; fertilizer_quantity_kg_per_ha?: number | null; yield_metric?: number; yield_unit?: string; region?: GhanaRegion | null; season?: 'major' | 'minor' | null; notes?: string | null; source?: string | null; created_at?: string }
      }
      advisory_logs: {
        Row: { id: string; farm_id: string; farmer_id: string; crop_type: CropType; query: string; advice: string; season: 'major' | 'minor' | null; created_at: string }
        Insert: { id?: string; farm_id: string; farmer_id: string; crop_type: CropType; query: string; advice: string; season?: 'major' | 'minor' | null; created_at?: string }
        Update: { id?: string; farm_id?: string; farmer_id?: string; crop_type?: CropType; query?: string; advice?: string; season?: 'major' | 'minor' | null; created_at?: string }
      }
    }
  }
}

export type FarmerRow = Database['public']['Tables']['farmers']['Row']
export type FarmerInsert = Database['public']['Tables']['farmers']['Insert']
export type FarmRow = Database['public']['Tables']['farms']['Row']
export type FarmInsert = Database['public']['Tables']['farms']['Insert']
export type CropResearchRow = Database['public']['Tables']['crop_research']['Row']
export type CropResearchInsert = Database['public']['Tables']['crop_research']['Insert']
export type AdvisoryLogInsert = Database['public']['Tables']['advisory_logs']['Insert']
