import axios from "axios";
import { convertToSearchablePhrase } from "./searchPhraseGenerator";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

async function fetchSearchResults(query: string) {
    //const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}`;
    const url = `https://serpapi.com/search.json?engine=google&q=${query}&hl=en&gl=us&google_domain=google.com&num=10&start=0&safe=active&api_key=${SERPAPI_KEY}`
    try {
        const response = await axios.get(url);
        return response.data.organic_results || [];
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
}

export async function searchGoogle(query: string): Promise<any[]> {
    console.log("Searching Google for:", query);
    let items = await fetchSearchResults(query);

    while (!items.length) {
        console.log("No results found. Regenerating query...");
        query = await convertToSearchablePhrase(query);
        items = await fetchSearchResults(query);
    }
    
    // const filteredItems = items.filter((item: any)=> !item.link.includes('ad'));
    const filteredItems = items;
    return filteredItems.slice(0, 4);
}
