import express, { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { supabase } from '../db.js';
import type { FarmerRow, FarmerInsert, GhanaRegion } from '../types/supabase.js';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { full_name, phone_number, region, role } = req.body;

    if (!full_name || !phone_number) {
      return res.status(400).json({ error: 'Full name and phone number are required' });
    }

    const { data: existing } = await supabase
      .from('farmers')
      .select('id')
      .eq('phone_number', phone_number)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const insertData: FarmerInsert = {
      full_name,
      phone_number,
      region: (region as GhanaRegion) ?? 'northern',
      role: role ?? 'farmer',
    };

    const { data, error } = await supabase
      .from('farmers')
      .insert(insertData as any)
      .select()
      .single();

    if (error || !data) {
      console.error('Registration error:', error?.message);
      return res.status(500).json({ error: 'Registration failed' });
    }

    const farmer = data as FarmerRow;
    const token = jwt.sign(
      { id: farmer.id, role: farmer.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: `Welcome to AgroGhana, ${farmer.full_name}! 🌱`,
      token,
      farmer,
    });

  } catch (err) {
    console.error('Register route error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('phone_number', phone_number)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Phone number not found. Please register first.' });
    }

    const farmer = data as FarmerRow;
    const token = jwt.sign(
      { id: farmer.id, role: farmer.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      message: `Welcome back, ${farmer.full_name}! 🌱`,
      token,
      farmer,
    });

  } catch (err) {
    console.error('Login route error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
