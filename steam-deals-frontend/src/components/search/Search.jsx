// src/components/Search.js
import React, { useState } from 'react';
import useElasticSearch from '../../hooks/useElasticSearch';
import './Search.css'; // Estilos espec°ficos del componente
import '../../App.css'; // Estilos generales de la aplicaci¢n

const Search = () => {
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useElasticSearch();

  const handleSearch = () => {
    search(query);
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

      {loading && <p className="loading-message">Cargando...</p>}
      {error && <p className="error-message">Error al buscar: {error.message}</p>}

      <table className="results-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>T√≠tulo</th>
            <th>Resumen de Rese√±as</th>
            <th>% Rese√±as Positivas</th>
            <th>N√∫mero de Rese√±as</th>
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
                    style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Ajustar tama§o de imagen
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
              <td colSpan="7">No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Search;
