import axios from 'axios';

const ELASTICSEARCH_URL = 'http://localhost:9200';

export const searchGames = async (query) => {
  try {
    const response = await axios.post(
      `${ELASTICSEARCH_URL}/steam_deals/_search`,
      {
        query: {
          wildcard: {
            title: `*${query.toLowerCase()}*`,
          },
        },
      },
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

