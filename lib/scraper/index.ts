"use server";

import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice } from "../utils";

export async function scrapAmazonProduct(url:string) {
    if(!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PSWD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $('#productTitle').text().trim();
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
    );
    const originalPrice = extractPrice(
      $('.a-price.a-text-price span.a-offscreen')
    );

    const outOfStock = $('#availability span.a-declarative span.a-size-medium').text().trim().toLowerCase() === "currently unavailable.";
    
    const images = $("#landingImage").attr("data-a-dynamic-image") || "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));
    
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
    
    const startRating = $('#acrPopover span.a-size-base.a-color-base').first().text().trim();
    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      discountRate: Number(discountRate),
      stars: startRating,
      isOutOfStock: outOfStock,
      priceHistory: [],
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }

    return data;
  }catch(error: any){
    console.log(error);
  }
}