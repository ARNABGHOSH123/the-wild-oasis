import { createClient } from "@supabase/supabase-js";
export const supabaseURL = "https://ukmjrdugkfjzaueuffeo.supabase.co";
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;
export const supabase = createClient(supabaseURL, supabaseKey);
