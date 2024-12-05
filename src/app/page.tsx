"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { CheckoutForm } from "./ui/CheckoutForm";
import { getSubCurrency } from "./utils/utils";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Home() {
  const [amount, setAmount] = useState(50);
  const [clientSecret, setClientSecret] = useState<string>("");

  const getProducts = useCallback(() => {
    axios.get("/api/products").then((res) => {
      console.log(res.data);
    });
  }, []);

  const onConfirmAmount = () => {
    axios
      .post("/api/payment_intent", { amount: getSubCurrency(amount) })
      .then((res) => {
        setClientSecret(res.data.client_secret);
      });
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="flex flex-col text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Welcome to My App
        </h1>
        <p className="text-lg md:text-xl text-white/80">
          Start building something amazing
        </p>
        <div className="flex items-center justify-center w-full relative p-28">
          <span className="text-black/50 mr-2 absolute left-32">€</span>
          <input
            className="border-2 border-black/20 rounded-md p-2 pl-8 w-full"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter the amount..."
            prefix="€"
          />
        </div>
        <button onClick={onConfirmAmount}>Log amount</button>
        <div id="checkout" className="w-full max-w-md">
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "night" },
              }}
            >
              <CheckoutForm amount={amount} />
            </Elements>
          )}
        </div>
      </div>
    </main>
  );
}
