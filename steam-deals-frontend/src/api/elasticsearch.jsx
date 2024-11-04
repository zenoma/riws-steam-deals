import axios from 'axios';

const ELASTICSEARCH_URL = 'http://localhost:9200';

export const searchGames = async (query, filters) => {
  try {
    const mustQueries = [];

    if (query) {
      mustQueries.push({
        wildcard: {
          title: `*${query.toLowerCase()}*`,
        },
      });
    }

    if (filters.minPositiveReviewPct !== null) {
      mustQueries.push({
        range: {
          positive_review_pct: {
            gte: filters.minPositiveReviewPct,
          },
        },
      });
    }

    if (filters.minReviewCount !== null) {
      mustQueries.push({
        range: {
          review_count: {
            gte: filters.minReviewCount,
          },
        },
      });
    }

    const convertToNumber = (priceString) => {
      if (typeof priceString === 'string') {
        return parseFloat(priceString.replace('Ôé¼', '').replace(',', '.').trim());
      }
      return null;
    };

    if (filters.minPrice !== null) {
      const minPriceNumber = convertToNumber(filters.minPrice);
      if (minPriceNumber !== null) {
        mustQueries.push({
          range: {
            final_price: {
              gte: minPriceNumber,
            },
          },
        });
      }
    }

    if (filters.maxPrice !== null) {
      const maxPriceNumber = convertToNumber(filters.maxPrice);
      if (maxPriceNumber !== null) {
        mustQueries.push({
          range: {
            final_price: {
              lte: maxPriceNumber,
            },
          },
        });
      }
    }

    let queryBody;
    if (mustQueries.length === 0) {
      queryBody = {
        query: {
          match_all: {},
        },
        size: 10000,
      };
    } else {
      queryBody = {
        query: {
          bool: {
            must: mustQueries,
          },
        },
        size: 10000,
      };
    }

    const response = await axios.post(
      `${ELASTICSEARCH_URL}/steam_deals/_search`,
      queryBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.hits.hits;
  } catch (error) {
    console.error('Error fetching data from Elasticsearch', error);
    throw error;
  }
};

