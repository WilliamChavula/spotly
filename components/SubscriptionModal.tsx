"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { postData } from "@/libs/helpers";
import { useProductsWithPrice } from "@/providers/ProductsWithPriceProvider";
import useStripeSubscriptionModal from "@/hooks/useStripeSubscriptionModal";
import { useUser } from "@/hooks/useUser";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { Price } from "@/types";
import { getStripe } from "@/libs/stripeClient";

const formatPrice = (currency?: string, unit_amount?: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format((unit_amount || 0) / 100);
};
const SubscriptionModal = () => {
  const [currentlyLoadingPriceId, setCurrentlyLoadingPriceId] =
    useState<string>();
  const { user, isLoading, subscription } = useUser();
  const { products } = useProductsWithPrice()!;
  const subscriptionModal = useStripeSubscriptionModal();

  const onToggleSubscriptionModal = (open: boolean) => {
    if (!open) subscriptionModal.onClose();
  };

  const handleSubscribeToPlan = async (price: Price) => {
    setCurrentlyLoadingPriceId(price.id);

    if (!user) {
      setCurrentlyLoadingPriceId(undefined);
      return toast.error("Please log in to subscribe");
    }

    if (subscription) {
      setCurrentlyLoadingPriceId(undefined);
      return toast("You are already subscribed to plan.");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      const stripeClient = await getStripe();
      stripeClient?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setCurrentlyLoadingPriceId(undefined);
    }
  };
  let content = <p className="text-center">Subscription</p>;
  if (products?.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length)
            return <p key={product.id}>No prices available</p>;

          return product.prices.map((price) => (
            <Button
              key={price.id}
              className="m-2 active:outline-none"
              onClick={() => handleSubscribeToPlan(price)}
              disabled={isLoading || price.id === currentlyLoadingPriceId}>
              Subscribe to {product.name} for{" "}
              {formatPrice(price.currency, price.unit_amount)}
            </Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <p className="text-center">You are already subscribed.</p>;
  }

  return (
    <Modal
      title="Spotly Premium Service"
      description="Listen to over 1 million songs uninterrupted"
      isOpen={subscriptionModal.isOpen}
      onChange={onToggleSubscriptionModal}>
      {content}
    </Modal>
  );
};

export default SubscriptionModal;
