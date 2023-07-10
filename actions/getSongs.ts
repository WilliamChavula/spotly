import { Song } from "@/types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (title?: string): Promise<Song[]> => {
  const supabase = createServerActionClient({
    cookies,
  });

  if (!title) {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });

    return data as Song[];
  }

  const { data } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  return data as Song[];
};

export default getSongs;
