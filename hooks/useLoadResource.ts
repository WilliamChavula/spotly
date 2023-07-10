import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadResource = (resourcePath: string, resource: string) => {
  const supabaseClient = useSupabaseClient();

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from(`${resource}`).getPublicUrl(resourcePath);

  return publicUrl;
};

export default useLoadResource;
