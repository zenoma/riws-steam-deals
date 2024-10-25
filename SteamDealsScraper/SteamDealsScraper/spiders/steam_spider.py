import scrapy
import os
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
        # Configure Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--window-size=1920x1080")
        chrome_options.add_argument("--headless")  # Run Chrome in headless mode

        # Set the path to your ChromeDriver
        service = Service(executable_path='/usr/local/bin/chromedriver')
        driver = webdriver.Chrome(service=service, options=chrome_options)

        driver.get(self.start_urls[0])
        sleep(5)  # Wait for the page to load

        # Scroll to load more content
        last_height = driver.execute_script("return document.body.scrollHeight")
        SCROLL_PAUSE_TIME = 5
        MAX_SCROLL = 10
        elements_count = 0
        TARGET_ELEMENTS = 200  # Stop after extracting 200 elements

        while elements_count < TARGET_ELEMENTS and MAX_SCROLL > 0:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            sleep(SCROLL_PAUSE_TIME)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

            # Update the count of elements
            scrapy_selector = Selector(text=driver.page_source)
            elements_count = len(scrapy_selector.css('a.search_result_row'))
            MAX_SCROLL -= 1

        # After scrolling, get the page source and close the driver
        page_source = driver.page_source
        driver.quit()

        # Pass the page source to the parse method directly
        yield scrapy.Request(url=self.start_urls[0], callback=self.parse, meta={'page_source': page_source})

    def parse(self, response):
        # Get the page source from the meta data
        page_source = response.meta['page_source']
        
        # Write the page source to an HTML file
        with open('steam_search_results.html', 'w', encoding='utf-8') as f:
            f.write(page_source)

        scrapy_selector = Selector(text=page_source)
        game_links = scrapy_selector.css('a.search_result_row')

        for game in game_links:
            title = game.css('span.title::text').get()
            url = game.css('::attr(href)').get()
            app_id = game.css('::attr(data-ds-appid)').get()
            release_date = game.css('div.search_released::text').get()
            review_score = game.css('span.search_review_summary::attr(data-tooltip-html)').get()
            final_price = game.css('div.discount_final_price::text').get()
            original_price = game.css('div.discount_original_price::text').get()
            discount_pct = game.css('div.discount_pct::text').get()

            yield {
                'title': title.strip() if title else None,
                'url': url.strip() if url else None,
                'app_id': app_id.strip() if app_id else None,
                'release_date': release_date.strip() if release_date else None,
                'review_score': review_score.strip() if review_score else None,
                'final_price': final_price.strip() if final_price else None,
                'original_price': original_price.strip() if original_price else None,
                'discount_pct': discount_pct.strip() if discount_pct else None,
            }

