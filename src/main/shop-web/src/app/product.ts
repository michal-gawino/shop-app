import { Review } from "./review";
import { ProductAvailability } from "./product-details/product-availability";

export interface Product {
    id: number,
    title: string,
    description: string,
    category: string,
    price: number,
    rating: number,
    tags: Array<string>,
    brand: string,
    availabilityStatus: ProductAvailability,
    reviews: Array<Review>
    thumbnail: string;
    images: Array<string>
}