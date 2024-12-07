import { getCurrency } from "@/utils/utils";
import Link from "next/link";
import React from "react";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Thanks for your payment!
        </h1>
        <p className="text-lg md:text-xl text-white/80">
          You paid {getCurrency(parseInt(amount))}€
        </p>
      </div>
      <Link href="/">Go back to the home page</Link>
    </section>
  );
}
