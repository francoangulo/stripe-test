import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: "price_1QSPIHKBMVRMi6hMdqguQkKf",
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${req.headers.get(
        "origin"
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    const error = err as Error;
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    if (!req.nextUrl.searchParams.get("session_id")) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }
    const session = await stripe.checkout.sessions.retrieve(
      req.nextUrl.searchParams.get("session_id")!
    );

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
