"use client";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadResource from "@/hooks/useLoadResource";
import PlayerControl from "@/components/PlayerControl";

const Player = () => {
  const player = usePlayer();
  const { song, isLoading } = useGetSongById(player.activeId);
  const fetchedSong = useLoadResource(song?.song_path!, "songs");

  if (!song || !player.activeId || !fetchedSong) return null;

  return (
    <div className="fixed bottom-0 py-2 bg-black w-full h-20 px-4">
      <PlayerControl key={fetchedSong} song={song} songUrl={fetchedSong} />
    </div>
  );
};

export default Player;
