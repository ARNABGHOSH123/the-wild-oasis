import { supabase, supabaseURL } from "./supabase";
import { v4 as uuidv4 } from "uuid";

async function deleteCabinImage(url) {
  const imageName = url.split("/").pop();
  const { error: imageDeleteError } = await supabase.storage
    .from(import.meta.env.VITE_APP_CABIN_BUCKET)
    .remove([imageName]);

  if (imageDeleteError) {
    console.error(imageDeleteError);
    throw new Error("Something went wrong while deleting the cabin image");
  }
}

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching cabins!");
  }

  return data;
}

export async function createEditCabin(cabinData, id, currentImageUrl) {
  const isImageAlreadyUploaded =
    id && cabinData?.image?.startsWith?.(supabaseURL);

  let imagePath =
    isImageAlreadyUploaded || cabinData?.image?.startsWith?.(supabaseURL)
      ? cabinData.image
      : "";

  if (!isImageAlreadyUploaded && cabinData.image.name) {
    // Try to upload the image first
    const imageName = `${uuidv4()}-${cabinData.image.name}`.replaceAll("/", "");

    const { data: uploadedImageData, error: imageUploadError } =
      await supabase.storage
        .from(import.meta.env.VITE_APP_CABIN_BUCKET)
        .upload(imageName, cabinData.image);

    if (imageUploadError) {
      console.error(imageUploadError);
      throw new Error(
        "Something went wrong while trying to upload cabin image"
      );
    }
    imagePath = `${supabaseURL}/storage/v1/object/public/${uploadedImageData.fullPath}`;
  }

  // Try to create the new cabin with the new image path
  let query = supabase.from("cabins");
  if (!id) {
    query = query.insert([{ ...cabinData, image: imagePath }]);
  } else {
    const cabinToUpdated = isImageAlreadyUploaded
      ? cabinData
      : { ...cabinData, image: imagePath };
    // Delete the old image if new image is added for editing cabin
    !isImageAlreadyUploaded &&
      currentImageUrl &&
      (await deleteCabinImage(currentImageUrl));
    query = query.update(cabinToUpdated).eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error(
      `Something went wrong while trying to ${id ? "edit" : "create"} cabin`
    );
  }

  return data;
}

export async function deleteCabin(cabin) {
  cabin?.image && (await deleteCabinImage(cabin.image));
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", cabin.id);

  if (error) {
    console.error(error);
    throw new Error("Something went wrong while deleting cabin!");
  }

  return data;
}
