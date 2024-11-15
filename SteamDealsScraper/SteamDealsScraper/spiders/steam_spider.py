import scrapy
import re
from time import sleep
from scrapy.selector import Selector
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

class SteamDealsSpider(scrapy.Spider):
    name = "steam_spider"
    allowed_domains = ['store.steampowered.com']
    start_urls = ['https://store.steampowered.com/search/?specials=1']

    def start_requests(self):
        driver = self.setup_driver()
        driver.get(self.start_urls[0])
        sleep(5)
        page_source = self.scroll_to_load(driver)
        driver.quit()

        yield scrapy.Request(url=self.start_urls[0], callback=self.parse, meta={'page_source': page_source})

    def setup_driver(self):
        """Configure and return a headless Selenium WebDriver."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        service = Service(executable_path='/usr/local/bin/chromedriver')
        return webdriver.Chrome(service=service, options=chrome_options)

    def scroll_to_load(self, driver, scroll_pause_time=5, max_scroll=20):
        """Scroll the page to load more elements and return the final page source."""
        last_height = driver.execute_script("return document.body.scrollHeight")

        while max_scroll > 0:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            sleep(scroll_pause_time)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

            max_scroll -= 1

        return driver.page_source

    def parse(self, response):
        page_source = response.meta['page_source']
        
        self.save_page_source(page_source)

        scrapy_selector = Selector(text=page_source)
        game_links = scrapy_selector.css('a.search_result_row')

        for game in game_links:
            yield self.extract_game_data(game)

    def save_page_source(self, page_source):
        """Save the page source to an HTML file for debugging purposes."""
        with open('steam_search_results.html', 'w', encoding='utf-8') as f:
            f.write(page_source)

    def extract_game_data(self, game):
         """Extract and clean data from each game element."""
         title = game.css('span.title::text').get()
         url = game.css('::attr(href)').get()
         app_id = game.css('::attr(data-ds-appid)').get()
         release_date = game.css('div.search_released::text').get()
         review_summary = game.css('span.search_review_summary::attr(data-tooltip-html)').get()
         original_price = game.css('div.discount_original_price::text').get()
         discount_pct = game.css('div.discount_pct::text').get()
         final_price_str = game.css('div.discount_final_price::text').get()
         
         if final_price_str and final_price_str.lower() != 'free':
             final_price_clean = final_price_str[:-1].replace(',', '.').strip()
             try:
                 final_price_clean = float(final_price_clean)
             except ValueError:
                 final_price_clean = None
         elif final_price_str and final_price_str.lower() == 'free':
             final_price_clean = 0.0
         else:
             final_price_clean = None

         if discount_pct:
             discount_pct_clean = discount_pct.replace('%', '').strip()
             try:
                 discount_pct_clean = int(discount_pct_clean)  
             except ValueError:
                 discount_pct_clean = None
         else:
             discount_pct_clean = None
         
         if release_date:
             release_parts = release_date.split(',')  
             if len(release_parts) == 2:
                 day_month = release_parts[0].strip()  
                 year = release_parts[1].strip()  
             else:
                 day_month = release_date.strip()  
                 year = None
         else:
             day_month = None
             year = None

         img_url = game.css('div.search_capsule img::attr(src)').get()
         
         summary_text, positive_review_pct, review_count = self.parse_review_summary(review_summary)
         
         return {
             'title': title.strip() if title else None,  
             'url': url.strip() if url else None, 
             'app_id': app_id.strip() if app_id else None,  
             'release_day_month': day_month,  
             'release_year': year,  
             'review_summary': summary_text,
             'positive_review_pct': positive_review_pct if positive_review_pct else None,  
             'review_count': review_count if review_count else None,  
             'original_price': original_price.strip() if original_price else None,  
             'discount_pct': discount_pct_clean, 
             'final_price': final_price_clean, 
             'img_url': self.replace_img_name(img_url)  
         }
        
    def parse_review_summary(self, review_summary):
            """Extract review summary text, positive review percentage, and review count from the tooltip."""
            if review_summary:
               
                summary_text_match = re.search(r'^(.*?)<br>', review_summary)
                summary_text = summary_text_match.group(1) if summary_text_match else None
    
                percentage_match = re.search(r'(\d+)%', review_summary)
                count_match = re.search(r'(\d[\d,]*) user reviews', review_summary)
    
                positive_review_pct = percentage_match.group(1) if percentage_match else None
                review_count = count_match.group(1).replace(',', '') if count_match else None  
    
            else:
                summary_text = None
                positive_review_pct = None
                review_count = None
            return summary_text, positive_review_pct, review_count


    def replace_img_name(self, img_url):
        """
        Cambia el nombre del archivo de imagen de 'capsule_sm_120' a 'header'
        """
        pattern = r"(/apps/\d+/)(?:[a-f0-9]+/)?capsule_sm_120\.jpg"
        replacement = r"\1header.jpg"
        new_url = re.sub(pattern, replacement, img_url, flags=re.IGNORECASE)
        
        return new_url
