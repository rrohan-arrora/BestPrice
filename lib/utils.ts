import { PriceHistoryItem, Product } from "@/types";

export function extractPrice(...elements: any): string {
    for(const element of elements){
        const priceText = element.text().trim();

        if(priceText) return priceText.replace(/[^\d.]/g, '');
    }

    return "";
}

export function extractCurrency(element: any) {
    const currencyText = element.text().trim().slice(0, 1);

    return currencyText ? currencyText : "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice.price) {
        highestPrice = priceList[i];
    }
}

return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
let lowestPrice = priceList[0];

for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
    lowestPrice = priceList[i];
    }
}

return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const total = priceList.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price;
    }, 0);

    const average = total / priceList.length;

    return average;
}

export function formatNumber(price: number ) : number {
    const formattedPrice = Number(price?.toFixed(2).replace(/\.0*$/, ''));

    return formattedPrice;
}

export const getEmailNotifType = (
    scrapedProduct: Product,
    currentProduct: Product
  ) => {
    const lowestPrice = getLowestPrice(currentProduct.priceHistory);
  
    if (scrapedProduct.currentPrice < lowestPrice) {
      return "LOWEST_PRICE";
    }
    if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
      return "CHANGE_OF_STOCK";
    }
  
    return null;
  };
  

