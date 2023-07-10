"use client";

import { Toaster } from "react-hot-toast";

const ToastProvider = () => (
  <Toaster
    toastOptions={{
      style: {
        background: "#333",
        color: "#fff",
      },
    }}
  />
);

export default ToastProvider;
