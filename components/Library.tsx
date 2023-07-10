"use client";

import React from "react";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { useUserSongs } from "@/providers/SessionUserSongProvider";

import LibrarySongItem from "@/components/LibrarySongItem";

import { LuLibrary } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import useSongPlay from "@/hooks/useSongPlay";

const Library = () => {
  const authModel = useAuthModal();
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const { userSongs } = useUserSongs()!;
  const onPlay = useSongPlay(userSongs);

  const handleOnClick = () => {
    if (!user) {
      return authModel.onOpen();
    }

    // Todo: Check for subscription from Stripe
    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <LuLibrary size={26} className="text-neutral-400 " />
          <p className="text-neutral-400 font-medium text-base">Library</p>
        </div>
        <AiOutlinePlus
          onClick={handleOnClick}
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {userSongs &&
          userSongs.map((song) => (
            <LibrarySongItem
              key={song.id}
              song={song}
              onPlaySong={(id: string) => onPlay(id)}
            />
          ))}
      </div>
    </div>
  );
};

export default Library;
