import { Router } from "express";
import { supabase } from '../db.js';


const router = Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }

  res.json({
    status: "ok",
    message: "Supabase connection works!",
    sample: data
  });
});

export default router;

