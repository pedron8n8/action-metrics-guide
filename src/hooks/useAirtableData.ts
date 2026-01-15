import { useState, useEffect, useCallback } from "react";
import { KPIData, mockData } from "@/data/mockData";
import { toast } from "sonner";

interface FetchParams {
  fromDate?: string;
  toDate?: string;
  period?: string;
}

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || 'appEzxAgICoJK3bFa';
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID || 'tblHHCUcIFMR0p80Z';

export const useAirtableData = (params?: FetchParams) => {
  const [data, setData] = useState<KPIData[]>(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsString = JSON.stringify(params || {});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Verify API key is loaded
      if (!AIRTABLE_API_KEY) {
        throw new Error('VITE_AIRTABLE_API_KEY not found in environment variables. Please add it to your .env file.');
      }
      
      console.log('Fetching Airtable data with filters:', params);
      console.log('Using Base ID:', BASE_ID, 'Table ID:', TABLE_ID);
      
      let filterFormula = '';
      
      if (params?.period) {
        switch (params.period) {
          case 'today':
            filterFormula = "IS_SAME({Data}, TODAY(), 'day')";
            break;
          case 'week':
            filterFormula = "IS_AFTER({Data}, DATEADD(TODAY(), -7, 'days'))";
            break;
          case 'month':
            filterFormula = "IS_AFTER({Data}, DATEADD(TODAY(), -30, 'days'))";
            break;
        }
      } else if (params?.fromDate && params?.toDate) {
        filterFormula = `AND(IS_AFTER({Data}, '${params.fromDate}'), IS_BEFORE({Data}, DATEADD('${params.toDate}', 1, 'days')))`;
      } else if (params?.fromDate) {
        filterFormula = `IS_AFTER({Data}, '${params.fromDate}')`;
      }

      console.log('Airtable filter formula:', filterFormula || 'none');
      
      let url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;
      
      if (filterFormula) {
        const urlParams = new URLSearchParams({
          filterByFormula: filterFormula
        });
        url = `${url}?${urlParams.toString()}`;
      }
      
      console.log('Fetching from Airtable URL:', url);
      
      // Fetch all records with pagination (Airtable limit is 100 per request)
      let allRecords: any[] = [];
      let offset: string | undefined;
      
      do {
        let paginatedUrl = url;
        
        if (offset) {
          const separator = url.includes('?') ? '&' : '?';
          paginatedUrl = `${url}${separator}offset=${offset}`;
        }
        
        const response = await fetch(paginatedUrl, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Airtable API error:', errorText);
          throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
        }

        const airtableData = await response.json();
        allRecords = allRecords.concat(airtableData.records || []);
        offset = airtableData.offset;
        
        console.log(`Fetched ${airtableData.records?.length || 0} records (total so far: ${allRecords.length})`);
      } while (offset);
      
      console.log(`Total records fetched from Airtable: ${allRecords.length}`);

      const kpiData = allRecords.map((record: any, index: number) => {
        const fields = record.fields;
        
        const rawDate = fields['Date'] || fields['date'] || fields['DATA'] || fields['Data'] || null;
        let parsedDate: string;
        
        if (rawDate) {
          if (typeof rawDate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate)) {
            const [day, month, year] = rawDate.split('/');
            parsedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
          else if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
            parsedDate = rawDate.split('T')[0];
          }
          else {
            const dateObj = new Date(rawDate);
            if (!isNaN(dateObj.getTime())) {
              parsedDate = dateObj.toISOString().split('T')[0];
            } else {
              parsedDate = new Date().toISOString().split('T')[0];
            }
          }
        } else {
          parsedDate = new Date().toISOString().split('T')[0];
        }
        
        const smsSend = fields['sms Sends'] || fields['SMS Send'] || fields['sms_send'] || 0;
        const smsLeads = fields['SMS Leads'] || fields['sms_leads'] || 0;
        const coldCallsMade = fields['Cold Calls Made'] || fields['cold_calls_made'] || 0;
        const coldCallLeads = fields['Cold Call Leads'] || fields['cold_call_leads'] || 0;
        const mailReceived = fields['Mail Calls Recived'] || fields['Mail Received'] || fields['mail_received'] || 0;
        const mailLeads = fields['Mail Leads'] || fields['mail_leads'] || 0;
        const totalInboundLeads = fields['Total Inbound leads'] || fields['Total Inbound Leads'] || fields['total_inbound_leads'] || 0;
        const hotLeads = fields['Hot Leads'] || fields['hot_leads'] || 0;
        const warmLeads = fields['Warm Leads'] || fields['warm_leads'] || 0;
        const comparedProperties = fields['Compared Properties'] || fields['compared_properties'] || 0;
        const rejectedLeads = fields['Rejected Leads'] || fields['rejected_leads'] || 0;
        const offersSent = fields['Offers Sent'] || fields['offers_sent'] || 0;
        const contractsSent = fields['Contracts Sent'] || fields['contracts_sent'] || 0;
        const signedContracts = fields['Signed Contracts'] || fields['signed_contracts'] || 0;
        
        const smsLeadRate = smsSend > 0 ? Math.round((smsLeads / smsSend) * 100) : 0;
        const coldCallRate = coldCallsMade > 0 ? Math.round((coldCallLeads / coldCallsMade) * 100) : 0;
        const totalLeads = hotLeads + warmLeads;
        const qualificationFee = totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0;
        const leadToOffer = totalLeads > 0 ? Math.round((offersSent / totalLeads) * 100) : 0;
        const closeRate = offersSent > 0 ? Math.round((signedContracts / offersSent) * 100) : 0;

        return {
          id: index + 1,
          name: fields['Name'] || fields['name'] || 'Unknown',
          date: parsedDate,
          smsSend,
          smsLeads,
          coldCallsMade,
          coldCallLeads,
          mailReceived,
          mailLeads,
          totalInboundLeads,
          hotLeads,
          warmLeads,
          comparedProperties,
          rejectedLeads,
          offersSent,
          contractsSent,
          signedContracts,
          smsLeadRate,
          coldCallRate,
          qualificationFee,
          leadToOffer,
          closeRate,
        };
      });

      console.log('Setting data with', kpiData.length, 'records');
      setData(kpiData);
      toast.success(`Data loaded from Airtable! (${kpiData.length} records)`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading data';
      console.error('Error fetching Airtable data:', errorMessage);
      setError(errorMessage);
      toast.error("Using demo data. Check Airtable connection.");
      console.log('Keeping mock data due to error');
    } finally {
      setLoading(false);
    }
  }, [paramsString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
