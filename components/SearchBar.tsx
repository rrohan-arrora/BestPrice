"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { validURL } from "@/lib/actions/validURL";
import { FormEvent, useState } from "react";

const SearchBar = () => {

    const [searchPrompt, setSearchPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidLink = await validURL(searchPrompt);
        if(!isValidLink) return alert('Please provide a valid Amazon link');

        try{
            setLoading(true);
            
            //scrap the product page
            const product = await scrapeAndStoreProduct(searchPrompt);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }

    }
    return (
        <form
            className="flex flex-wrap gap-40 mt-12"
            onSubmit={handleSubmit}>
                <input type="text" 
                    value={searchPrompt}
                    placeholder="Enter product link"
                    className="searchbar-input"
                    onChange={e => setSearchPrompt(e.target.value)}/>

                <button 
                    type="submit"
                    className="searchbar-btn"
                    disabled={searchPrompt===""}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
        </form>
    )
}

export default SearchBar