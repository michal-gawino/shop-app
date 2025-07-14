import { ProductAvailability } from "../../product-details/product-availability";

export enum ProductView {
    HOME = 'HOME',
    PAGED = 'PAGED'
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  tags: Array<string>;
  brand: string;
  availabilityStatus: ProductAvailability;
  reviews: Array<Review>;
  thumbnail: string;
  images: Array<string>;
}

interface Review {
  rating: number;
  comment: string;
  reviewDate: Date;
  name: string;
  email: string;
}
