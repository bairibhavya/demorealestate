import { supabase } from "./supabase";

// =============================
// GET ALL PROPERTIES
// =============================
export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// =============================
// DELETE PROPERTY
// =============================

export async function deleteProperty(id) {

  // Get thumbnail first
  const { data } = await supabase
    .from("properties")
    .select("thumbnail")
    .eq("id", id)
    .single();

  if (data?.thumbnail) {

    const fileName =
      data.thumbnail.split("/").pop();

    await supabase.storage
      .from("property-images")
      .remove([fileName]);

  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleFeatured(id, featured) {
  const { error } = await supabase
    .from("properties")
    .update({
      featured: !featured,
    })
    .eq("id", id);

  if (error) throw error;
}