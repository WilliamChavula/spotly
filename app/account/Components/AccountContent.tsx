"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useStripeSubscriptionModal from "@/hooks/useStripeSubscriptionModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";

import Button from "@/components/Button";

const AccountContent = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const subscriptionModal = useStripeSubscriptionModal();
  const { isLoading, user, subscription } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const redirectToPortal = async () => {
    setLoading(true);

    try {
      const { url, error } = await postData({ url: "/api/create-portal-link" });

      window.location.assign(url);
    } catch (error) {
      if (error) toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-7 px-6">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p>No active subscriptions</p>
          <Button className="w-72" onClick={subscriptionModal.onOpen}>
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>
            You are current subscription is{" "}
            <b>{subscription?.prices?.products?.name}</b> plan
          </p>
          <Button
            className="w-72"
            onClick={redirectToPortal}
            disabled={isLoading || loading}>
            Open Customer Portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
