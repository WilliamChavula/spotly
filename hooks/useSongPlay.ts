import useAuthModal from "@/hooks/useAuthModal";
import usePlayer from "@/hooks/usePlayer";
import useStripeSubscriptionModal from "@/hooks/useStripeSubscriptionModal";
import { useUser } from "@/hooks/useUser";
import type { Song } from "@/types";

const useSongPlay = (songs: Song[]) => {
  const authModal = useAuthModal();
  const player = usePlayer();
  const subscriptionModal = useStripeSubscriptionModal();
  const { user, subscription } = useUser();

  return (id: string) => {
    if (!user) return authModal.onOpen();

    if (!subscription) return subscriptionModal.onOpen();

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  };
};

export default useSongPlay;
