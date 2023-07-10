"use client";
import React, { createContext, useContext } from "react";
import { Song } from "@/types";

interface UserSongsState {
  userSongs: Song[];
}

const SongContext = createContext<UserSongsState | null>(null);

export const useUserSongs = () => useContext(SongContext);
const SessionUserSongProvider = ({
  children,
  userSongs,
}: {
  children: React.ReactNode;
  userSongs: Song[];
}) => {
  return (
    <SongContext.Provider value={{ userSongs }}>
      {children}
    </SongContext.Provider>
  );
};

export default SessionUserSongProvider;
