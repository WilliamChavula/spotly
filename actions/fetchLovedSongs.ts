import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

const FetchLovedSongs = async (): Promise<Song[]> => {
  const supabase = createServerActionClient({ cookies: cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", session?.user?.id);

  if (error || !data) return [];

  return data.map((fetched) => ({ ...fetched.songs }));
};

export default FetchLovedSongs;
