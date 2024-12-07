export interface Product {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: string;
  image?: Image;
}

export interface Image {
  id: number;
  documentId: string;
  url: string;
}
