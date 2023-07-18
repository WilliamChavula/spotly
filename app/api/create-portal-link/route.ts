import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { getUrl } from "@/libs/helpers";
import { stripe } from "@/libs/stripe";
import { createOrRetrieveCustomer } from "@/libs/supabaseStripe";

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return new NextResponse("User not found", { status: 400 });

    const customer = await createOrRetrieveCustomer({
      email: user?.email ?? "",
      uuid: user?.id ?? "",
    });

    if (!customer) {
      return new NextResponse("Customer not found", { status: 400 });
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getUrl()}/account`,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    return new NextResponse(`Unexpected error occurred - ${error.message}`, {
      status: 500,
    });
  }
}
