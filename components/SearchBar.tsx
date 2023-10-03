"use client";

const SearchBar = () => {
    const handleSubmit = () => {

    }
    return (
        <form
            className="flex flex-wrap gap-40 mt-12"
            onSubmit={handleSubmit}>
                <input type="text" 
                        placeholder="Enter product link"
                        className="searchbar-input"/>

                <button 
                    type="submit"
                    className="searchbar-btn">
                    Search
                </button>
        </form>
    )
}

export default SearchBar