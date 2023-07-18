import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ProductsWithPrice } from "@/types";

const getActiveProductsWithPrices = async (): Promise<ProductsWithPrice[]> => {
  const supabase = createServerActionClient({
    cookies,
  });
  const { data } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  return data as ProductsWithPrice[];
};

export default getActiveProductsWithPrices;
