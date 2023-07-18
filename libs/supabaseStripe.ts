import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { env } from "@/libs/envParser";
import { stripe } from "@/libs/stripe";
import { toDateTime } from "@/libs/helpers";

import { Price, Product } from "@/types";
import { Database } from "@/types/types_supabase_db";

export const supabaseStripe = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

export const upsertProduct = async (product: Stripe.Product) => {
  const doc: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabaseStripe.from("products").upsert([doc]);
  if (error) throw error;

  console.log(
    `product: {id: ${doc.id}, name: ${doc.name} successfully inserted into database.`
  );
};

export const upsertPrice = async (price: Stripe.Price) => {
  const doc: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  const { error } = await supabaseStripe.from("prices").upsert([doc]);
  if (error) throw error;

  console.log(
    `price: {id: ${doc.id}, type: ${doc.type} successfully inserted into database.`
  );
};

type Customer = {
  email: string;
  uuid: string;
};
export const createOrRetrieveCustomer = async ({ email, uuid }: Customer) => {
  const { data, error } = await supabaseStripe
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

  if (error) throw error;
  if (!data?.stripe_customer_id) {
    const doc: { email?: string; metadata: { supabaseUUID: string } } = {
      email,
      metadata: { supabaseUUID: uuid },
    };

    const customer = await stripe.customers.create(doc);
    const { error: insertError } = await supabaseStripe
      .from("customers")
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);

    if (insertError) throw insertError;

    console.log(`New customer {id: ${customer.id} successfully added`);

    return customer.id;
  }

  return data.stripe_customer_id;
};

const updateCustomerBillingDetails = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  const customer = payment_method.customer as string;
  const { name, address, phone } = payment_method.billing_details;

  if (!name || !address || !phone) return;

  // @ts-ignore
  await stripe.customers.update(customer, { name, address, phone });

  const { error } = await supabaseStripe
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);

  if (error) throw error;
};

export const subscriptionStatusChangeManager = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const { data, error } = await supabaseStripe
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error) throw error;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const subscriptions: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: data.id,
      metadata: subscription.metadata,
      // @ts-ignore
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
    };

  const { error: subscriptionError } = await supabaseStripe
    .from("subscriptions")
    .upsert([subscriptions]);

  if (subscriptionError) throw subscriptionError;

  console.log(`subscription ${subscriptions.id} inserted into database`);

  if (createAction && subscription.default_payment_method && data.id) {
    await updateCustomerBillingDetails(
      data.id,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
  }
};
