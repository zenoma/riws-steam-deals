import React, { useState } from 'react';
import useElasticSearch from '../../hooks/useElasticSearch';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useElasticSearch();

  const handleSearch = () => {
    search(query);
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
      <button onClick={handleSearch} className="search-button">Buscar</button>

      {loading && <p>Cargando...</p>}
      {error && <p>Error al buscar: {error.message}</p>}

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
                    src={result._source.img_url}
                    alt={result._source.title}
                    style={{ width: '460px', height: '215px', objectFit: 'cover' }}
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
