"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { Product } from "../interfaces/products/Product";
import Link from "next/link";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const getProducts = useCallback(() => {
    console.log("franco will get products");
    axios.get<Product[]>("/api/products?image=true").then((res) => {
      setProducts(res.data);
      setLoadingProducts(false);
    });
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  if (loadingProducts) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-gray-800">
        <span className="animate-spin text-white">Loading</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-gray-800">
      <div className="flex gap-16">
        {products.map(({ id, name, description, price, image }) => (
          <Link
            target="_self"
            href={`/product/${id}`}
            key={id}
            className="flex gap-2"
          >
            <div className="flex flex-col gap-2 bg-slate-300 rounded p-4">
              <h1>{name}</h1>
              <p>{description}</p>
              <p>{price}</p>
            </div>
            {image && (
              <picture className="w-24 h-24 bg-slate-300 rounded">
                <img
                  className="w-24 bg-slate-300 rounded"
                  src={image.url}
                  alt={name}
                  width={100}
                  height={100}
                />
              </picture>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
