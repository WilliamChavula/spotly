"use client";

import React, { createContext, useContext } from "react";
import { ProductsWithPrice } from "@/types";

interface ProductsWithPriceState {
  products: ProductsWithPrice[];
}

const ProductsWithPriceContext = createContext<ProductsWithPriceState | null>(
  null
);

export const useProductsWithPrice = () => useContext(ProductsWithPriceContext);
const ProductsWithPriceProvider = ({
  children,
  products,
}: {
  children: React.ReactNode;
  products: ProductsWithPrice[];
}) => {
  return (
    <ProductsWithPriceContext.Provider value={{ products }}>
      {children}
    </ProductsWithPriceContext.Provider>
  );
};

export default ProductsWithPriceProvider;
