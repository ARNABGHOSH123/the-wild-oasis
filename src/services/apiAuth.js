import { supabase, supabaseURL } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export async function signUpUser(values) {
  const { data, error } = await supabase.auth.signUp({
    email: values?.email,
    password: values?.password,
    options: {
      data: {
        fullName: values?.fullName,
        avatar: "",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error("User could not be logged in");
  }
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw new Error("User could not be logged out");
  }
}

export async function getUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data?.user;
}

export async function updateUser({
  password,
  avatar,
  fullName,
  currentAvatarUrl,
}) {
  let imagePath;
  if (avatar?.name) {
    const imageName = `${uuidv4()}-${avatar?.name}`.replaceAll("/", "");

    const { data: uploadedImageData, error: imageUploadError } =
      await supabase.storage
        .from(import.meta.env.VITE_APP_USER_AVATAR_BUCKET)
        .upload(imageName, avatar);

    if (imageUploadError) {
      throw new Error(
        "Something went wrong while trying to upload avatar image"
      );
    }

    imagePath = `${supabaseURL}/storage/v1/object/public/${uploadedImageData.fullPath}`;
  }

  const { data, error } = await supabase.auth.updateUser({
    password,
    data: {
      fullName,
      avatar: imagePath,
    },
  });

  if (avatar?.name) {
    const imageName = currentAvatarUrl.split("/").pop();
    const { error: imageDeleteError } = await supabase.storage
      .from(import.meta.env.VITE_APP_USER_AVATAR_BUCKET)
      .remove([imageName]);

    if (imageDeleteError) {
      console.error(imageDeleteError);
      throw new Error("Something went wrong while deleting the avatar image");
    }
  }

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
