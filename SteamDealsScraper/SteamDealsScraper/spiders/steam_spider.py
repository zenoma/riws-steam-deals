import scrapy
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
        sleep(5)  # Wait for the page to load
        page_source = self.scroll_to_load(driver)
        driver.quit()

        yield scrapy.Request(url=self.start_urls[0], callback=self.parse, meta={'page_source': page_source})

    def setup_driver(self):
        """Configure and return a headless Selenium WebDriver."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        service = Service(executable_path='/usr/local/bin/chromedriver')
        return webdriver.Chrome(service=service, options=chrome_options)

    def scroll_to_load(self, driver, scroll_pause_time=5, max_scroll=10, target_elements=200):
        """Scroll the page to load more elements and return the final page source."""
        last_height = driver.execute_script("return document.body.scrollHeight")
        elements_count = 0

        while elements_count < target_elements and max_scroll > 0:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            sleep(scroll_pause_time)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

            scrapy_selector = Selector(text=driver.page_source)
            elements_count = len(scrapy_selector.css('a.search_result_row'))
            max_scroll -= 1

        return driver.page_source

    def parse(self, response):
        page_source = response.meta['page_source']
        
        # Optionally save the page source for debugging
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
        final_price = game.css('div.discount_final_price::text').get()
        img_url = game.css('div.search_capsule img::attr(src)').get()

        # Parse the review summary to get positive review percentage and review count
        positive_review_pct, review_count = self.parse_review_summary(review_summary)

        return {
            'title': title.strip() if title else None,
            'url': url.strip() if url else None,
            'app_id': app_id.strip() if app_id else None,
            'release_date': release_date.strip() if release_date else None,
            'review_summary': review_summary.strip() if review_summary else None,
            'positive_review_pct': positive_review_pct,
            'review_count': review_count,
            'original_price': original_price.strip() if original_price else None,
            'discount_pct': discount_pct.strip() if discount_pct else None,
            'final_price': final_price.strip() if final_price else None,
            'img_url': img_url
        }

    def parse_review_summary(self, review_summary):
        """Extract positive review percentage and review count from the review summary tooltip."""
        if review_summary:
            review_text = Selector(text=review_summary).css('::text').getall()
            positive_review_pct = review_text[1] if len(review_text) > 1 else None
            review_count = review_text[-1] if len(review_text) > 2 else None
        else:
            positive_review_pct = None
            review_count = None

        return positive_review_pct, review_count

