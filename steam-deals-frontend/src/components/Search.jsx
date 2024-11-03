import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`http://localhost:9200/steam_deals/_search`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          query: {
            match: { title: query }
          }
        }
      });
      setResults(response.data.hits.hits);
    } catch (error) {
      console.error("Error fetching data from Elasticsearch", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <div>
        {results.map((item) => (
          <div key={item._id}>
            <h3>{item._source.title}</h3>
            <p>{item._source.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
