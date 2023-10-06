import Product from "@/lib/models/product.model";
import connectToDB from "@/lib/mongoose";
import { scrapAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { generateEmailBody, sendEmail } from "@/nodemailer";
import { NextResponse } from "next/server";

export const maxDuration = 100; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

                // ################### SEND THE EMAILS TO THE USERS WHO 
                // SUBSCRIBED TO THE PRODUCT

                const emailNotifyType = getEmailNotifType(
                    scrapedProd,
                    cProduct
                );
                
                if (emailNotifyType && updatedProduct.users.length > 0) {
                    const productInfo = {
                      title: updatedProduct.title,
                      url: updatedProduct.url,
                    };
                    // Construct emailContent
                    const emailContent = await generateEmailBody(productInfo, emailNotifyType);
                    // Get array of user emails
                    const userEmails = updatedProduct.users.map((user: any) => user.email);
                    // Send email notification
                    await sendEmail(emailContent, userEmails);
                  }
                  return updatedProduct;
            })
        );

        return NextResponse.json({
            message: "OK",
            data: updateProducts
        });
    }catch(error){
        console.log(error);
    }
}