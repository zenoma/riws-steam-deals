import scrapy
from scrapy_selenium import SeleniumRequest

class SteamSpider(scrapy.Spider):
    name = 'steam_spider'
    allowed_domains = ['store.steampowered.com']
    start_urls = ['https://store.steampowered.com/search/?specials=1']

    def start_requests(self):
        yield SeleniumRequest(url=self.start_urls[0], callback=self.parse)

    def parse(self, response):
        with open('steam_search_results.html', 'w', encoding='utf-8') as f:
            f.write(response.text)

        game_links = response.css('a.search_result_row')

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
