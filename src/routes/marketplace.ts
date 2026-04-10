import { Router, Response } from 'express';
import { supabase } from '../db.js';
import { protect, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/marketplace — create a new listing
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  const { title, description, crop_type, quantity_kg, price_per_kg, region } = req.body;

  if (!title || !crop_type || !quantity_kg || !price_per_kg || !region) {
    return res.status(400).json({ error: 'title, crop_type, quantity_kg, price_per_kg and region are required' });
  }

  try {
    const { data, error } = await supabase
      .from('marketplace')
      .insert([{
        farmer_id: req.farmerId,
        title,
        description,
        crop_type,
        quantity_kg,
        price_per_kg,
        region,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (err: any) {
    console.error('Marketplace create error:', err.message);
    return res.status(500).json({ error: 'Failed to create listing' });
  }
});

// GET /api/marketplace — browse all active listings
router.get('/', async (req, res) => {
  const { region, crop_type } = req.query;

  try {
    let query = supabase
      .from('marketplace')
      .select('*, farmers(full_name, region, phone_number)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (region) query = query.eq('region', region);
    if (crop_type) query = query.eq('crop_type', crop_type);

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Marketplace fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET /api/marketplace/my — get my listings
router.get('/my', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('marketplace')
      .select('*')
      .eq('farmer_id', req.farmerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('My listings error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch your listings' });
  }
});

// PATCH /api/marketplace/:id — update a listing
router.patch('/:id', protect, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, quantity_kg, price_per_kg, status } = req.body;

  try {
    const { data, error } = await supabase
      .from('marketplace')
      .update({ title, description, quantity_kg, price_per_kg, status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('farmer_id', req.farmerId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Listing not found or not yours' });

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Marketplace update error:', err.message);
    return res.status(500).json({ error: 'Failed to update listing' });
  }
});

// DELETE /api/marketplace/:id — delete a listing
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('marketplace')
      .delete()
      .eq('id', id)
      .eq('farmer_id', req.farmerId);

    if (error) throw error;

    return res.json({ success: true, message: 'Listing deleted' });
  } catch (err: any) {
    console.error('Marketplace delete error:', err.message);
    return res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
