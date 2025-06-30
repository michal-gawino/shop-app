import { Review } from "./review";

export interface Product {
    id: number,
    title: string,
    description: string,
    category: string,
    price: number,
    rating: number,
    tags: Array<string>,
    brand: string,
    availabilityStatus: string,
    reviews: Array<Review>
    thumbnail: string;
    images: Array<string>
}