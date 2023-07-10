import usePlayer from "@/hooks/usePlayer";

const UseOnSelectSong = () => {
  const player = usePlayer();
  const setNextSong = () => {
    if (!player.ids.length) return;

    const currentSongIndex = player.ids.findIndex(
      (id) => player.activeId === id
    );
    const nextSong = player.ids[currentSongIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }
    player.setId(nextSong);
  };

  const setPreviousSong = () => {
    if (!player.ids.length) return;

    const currentSongIndex = player.ids.findIndex(
      (id) => player.activeId === id
    );
    const previousSong = player.ids[currentSongIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }
    player.setId(previousSong);
  };
  return { setNextSong, setPreviousSong };
};

export default UseOnSelectSong;
