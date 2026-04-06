// lib/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

// Read environment variables for the admin panel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Check your .env file."
  );
}

// Create a Supabase client specifically for the admin panel
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);