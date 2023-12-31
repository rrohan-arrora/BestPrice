'use server';

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import connectToDB from "../mongoose";
import { scrapAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "@/nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
    if(!productUrl) return;

    try{
        connectToDB();

        const scrappedProduct = await scrapAmazonProduct(productUrl);
        if(!scrappedProduct) return;

        let product = scrappedProduct;
        const existingProduct = await Product.findOne({url: scrappedProduct.url});

        if(existingProduct){
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                {price: scrappedProduct.currentPrice}
            ]

            product = {
                ...scrappedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory)
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            { url: scrappedProduct.url },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/products/${newProduct._id}`); // we need to revalidate this path in order to show current changes
    }catch(error: any){
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

export async function getProductById(productId: string){
    try{
      const product = await Product.findOne({_id: productId});
  
      if(!product) return null;
  
      return product;
    }catch(error: any){
      console.log(error);
    }
}

export async function getAllProducts(){
    try{
        connectToDB();

        const products = await Product.find();
        
        return products;
    }catch(error: any){
        console.log(error);
    }
}

export async function otherTrendingProducts(productId: string){
    try{
        connectToDB();

        const currentProduct = Product.findById(productId);
        if(!currentProduct) return null;

        const otherTrendingProducts = await Product.find({
            _id: {$ne: productId}
        }).limit(3);

        return otherTrendingProducts;
    }catch(error: any){
        console.log(error);
    }
}

export async function addUserEmailToProduct(productId: string, userEmail:string){
    try {
        const product = await Product.findById(productId);
    
        if(!product) return;
    
        const userExists = product.users.some((user: User) => user.email === userEmail);
    
        if(!userExists) {
          product.users.push({ email: userEmail });
    
          await product.save();

          const emailContent = await generateEmailBody(product, "WELCOME");

          await sendEmail(emailContent, [userEmail]);
        }
      } catch (error) {
        console.log(error);
      }
}

