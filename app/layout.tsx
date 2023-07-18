import "./globals.css";
import React from "react";
import { Figtree } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToastProvider from "@/providers/ToastProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";
import SessionUserSongProvider from "@/providers/SessionUserSongProvider";
import ProductsProvider from "@/providers/ProductsWithPriceProvider";
import Player from "@/components/Player";

import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";
import ProductsWithPriceProvider from "@/providers/ProductsWithPriceProvider";

const font = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Spotify Clone",
  description: "Listen to music",
};

const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUserSongs = await getSongsByUserId();
  const initialProducts = await getActiveProductsWithPrices();
  return (
    <html lang="en">
      <body className={font.className}>
        <ToastProvider />
        <SupabaseProvider>
          <UserProvider>
            <ProductsWithPriceProvider products={initialProducts}>
              <ModalProvider />
            </ProductsWithPriceProvider>
            <SessionUserSongProvider userSongs={sessionUserSongs}>
              <Sidebar>{children}</Sidebar>
              <Player />
            </SessionUserSongProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
