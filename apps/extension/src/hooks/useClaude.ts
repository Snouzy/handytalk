import { useState, useCallback } from "react";
import { callClaude, parseResponse } from "../lib/claude";
import type { ParsedResult } from "@handytalk/shared";

export function useClaude(apiKey: string | null) {
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (prompt: string): Promise<ParsedResult | null> => {
      if (!apiKey) {
        setError("Clé API manquante.");
        return null;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const raw = await callClaude(apiKey, prompt);
        const parsed = parseResponse(raw);
        setResult(parsed);
        return parsed;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Une erreur est survenue.";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, send, reset };
}
