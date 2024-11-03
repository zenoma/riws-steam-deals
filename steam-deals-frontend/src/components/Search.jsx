import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  const search = async () => {
    if (!query) {
      alert("Por favor, ingresa un término de búsqueda.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:9200/steam_deals/_search',
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
      setResults(response.data.hits.hits);
    } catch (error) {
      console.error('Error fetching data from Elasticsearch', error);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar juegos"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={search} className="search-button">Buscar</button>
      <table className="results-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Resumen de Reseñas</th>
            <th>% Reseñas Positivas</th>
            <th>Precio Original</th>
            <th>Precio Final</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((result) => (
              <tr key={result._id}>
                <td>
                  <img
                    src={result._source.img_url} // URL de la imagen
                    alt={result._source.title}
                    style={{ width: '460px', height: '215px', objectFit: 'cover' }} // Aseg�rate de que esto se mantenga
                  />
                </td>
                <td>{result._source.title}</td>
                <td>{result._source.review_summary}</td>
                <td>{result._source.positive_review_pct}</td>
                <td>{result._source.original_price}</td>
                <td>{result._source.final_price}</td>
                <td>
                  <a href={result._source.url} target="_blank" rel="noopener noreferrer">
                    Ver en Steam
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No se encontraron resultados</td>
            </tr>
          )}
        </tbody>      
    </table>
    </div>
  );
};

export default Search;
