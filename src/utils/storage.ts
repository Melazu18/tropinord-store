import { supabase } from "@/integrations/supabase/client";

export function getProductImageUrl(path?: string | null) {
  if (!path) return "/placeholder.svg";

  // If you ever store full URLs, keep supporting them
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl || "/placeholder.svg";
}
