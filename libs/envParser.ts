import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().nonempty(),
  STRIPE_SECRET_KEY: z.string().nonempty(),
  STRIPE_WEBHOOK_SECRET: z.string().nonempty(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().nonempty(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().nonempty(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);
