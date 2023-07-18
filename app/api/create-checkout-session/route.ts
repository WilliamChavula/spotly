import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { getUrl } from "@/libs/helpers";
import { stripe } from "@/libs/stripe";
import { createOrRetrieveCustomer } from "@/libs/supabaseStripe";

export async function POST(req: Request) {
  const { price, quantity = 1, metadata = {} } = await req.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const customer = await createOrRetrieveCustomer({
      email: user?.email || "",
      uuid: user?.id || "",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer,
      mode: "subscription",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      success_url: `${getUrl()}/account`,
      cancel_url: `${getUrl()}`,
      line_items: [{ quantity, price: price.id }],
      subscription_data: { trial_from_plan: true, metadata },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return new NextResponse(`Unexpected error occurred - ${error.message}`, {
      status: 500,
    });
  }
}
