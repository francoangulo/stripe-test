import { ProductResponse } from "@/interfaces/products/ProductResponse";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
const { STRAPI_HOST, STRAPI_API_TOKEN } = process.env;

export const GET = async (request: NextRequest) => {
  const withImage = request.nextUrl.searchParams.get("image") === "true";
  const productId = request.nextUrl.searchParams.get("productId");

  let url = `${STRAPI_HOST}/api/products`;
  const params = [];

  if (withImage) {
    params.push("populate[image][fields][1]=url");
  }

  if (productId) {
    params.push(`filters[id][$eq]=${productId}`);
  }

  if (params.length > 0) {
    url += "?" + params.join("&");
  }

  try {
    const response = await axios.get<ProductResponse>(url, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });
    const { data } = response.data;
    const products = data.map((product) => {
      return {
        ...product,
        image: product.image?.url
          ? { url: new URL(product.image.url, STRAPI_HOST).toString() }
          : null,
      };
    });
    return NextResponse.json(products);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export const GET = async () => {
//   try {
//     const products = await stripe.products.list({
//       limit: 3,
//     });
//     return NextResponse.json({
//       products: products.data,
//     });
//   } catch (err) {
//     const error = err as Error;
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// };
