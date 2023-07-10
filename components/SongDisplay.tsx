"use client";

import Image from "next/image";

import { Song } from "@/types";
import useLoadResource from "@/hooks/useLoadResource";
import PlayButton from "@/components/PlayButton";

const SongDisplay = ({
  song,
  onClick,
}: {
  song: Song;
  onClick: (id: string) => void;
}) => {
  const imagePath = useLoadResource(song.image_path, "images");

  const handleClick = () => {
    onClick(song.id);
  };

  return (
    <div
      className="relative group flex flex-col items-center md:items-start justify-center rounded-md gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition pb-3"
      onClick={handleClick}>
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image src={imagePath} alt="Song Art" className="object-cover" fill />
      </div>
      <div className="p-4 w-full">
        <p className="text-sm font-semibold truncate mb-2">{song.title}</p>
        <p className="text-neutral-400 text-xs">{song.author}</p>
      </div>
      <div className="absolute right-5 bottom-1/3">
        <PlayButton />
      </div>
    </div>
  );
};

export default SongDisplay;
