import { useState } from 'react';
import { searchGames } from '../api/elasticsearch';

const useElasticSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = async (query, filters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await searchGames(query, filters);
            setResults(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { results, loading, error, search };
};

export default useElasticSearch;

