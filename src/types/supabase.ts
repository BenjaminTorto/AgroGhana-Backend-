export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type CropType = 'maize' | 'cassava' | 'cocoa' | 'rice' | 'yam' | 'vegetable' | 'other'
export type SoilType = 'sandy' | 'clay' | 'loamy' | 'silt' | 'peaty' | 'chalky' | 'unknown'
export type GhanaRegion =
  | 'greater_accra' | 'ashanti' | 'northern' | 'upper_east' | 'upper_west'
  | 'western' | 'eastern' | 'central' | 'volta' | 'bono' | 'bono_east'
  | 'ahafo' | 'savannah' | 'north_east' | 'oti' | 'western_north'

// ─── Convenience type aliases ──────────────────────────────────────────────────
export type FarmerRow = Database['public']['Tables']['farmers']['Row']
export type FarmerInsert = Database['public']['Tables']['farmers']['Insert']
export type FarmRow = Database['public']['Tables']['farms']['Row']
export type FarmInsert = Database['public']['Tables']['farms']['Insert']
export type CropResearchRow = Database['public']['Tables']['crop_research']['Row']
export type CropResearchInsert = Database['public']['Tables']['crop_research']['Insert']
export type AdvisoryLogRow = Database['public']['Tables']['advisory_logs']['Row']
export type AdvisoryLogInsert = Database['public']['Tables']['advisory_logs']['Insert']
export type SoilHealthRow = Database['public']['Tables']['soil_health']['Row']
export type SoilHealthInsert = Database['public']['Tables']['soil_health']['Insert']
export type MarketplaceRow = Database['public']['Tables']['marketplace']['Row']
export type MarketplaceInsert = Database['public']['Tables']['marketplace']['Insert']

export interface Database {
  public: {
    Tables: {
      farmers: {
        Row: {
          id: string
          email: string
          password: string
          full_name: string
          phone_number: string
          region: string
          role: string
          language: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          full_name: string
          phone_number: string
          region?: string
          role?: string
          language?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          full_name?: string
          phone_number?: string
          region?: string
          role?: string
          language?: string | null
          created_at?: string
        }
      }

      farms: {
        Row: {
          id: string
          farmer_id: string
          farm_name: string | null
          location_lat: number | null
          location_lng: number | null
          region: string | null
          soil_type: string | null
          soil_ph: number | null
          size_hectares: number | null
          size_acres: number | null
          crop_types: CropType[] | null
          primary_crop: string | null
          secondary_crop: string | null
          irrigation_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          farm_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          region?: string | null
          soil_type?: string | null
          soil_ph?: number | null
          size_hectares?: number | null
          size_acres?: number | null
          crop_types?: CropType[] | null
          primary_crop?: string | null
          secondary_crop?: string | null
          irrigation_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          farm_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          region?: string | null
          soil_type?: string | null
          soil_ph?: number | null
          size_hectares?: number | null
          size_acres?: number | null
          crop_types?: CropType[] | null
          primary_crop?: string | null
          secondary_crop?: string | null
          irrigation_type?: string | null
          created_at?: string
        }
      }

      crop_research: {
        Row: {
          id: string
          crop_type: CropType
          soil_type: string
          soil_ph: number
          fertilizer_type: string
          fertilizer_quantity_kg: number | null
          fertilizer_quantity_kg_per_ha: number | null
          yield_metric: number
          yield_unit: string
          region: string | null
          season: 'major' | 'minor' | null
          notes: string | null
          source: string | null
          farm_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          crop_type: CropType
          soil_type: string
          soil_ph: number
          fertilizer_type: string
          fertilizer_quantity_kg?: number | null
          fertilizer_quantity_kg_per_ha?: number | null
          yield_metric: number
          yield_unit?: string
          region?: string | null
          season?: 'major' | 'minor' | null
          notes?: string | null
          source?: string | null
          farm_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          crop_type?: CropType
          soil_type?: string
          soil_ph?: number
          fertilizer_type?: string
          fertilizer_quantity_kg?: number | null
          fertilizer_quantity_kg_per_ha?: number | null
          yield_metric?: number
          yield_unit?: string
          region?: string | null
          season?: 'major' | 'minor' | null
          notes?: string | null
          source?: string | null
          farm_id?: string | null
          created_at?: string
        }
      }

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

      soil_health: {
        Row: {
          id: string
          farm_id: string
          farmer_id: string
          ph_level: number | null
          nitrogen_level: string | null
          phosphorus_level: string | null
          potassium_level: string | null
          organic_matter: string | null
          moisture_level: string | null
          notes: string | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          farmer_id: string
          ph_level?: number | null
          nitrogen_level?: string | null
          phosphorus_level?: string | null
          potassium_level?: string | null
          organic_matter?: string | null
          moisture_level?: string | null
          notes?: string | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          farmer_id?: string
          ph_level?: number | null
          nitrogen_level?: string | null
          phosphorus_level?: string | null
          potassium_level?: string | null
          organic_matter?: string | null
          moisture_level?: string | null
          notes?: string | null
          recorded_at?: string
          created_at?: string
        }
      }

      marketplace: {
        Row: {
          id: string
          farmer_id: string
          title: string
          description: string | null
          crop_type: string
          quantity_kg: number
          price_per_kg: number
          region: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          title: string
          description?: string | null
          crop_type: string
          quantity_kg: number
          price_per_kg: number
          region: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          title?: string
          description?: string | null
          crop_type?: string
          quantity_kg?: number
          price_per_kg?: number
          region?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
