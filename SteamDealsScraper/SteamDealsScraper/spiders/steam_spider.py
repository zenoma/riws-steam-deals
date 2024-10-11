import scrapy

class SteamSpider(scrapy.Spider):
    name = 'steam_spider'
    allowed_domains = ['store.steampowered.com']
    start_urls = ['https://store.steampowered.com/search/?specials=1']

    def parse(self, response):
        # Encuentra todos los elementos <a> que contienen los nombres de los juegos
        game_links = response.css('a.search_result_row')

        # Itera sobre los elementos encontrados y obt┬én los nombres de los juegos
        for game in game_links:
            title = game.css('span.title::text').get()
            if title:
                yield {
                    'title': title.strip()
                }

