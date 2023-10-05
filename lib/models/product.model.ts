import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url: {type: String, required: true, unique: true},
    currency: {type: String, required: true},
    image: {type: String, required: true},
    title: {type: String, required: true},
    currentPrice: {type: Number, required: true},
    originalPrice: {type: Number, required: true},
    discountRate: {type: Number},
    stars: {type: Number},
    isOutOfStock: {type: Boolean, default: false},
    priceHistory:[
        {
            price: {type: Number, required: true},
            date: {type: Date, default: Date.now}
        },
    ],
    lowestPrice: {type: Number},
    highestPrice: {type: Number},
    averageNumber: {type: Number},
    users: [
        {
            email: {type: String, required: true}
        }
    ], default: [],
},{timestamps: true});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
