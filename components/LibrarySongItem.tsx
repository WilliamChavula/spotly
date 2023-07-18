"use client";

import Image from "next/image";

import { Song } from "@/types";
import useLoadResource from "@/hooks/useLoadResource";
import usePlayer from "@/hooks/usePlayer";

const LibrarySongItem = ({
  song,
  onPlaySong,
}: {
  song: Song;
  onPlaySong?: (id: string) => void;
}) => {
  const player = usePlayer();
  const image = useLoadResource(song.image_path, "images");

  const handleClick = () => {
    if (onPlaySong) return onPlaySong(song.id);

    return player.setId(song.id);
  };
  return (
    <div
      className="flex items-center cursor-pointer hover:bg-neutral-800/50 gap-x-3 w-full p-2 rounded-md"
      onClick={handleClick}>
      <div className="relative rounded-md min-h-12 min-w-12 overflow-hidden">
        <Image src={image} alt={song.title} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate text-sm">{song.title}</p>
        <p className="text-neutral-400 text-xs truncate">{song.author}</p>
      </div>
    </div>
  );
};

export default LibrarySongItem;
