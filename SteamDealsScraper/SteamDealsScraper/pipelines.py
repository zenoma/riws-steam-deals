from elasticsearch import Elasticsearch
from datetime import datetime

class ElasticsearchPipeline:
    def open_spider(self, spider):
        # Inicia la conexión con Elasticsearch al abrir la spider
        self.es = Elasticsearch("http://localhost:9200")

    def close_spider(self, spider):
        # Cierra la conexión con Elasticsearch cuando la spider termina
        self.es.transport.close()

    def process_item(self, item, spider):
        # Inserta cada item en Elasticsearch
        self.es.index(index="steam_deals", id=item.get('app_id'), body={
            "title": item.get('title'),
            "url": item.get('url'),
            "app_id": item.get('app_id'),
            "release_date": item.get('release_date'),
            "review_summary": item.get('review_summary'),
            "positive_review_pct": item.get('positive_review_pct'),
            "review_count": item.get('review_count'),
            "original_price": item.get('original_price'),
            "discount_pct": item.get('discount_pct'),
            "final_price": item.get('final_price'),
            "img_url": item.get('img_url'),
            "timestamp": datetime.now()
        })
        return item

