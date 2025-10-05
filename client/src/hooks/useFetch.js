import { useEffect, useState } from "react";

export function useFetch(fetchFunction) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false); // Nuevo estado para recargas
  const [selectedDataId, setSelectedDataId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFunction();
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, reload]); // Agrega "reload" como dependencia
  // Función para forzar recarga
  const triggerReload = () => setReload((prev) => !prev);

  return {
    data,
    loading,
    error,
    triggerReload,
    selectedDataId,
    setSelectedDataId,
  };
}
