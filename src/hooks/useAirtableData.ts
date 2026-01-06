import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KPIData, mockData } from "@/data/mockData";
import { toast } from "sonner";

interface FetchParams {
  fromDate?: string;
  toDate?: string;
}

export const useAirtableData = () => {
  const [data, setData] = useState<KPIData[]>(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching all Airtable data...');
      
      const { data: response, error: fetchError } = await supabase.functions.invoke('fetch-airtable', {
        body: {}
      });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
        toast.success("Data loaded from Airtable!");
      } else if (response?.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading data';
      console.error('Error fetching Airtable data:', errorMessage);
      setError(errorMessage);
      toast.error("Using demo data. Check Airtable connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
