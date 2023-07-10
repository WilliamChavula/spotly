"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";

import { useUser } from "@/hooks/useUser";
import LibrarySongItem from "@/components/LibrarySongItem";
import LikeSongButton from "@/components/LikeSongButton";

import type { Song } from "@/types";
import useSongPlay from "@/hooks/useSongPlay";

const LovedSongsPlaylist = ({ songs }: { songs: Song[] }) => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const onPlay = useSongPlay(songs);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  if (songs.length === 0) {
    return <p className="w-full text-neutral-400 px-6">No Liked songs.</p>;
  }

  const formatDateAdded = (songAdded: string) => {
    return formatDistance(new Date(songAdded), new Date(), {
      addSuffix: true,
    });
  };

  return (
    <div className="relative w-full overflow-x-auto px-6">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b border-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Date added
            </th>
            <th scope="col" className="px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.id}
              className="hover:bg-neutral-800/50 cursor-pointer">
              <td className="px-6 py-1">{index + 1}</td>
              <td className="px-6 py-1">
                <LibrarySongItem
                  song={song}
                  onPlaySong={(id: string) => onPlay(id)}
                />
              </td>
              <td className="px-6 py-1">{formatDateAdded(song.created_at)}</td>
              <td className="px-6 py-1">
                <LikeSongButton songId={song.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LovedSongsPlaylist;
