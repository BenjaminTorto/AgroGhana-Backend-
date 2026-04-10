import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from '../db.js';
// chnaged from default import
const router = Router();

// ─── Register ────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { email, password, full_name, phone_number } = req.body;

  if (!email || !password || !full_name || !phone_number) {
    return res.status(400).json({ error: "Full name, phone number, email, and password are required" });
  }

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Supabase table (farmers)
    const { data, error } = await supabase
      .from("farmers")
      .insert([{ email, password: hashedPassword, full_name, phone_number, role: "farmer" }])
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Registration successful", user: data });
  } catch (err: any) {
    console.error("❌ Registration error:", err.message);
    res.status(400).json({ error: "Registration failed" });
  }
});

// ─── Login ───────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("farmers")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing in .env");

    const token = jwt.sign(
      { id: user.id, role: user.role || "farmer" },
      secret,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    res.status(400).json({ error: "Login failed" });
  }
});

// ─── Logout ──────────────────────────────────────────────────
// With JWT, logout is handled client‑side (just discard the token).
router.post("/logout", (req, res) => {
  res.json({ message: "Successfully logged out (discard token on client)" });
});

export default router;
