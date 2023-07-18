"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}
const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const handleOnClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    router.push(href);
  };

  return (
    <button
      onClick={handleOnClick}
      className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4">
      <div className="min-h-[64px] min-w-[64px] relative">
        <Image
          src={image}
          alt="Image of a heart"
          fill
          className="object-cover"
        />
      </div>
      <p className="font-medium truncate py-5">{name}</p>
      <div className="absolute right-5 opacity-0 rounded-full flex items-center justify-center bg-green-600 p-4 drop-shadow-md group-hover:opacity-80 hover:scale-110 transition ">
        <FaPlay className="text-black" />
      </div>
    </button>
  );
};

export default ListItem;
