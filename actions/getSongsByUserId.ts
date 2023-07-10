import { Song } from "@/types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createServerActionClient({
    cookies,
  });

  const { data: fetchSessionData, error: fetchSessionError } =
    await supabase.auth.getSession();

  if (fetchSessionError) {
    console.log(fetchSessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", fetchSessionData.session?.user.id)
    .order("created_at", { ascending: false });

  return data as Song[];
};

export default getSongsByUserId;
