import { SupabaseClient, createClient } from "@supabase/supabase-js"

declare global {
  var supabase: SupabaseClient | undefined
}

const supabase =
  globalThis.supabase ||
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
  )

if (process.env.NODE_ENV !== "production") globalThis.supabase = supabase

export default supabase
