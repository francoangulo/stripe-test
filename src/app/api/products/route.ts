import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const GET = async () => {
  try {
    const products = await stripe.products.list({
      limit: 3,
    });
    return NextResponse.json({
      products: products.data,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
