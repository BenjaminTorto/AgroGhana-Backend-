"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
var supabaseUrl = process.env.SUPABASE_URL || '';
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERROR: Supabase credentials missing in .env');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
console.log('🔗 Supabase client initialized');
