import React, { useState, useEffect } from 'react';
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
            match: { title: query } // Ajustar según el campo de búsqueda
          }
        }
      });
      setResults(response.data.hits.hits);
    } catch (error) {
      console.error("Error fetching data from Elasticsearch", error);
    }
  };

  const handleSearch = () => {
    fetchResults();
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar ofertas..."
      />
      <button onClick={handleSearch}>Buscar</button>
      <ul>
        {results.map((item) => (
          <li key={item._id}>{item._source.title} - {item._source.price}</li> // Ajustar según los campos que tenga en el índice
        ))}
      </ul>
    </div>
  );
};

export default Search;

