import puppeteer from "puppeteer";

export async function searchGoogle(query: string): Promise<string[]> {
    console.log("Searching Google for:", query);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 60000 });
    
    const links = await page.evaluate(() => {
        const results: string[] = [];
        const elements = document.querySelectorAll("div.yuRUbf a");
        
        elements.forEach((element, index) => {
            if (index < 5) { // Limit to first 5 results
                const url = element.getAttribute("href");
                if (url) results.push(url);
            }
        });
        return results;
    });

    await browser.close();
    return links;
}
