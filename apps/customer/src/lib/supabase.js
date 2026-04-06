import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iwioeecgwuvibgrjbrvg.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);