"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";
import type { Song } from "@/types";

import LibrarySongItem from "@/components/LibrarySongItem";
import LikeSongButton from "@/components/LikeSongButton";
import SliderControl from "@/components/SliderControl";

import useOnSelectSong from "@/hooks/useOnSelectSong";

import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

const PlayerControl = ({ song, songUrl }: { song: Song; songUrl: string }) => {
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, sound }] = useSound(songUrl, {
    volume,
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => {
      setIsPlaying(false);
      setNextSong();
    },
    format: ["mp3"],
  });
  const { setNextSong, setPreviousSong } = useOnSelectSong();

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeControl = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  useEffect(() => {
    sound?.play();
    return () => sound?.unload();
  }, [sound]);

  const handlePlayingSong = () => (isPlaying ? pause() : play());
  const muteSoundController = () =>
    volume === 0 ? setVolume(1) : setVolume(0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <LibrarySongItem song={song} />
          <LikeSongButton songId={song.id} />
        </div>
      </div>
      <div className="flex justify-end items-center md:hidden col-auto w-full">
        <div
          className="w-10 h-10 flex justify-center items-center rounded-full bg-white p-1 cursor-pointer"
          onClick={handlePlayingSong}>
          <Icon size={30} className="text-black" />
        </div>
      </div>
      <div className="hidden h-full w-full md:flex justify-center items-center gap-x-6 max-w-2xl">
        <AiFillStepBackward
          onClick={setPreviousSong}
          size={30}
          className="cursor-pointer text-neutral-400 hover:text-white transition-colors"
        />
        <div
          className="w-10 h-10 flex justify-center items-center rounded-full bg-white p-1 cursor-pointer"
          onClick={handlePlayingSong}>
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={setNextSong}
          size={30}
          className="cursor-pointer text-neutral-400 hover:text-white transition-colors"
        />
      </div>
      <div className="hidden md:flex justify-end w-full pr-2 cursor-pointer">
        <div className="flex items-center gap-x-2 w-28">
          <VolumeControl
            onClick={muteSoundController}
            size={30}
            className="cursor-pointer"
          />
          <SliderControl
            value={volume}
            onChange={(value) => setVolume(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerControl;
