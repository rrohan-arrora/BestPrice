import Product from "@/lib/models/product.model";
import connectToDB from "@/lib/mongoose";
import { scrapAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/lib/utils";

export async function GET(){
    try{
        connectToDB();

        const products = await Product.find({});
        if(!products) throw new Error("no products found");

        // SCRAPE ALL THE STORED PRODUCTS AND UPDATE THEM
        const updateProducts = await Promise.all(
            products.map(async(cProduct) => {
                
                // ################## scrape the product again
                const scrapedProd = await scrapAmazonProduct(cProduct.url);
                if(!scrapedProd) return;

                const updatedPriceHistory = [
                    ...cProduct.priceHistory,
                    {
                        price: scrapedProd.currentPrice,
                    }
                ]

                const uProduct = {
                    ...scrapedProd,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                }

                // update the product in DB
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                    url: uProduct.url,
                    },
                    uProduct
                );

            })
        )

    }catch(error){
        console.log(error);
    }
}