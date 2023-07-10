"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { IconType } from "react-icons";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";

import Button from "@/components/Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CaretIconProps {
  CaretIcon: IconType;
  callback: VoidFunction;
}

const CaretButtonComponent: React.FC<CaretIconProps> = ({
  CaretIcon,
  callback,
}) => {
  return (
    <button
      onClick={callback}
      className="rounded-full bg-black flex items-center justify-center hover:opacity-80 transition">
      <CaretIcon size={35} className="text-white" />
    </button>
  );
};
const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    // Todo: reset any playing songs
    router.refresh();

    if (error) toast.error(error.message);
  };
  return (
    <div
      className={twMerge(
        "h-fit bg-gradient-to-b from-emerald-900 p-6",
        className
      )}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <CaretButtonComponent
            CaretIcon={RxCaretLeft}
            callback={() => router.back()}
          />
          <CaretButtonComponent
            CaretIcon={RxCaretRight}
            callback={() => router.forward()}
          />
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="flex items-center justify-center bg-white rounded-full hover:opacity-80 transition p-2">
            <HiHome className="text-black" size={20} />
          </button>
          <button className="flex items-center justify-center bg-white rounded-full hover:opacity-80 transition p-2">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="bg-white px-4 py-1">
                Logout
              </Button>
              <Button
                onClick={() => router.push("/account")}
                className="bg-white">
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-transparent text-neutral-300 font-medium">
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-white px-6 py-2">
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
