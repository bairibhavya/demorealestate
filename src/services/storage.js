import {  supabase } from "./supabase";

const BUCKET = "property-images";

export async function uploadImage(file) {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file);

  console.log("UPLOAD DATA:", data);
  console.log("UPLOAD ERROR:", error);

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return publicData.publicUrl;
}