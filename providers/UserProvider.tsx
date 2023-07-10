"use client";

import React from "react";
import { CustomUserContextProvider } from "@/hooks/useUser";

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  return <CustomUserContextProvider>{children}</CustomUserContextProvider>;
};

export default UserProvider;
