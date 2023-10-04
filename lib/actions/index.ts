import { scrapAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string) {
    if(!productUrl) return;

    try{
        const scrappedProduct = await scrapAmazonProduct(productUrl);
        if(!scrappedProduct) return;


    }catch(error: any){
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}