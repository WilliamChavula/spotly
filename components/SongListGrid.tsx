"use client";

import { useCallback } from "react";

import SongDisplay from "@/components/SongDisplay";
import type { Song } from "@/types";
import useSongPlay from "@/hooks/useSongPlay";

const SongListGrid = ({ songs }: { songs: Song[] }) => {
  const onPlay = useSongPlay(songs);
  const onclickHandler = (id: string) => {
    onPlay(id);
  };

  let content;
  if (!songs || songs.length === 0) {
    content = (
      <p className="font-medium text-neutral-500 text-lg mt-4">
        No Songs available
      </p>
    );
  } else {
    content = (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 m-4">
        {songs.map((song) => (
          <SongDisplay key={song.id} song={song} onClick={onclickHandler} />
        ))}
      </div>
    );
  }
  return content;
};

export default SongListGrid;
