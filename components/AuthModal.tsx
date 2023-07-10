"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import useAuthModal from "@/hooks/useAuthModal";
import Modal from "@/components/Modal";

const AuthModal = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { isOpen, onClose } = useAuthModal();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const handleOnChange = (open: boolean) => {
    if (!open) onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      onChange={handleOnChange}
      title={`Welcome Back`}
      description={`Log in to your account`}>
      <Auth
        supabaseClient={supabase}
        magicLink
        providers={["github", "google"]}
        theme={"dark"}
        socialLayout="horizontal"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#22c55e",
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
