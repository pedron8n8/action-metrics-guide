import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KPIData, mockData } from "@/data/mockData";
import { toast } from "sonner";

export const useAirtableData = () => {
  const [data, setData] = useState<KPIData[]>(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: response, error: fetchError } = await supabase.functions.invoke('fetch-airtable');
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
        toast.success("Dados carregados do Airtable!");
      } else if (response?.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      console.error('Error fetching Airtable data:', errorMessage);
      setError(errorMessage);
      toast.error("Usando dados de demonstração. Verifique a conexão com Airtable.");
      // Keep using mock data as fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
