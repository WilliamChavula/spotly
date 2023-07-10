"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikeSongButton = ({ songId }: { songId: string }) => {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const authModal = useAuthModal();

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };
    const _ = fetchData();
  }, [user?.id, songId, supabaseClient]);

  const handleSongLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error: insertError } = await supabaseClient
        .from("liked_songs")
        .insert({ song_id: songId, user_id: user.id });

      if (insertError) {
        toast.error(insertError.message);
      } else {
        setIsLiked(true);
        toast.success("Loved");
      }
    }

    router.refresh();
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      className="hover:opacity-60 transition-opacity duration-250"
      onClick={handleSongLike}>
      <Icon className={isLiked ? "text-green-600" : "text-white"} size={25} />
    </button>
  );
};

export default LikeSongButton;
