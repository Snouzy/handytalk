import { useState, useEffect, useCallback } from "react";
import { getApiKey, saveApiKey, removeApiKey } from "../lib/storage";

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApiKey().then((key) => {
      setApiKey(key);
      setLoading(false);
    });
  }, []);

  const save = useCallback(async (key: string) => {
    await saveApiKey(key);
    setApiKey(key);
  }, []);

  const remove = useCallback(async () => {
    await removeApiKey();
    setApiKey(null);
  }, []);

  return { apiKey, loading, save, remove };
}
