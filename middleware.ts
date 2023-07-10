import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/types/types_supabase_db";

/*
When using the Supabase client on the server, you must perform extra steps to ensure the user's auth session remains active.
Since the user's session is tracked in a cookie, we need to read this cookie and update it if necessary.

In Next.js Server Components, you can read a cookie, but you can't write back to it.
Middleware on the other hand, allow you to both read and write to cookies.

Next.js Middleware runs immediately before each route is rendered.
We'll use Middleware to refresh the user's session before loading Server Component routes.
*/

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  return res;
}
