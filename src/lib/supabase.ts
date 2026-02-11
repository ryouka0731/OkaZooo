// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getRandomVideo() {
  const { data, error } = await supabase.from("videos").select("*");
  if (error || !data || data.length === 0) return null;
  const idx = Math.floor(Math.random() * data.length);
  return data[idx];
}
