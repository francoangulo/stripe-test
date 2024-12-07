"use client";

import { Product } from "@/interfaces/products/Product";
import { CheckoutForm } from "@/ui/CheckoutForm";
import { getSubCurrency } from "@/utils/utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function ProductPage() {
  const params = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string>("");

  const getProducts = async ({ productId }: { productId: string }) => {
    const response = await axios.get(
      `/api/products?productId=${productId}&image=true`
    );
    const data = response.data[0];
    setProduct(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getProducts({ productId: params.productId });
    return () => {
      setProduct(null);
    };
  }, [params.productId]);

  const onBuy = () => {
    if (!product?.price) return;
    axios
      .post("/api/payment_intent", { amount: getSubCurrency(product.price) })
      .then((res) => {
        console.log("franco the res --> ", JSON.stringify(res.data, null, 4));
        setClientSecret(res.data.client_secret);
      });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-gray-800">
        <span className="animate-spin text-white">Loading</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-gray-800">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-2 bg-slate-300 rounded p-4">
          <h1>{product?.name}</h1>
          <p>{product?.description}</p>
          <p>{product?.price}</p>
          {product?.image && (
            <picture className="w-24 h-24 bg-slate-300 rounded">
              <img
                className="w-24 bg-slate-300 rounded"
                src={product.image.url}
                alt={product.name}
              />
            </picture>
          )}
          <button onClick={onBuy}>BUY</button>
        </div>
        {product?.price && clientSecret && (
          <div className="flex flex-col gap-2 bg-slate-900 rounded p-4">
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "night" } }}
            >
              <CheckoutForm amount={getSubCurrency(product.price)} />
            </Elements>
          </div>
        )}
      </div>
    </main>
  );
}
