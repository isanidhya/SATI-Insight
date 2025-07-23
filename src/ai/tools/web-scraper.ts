
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes a website for its text content.
 * @param url The URL of the website to scrape.
 * @returns The text content of the website.
 */
export async function scrapeWebsite(url: string): Promise<string> {
  if (!url) {
    return '';
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(data);
    // Remove script and style elements
    $('script, style').remove();
    return $('body').text();
  } catch (error) {
    console.error(`Error scraping website: ${url}`, error);
    return ''; // Return empty string on error
  }
}
