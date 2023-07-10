import useAuthModal from "@/hooks/useAuthModal";
import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import type { Song } from "@/types";

const useSongPlay = (songs: Song[]) => {
  const player = usePlayer();
  const { user } = useUser();
  const authModal = useAuthModal();

  return (id: string) => {
    if (!user) return authModal.onOpen();
    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  };
};

export default useSongPlay;
