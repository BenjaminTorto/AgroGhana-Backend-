import { Router, Response } from 'express';
import { supabase } from '../db.js';
import { protect, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/soil — log new soil health reading
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  const { farm_id, ph_level, nitrogen_level, phosphorus_level, potassium_level, organic_matter, moisture_level, notes } = req.body;

  if (!farm_id || !ph_level) {
    return res.status(400).json({ error: 'farm_id and ph_level are required' });
  }

  try {
    const { data, error } = await supabase
      .from('soil_health')
      .insert([{
        farm_id,
        farmer_id: req.farmerId,
        ph_level,
        nitrogen_level,
        phosphorus_level,
        potassium_level,
        organic_matter,
        moisture_level,
        notes
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (err: any) {
    console.error('Soil health error:', err.message);
    return res.status(500).json({ error: 'Failed to save soil health data' });
  }
});

// GET /api/soil/:farmId — get soil history for a farm
router.get('/:farmId', protect, async (req: AuthRequest, res: Response) => {
  const { farmId } = req.params;

  try {
    const { data, error } = await supabase
      .from('soil_health')
      .select('*')
      .eq('farm_id', farmId)
      .order('recorded_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Soil health fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch soil health data' });
  }
});

export default router;
