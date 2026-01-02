"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { supabase } from "@/lib/supabase";

/**
 * Custom hook for managing API keys CRUD operations
 * @returns {Object} API keys state and operations
 */
export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);

  // Load API keys from Supabase
  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Transform data to match our format
      const transformedData = (data || []).map((key) => ({
        id: key.id,
        name: key.name,
        key: key.key,
        description: key.description || "",
        usage: key.usage || 0,
        status: key.status || "active",
        createdAt: key.created_at,
        updatedAt: key.updated_at,
      }));

      startTransition(() => {
        setApiKeys(transformedData);
      });
    } catch (err) {
      console.error("Error fetching API keys:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load API keys on mount
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      fetchApiKeys().catch((err) => {
        // Error is already logged and set in fetchApiKeys
        console.error("Failed to load API keys on mount:", err);
      });
    }
  }, [fetchApiKeys]);

  // Create a new API key
  const createApiKey = useCallback(async (apiKeyData) => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          name: apiKeyData.name,
          key: apiKeyData.key,
          description: apiKeyData.description,
          usage: 0,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newKey = {
        id: data.id,
        name: data.name,
        key: data.key,
        description: data.description || "",
        usage: data.usage || 0,
        status: data.status || "active",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      setApiKeys((prev) => [newKey, ...prev]);
      return newKey;
    } catch (error) {
      console.error("Error creating API key:", error);
      throw error;
    }
  }, []);

  // Update an existing API key
  const updateApiKey = useCallback(async (id, apiKeyData) => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .update({
          name: apiKeyData.name,
          key: apiKeyData.key,
          description: apiKeyData.description,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setApiKeys((prev) =>
        prev.map((key) =>
          key.id === id
            ? {
                ...key,
                name: data.name,
                key: data.key,
                description: data.description || "",
                updatedAt: data.updated_at,
              }
            : key
        )
      );
      return data;
    } catch (error) {
      console.error("Error updating API key:", error);
      throw error;
    }
  }, []);

  // Delete an API key
  const deleteApiKey = useCallback(async (id) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);

      if (error) throw error;

      // Update local state
      setApiKeys((prev) => prev.filter((key) => key.id !== id));
    } catch (error) {
      console.error("Error deleting API key:", error);
      throw error;
    }
  }, []);

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}
