"use client";

import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";

import Modal from "@/components/Modal";
import useUploadModal from "@/hooks/useUploadModal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useUser } from "@/hooks/useUser";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const uploadModalState = useUploadModal();

  const { handleSubmit, register, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      image: null,
      song: null,
    },
  });

  const onUploadModalChanged = (open: boolean) => {
    if (!open) {
      reset();
      uploadModalState.onClose();
    }
  };

  const onSubmitForm: SubmitHandler<FieldValues> = async (formData) => {
    const uploadErrorMsg = "Failed to upload song. Something went wrong.";
    const uploadSuccessMsg = "Song uploaded successfully.";
    const onUploadErrorHandler: () => string = () => {
      setIsLoading(false);
      return toast.error(uploadErrorMsg);
    };

    try {
      setIsLoading(true);

      const imageFile = formData.image?.[0];
      const songFile = formData.song?.[0];

      if (!imageFile || !songFile) {
        toast.error(
          "Some fields are missing. Make sure all fields are populated."
        );
        return;
      }

      const id = uniqid();
      const title = formData.title;

      // upload song to storage
      const { data: songUploadData, error: songUploadError } =
        await supabaseClient.storage
          .from("songs")
          .upload(`song-${title}-${id}`, songFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (songUploadError) {
        onUploadErrorHandler();
      }

      // upload song art to storage
      const { data: imageUploadData, error: imageUploadError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${title}-${id}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageUploadError) {
        onUploadErrorHandler();
      }

      // upload data to database
      const { error: databaseInsertError } = await supabaseClient
        .from("songs")
        .insert({
          title,
          song_path: songUploadData?.path,
          image_path: imageUploadData?.path,
          author: formData.artist,
          user_id: user?.id,
        });

      if (databaseInsertError) {
        onUploadErrorHandler();
      }

      router.refresh();
      setIsLoading(false);
      reset();
      toast.success(uploadSuccessMsg);
      uploadModalState.onClose();
    } catch (error) {
      setIsLoading(false);
      toast.error(uploadErrorMsg);
    }
  };
  return (
    <Modal
      isOpen={uploadModalState.isOpen}
      onChange={onUploadModalChanged}
      title="Upload a song"
      description="Upload an mp3 file">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          placeholder="Enter song title"
          {...register("title", { required: true })}
        />
        <Input
          id="artist"
          disabled={isLoading}
          placeholder="Enter artist name"
          {...register("artist", { required: true })}
        />
        <div>
          <p className="pb-1">Select a song</p>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3, .m4a, .wav"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <p className="pb-1">Select song art</p>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          Upload
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
