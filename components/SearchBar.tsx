"use client";

import validURL from "@/lib/actions/validURL";
import { FormEvent, useState } from "react";

const SearchBar = () => {

    const [searchPrompt, setSearchPrompt] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidLink = validURL(searchPrompt);
        if(!isValidLink) return alert('Please provide a valid Amazon link');
        
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
                    className="searchbar-btn">
                    Search
                </button>
        </form>
    )
}

export default SearchBar