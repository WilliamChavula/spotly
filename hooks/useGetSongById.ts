import { useState, useEffect, useMemo } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

import type { Song } from "@/types";

const UseGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error: err } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (err) {
        setIsLoading(false);
        toast.error(err.message);
      }

      setIsLoading(false);
      setSong(data as Song);
    };

    fetchSong();
  }, [id, supabaseClient]);
  return useMemo(() => ({ isLoading, song }), [isLoading, song]);
};

export default UseGetSongById;
