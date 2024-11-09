from elasticsearch import Elasticsearch, exceptions
from datetime import datetime

class ElasticsearchPipeline:
    def open_spider(self, spider):
        self.es = Elasticsearch("http://localhost:9200")
        if not self.es.indices.exists(index="steam_deals"):
            self.create_index()

    def create_index(self):
        mapping = {
            "mappings": {
                "properties": {
                    "app_id": {"type": "keyword"},
                    "title": {"type": "text"},
                    "url": {"type": "keyword"},
                    "release_day_month": {"type": "text"},  
                    "release_year": {"type": "keyword"},
                    "review_summary": {"type": "keyword"},
                    "positive_review_pct": {"type": "integer"},
                    "review_count": {"type": "integer"},
                    "original_price": {"type": "text"},
                    "discount_pct": {"type": "integer"},
                    "final_price": {"type": "double"},
                    "img_url": {"type": "text"},
                    "timestamp": {"type": "date"}
                }
            }
        }
        
        try:
            self.es.indices.create(index="steam_deals", body=mapping)
        except exceptions.RequestError as e:
            print(f"Error al crear el índice: {e}")

    def close_spider(self, spider):
        pass

    def process_item(self, item, spider):
        self.es.index(
             index="steam_deals",
             id=item.get('app_id'), 
             body={
                "title": item.get('title'),
                "url": item.get('url'),
                "app_id": item.get('app_id'),
                "release_day_month": item.get('release_day_month'),  
                "release_year": item.get('release_year'),
                "review_summary": item.get('review_summary'),
                "positive_review_pct": item.get('positive_review_pct'),
                "review_count": item.get('review_count'),
                "original_price": item.get('original_price'),
                "discount_pct": item.get('discount_pct'),
                "final_price": item.get('final_price'),
                "img_url": item.get('img_url'),
                "timestamp": datetime.now().isoformat() 
             }
        )
        return item

