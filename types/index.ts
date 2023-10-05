export type PriceHistoryItem = {
    price: number
}

export type User = {
    email: string;
};

export type Product = {
    _id?: string;
    url: string;
    currency: string;
    image: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    priceHistory: PriceHistoryItem[] | [];
    highestPrice: number;
    lowestPrice: number;
    averagePrice: number;
    discountRate: number;
    stars: number;
    isOutOfStock: Boolean;
    users?: User[];
};