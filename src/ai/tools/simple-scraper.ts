
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * A simple web scraper that fetches the text content of a given URL.
 * @param url The URL to scrape.
 * @returns The text content of the page, or an empty string if fetching fails.
 */
export async function simpleScraper(url: string): Promise<string> {
  if (!url) {
    return '';
  }

  console.log(`Scraping URL: ${url}`);
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    $('script, style, noscript, nav, footer, header').remove();
    return $('body').text() || '';
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return `Could not retrieve content from ${url}.`;
  }
}
