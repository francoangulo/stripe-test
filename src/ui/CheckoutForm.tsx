import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

export const CheckoutForm = ({ amount }: { amount: number }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message ?? "Something went wrong");
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <form>
      <PaymentElement />
      <div className="flex justify-center mt-4">
        <button
          className="text-black rounded py-4 px-8 mt-2 bg-slate-300"
          onClick={handleSubmit}
          type="button"
        >
          Submit
        </button>
      </div>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};
