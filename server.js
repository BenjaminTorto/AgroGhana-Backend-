const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { supabase } = require('./src/db'); 
const { advisoryEngine } = require('./src/services/advisoryEngine');
const authRoutes = require('./src/routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.post('/api/advisory', async (req, res) => {
  try {
    const { farmId, question } = req.body;
    
    if (!farmId || !question) {
      return res.status(400).json({ error: 'farmId and question are required' });
    }

    // Fetch real farm data
    const { data: farm, error: farmError } = await supabase
      .from('farms')
      .select(`
        id,
        primary_crop,
        region,
        farmer_id,
        soil_type,
        soil_ph,
        farmers (full_name)
      `)
      .eq('id', farmId)
      .single();

    if (farmError || !farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Pass real DB values to the engine
    const advice = await advisoryEngine.getAdvice({
      cropType: farm.primary_crop,
      soilType: farm.soil_type || 'loamy',
      soilPh: farm.soil_ph || 6.5,
      region: farm.region,
      farmId: farm.id,
      farmer_id: farm.farmer_id,
      query: question
    });

    res.json({ 
      success: true, 
      farmer: farm.farmers?.full_name || 'Farmer', 
      data: advice 
    });

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AgroGhana running on port ${PORT}`));
