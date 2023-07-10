"use client";

import React from "react";
import LibrarySongItem from "@/components/LibrarySongItem";
import type { Song } from "@/types";
import LikeSongButton from "@/components/LikeSongButton";
import useSongPlay from "@/hooks/useSongPlay";

const SearchDisplay = ({ songs }: { songs: Song[] }) => {
  const onPlay = useSongPlay(songs);
  if (songs.length === 0) {
    return <p className="px-6 text-neutral-400">No Songs Found</p>;
  } else {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6">
        {songs.map((song) => (
          <div key={song.id} className="flex items-center gap-x-4 w-full">
            <div className="flex-1">
              <LibrarySongItem
                song={song}
                onPlaySong={(id: string) => onPlay(id)}
              />
            </div>
            <LikeSongButton songId={song.id} />
          </div>
        ))}
      </div>
    );
  }
};

export default SearchDisplay;
