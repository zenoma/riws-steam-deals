import React, { useState } from 'react';
import useElasticSearch from '../../hooks/useElasticSearch';
import './Search.css';
import '../../App.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [minPositiveReviewPct, setMinPositiveReviewPct] = useState('');
  const [minReviewCount, setMinReviewCount] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { results, loading, error, search } = useElasticSearch();

  const handleSearch = () => {
    const filters = {
      minPositiveReviewPct: minPositiveReviewPct ? parseInt(minPositiveReviewPct, 10) : null,
      minReviewCount: minReviewCount ? parseInt(minReviewCount, 10) : null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    };
    search(query, filters);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar juegos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Buscar</button>
      </div>

      <div className="filters">
        <div className="filter">
          <label htmlFor="minPositiveReviewPct">Mín. % Reseñas Positivas:</label>
          <input
            type="number"
            id="minPositiveReviewPct"
            value={minPositiveReviewPct}
            onChange={(e) => setMinPositiveReviewPct(e.target.value)}
            placeholder="Ej: 70"
            min="0"
            max="100"
          />
        </div>
        <div className="filter">
          <label htmlFor="minReviewCount">Mín. Número de Reseñas:</label>
          <input
            type="number"
            id="minReviewCount"
            value={minReviewCount}
            onChange={(e) => setMinReviewCount(e.target.value)}
            placeholder="Ej: 10"
            min="0"
          />
        </div>
        <div className="filter">
          <label htmlFor="minPrice">Precio Mínimo:</label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Ej: 10.00"
            min="0"
            step="0.01"
          />
        </div>
        <div className="filter">
          <label htmlFor="maxPrice">Precio Máximo:</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Ej: 50.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {loading && <p className="loading-message">Cargando...</p>}
      {error && <p className="error-message">Error al buscar: {error.message}</p>}

      <table className="results-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Resumen de Reseñas</th>
            <th>% Reseñas Positivas</th>
            <th>Número de Reseñas</th>
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
                    style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                  />
                </td>
                <td>{result._source.title}</td>
                <td>{result._source.review_summary}</td>
                <td>{result._source.positive_review_pct}</td>
                <td>{result._source.review_count}</td>
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
              <td colSpan="8">No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Search;

