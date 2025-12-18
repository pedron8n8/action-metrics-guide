import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const BASE_ID = 'appEzxAgICoJK3bFa';
const TABLE_ID = 'tblHHCUcIFMR0p80Z';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body for date filters
    let fromDate: string | undefined;
    let toDate: string | undefined;
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        fromDate = body.fromDate;
        toDate = body.toDate;
        console.log('Received date filters:', { fromDate, toDate });
      } catch {
        console.log('No body or invalid JSON, fetching all records');
      }
    }

    console.log('Fetching data from Airtable...');
    
    let url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;
    
    // Build filter formula for date range
    if (fromDate && toDate) {
      const formula = `AND(IS_AFTER({Date}, '${fromDate}'), IS_BEFORE({Date}, '${toDate}'))`;
      url += `?filterByFormula=${encodeURIComponent(formula)}`;
      console.log('Using date filter formula:', formula);
    } else if (fromDate) {
      const formula = `IS_AFTER({Date}, '${fromDate}')`;
      url += `?filterByFormula=${encodeURIComponent(formula)}`;
      console.log('Using from date filter:', formula);
    } else if (toDate) {
      const formula = `IS_BEFORE({Date}, '${toDate}')`;
      url += `?filterByFormula=${encodeURIComponent(formula)}`;
      console.log('Using to date filter:', formula);
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.records?.length || 0} records from Airtable`);

    // Transform Airtable records to our KPI format
    const kpiData = data.records.map((record: any, index: number) => {
      const fields = record.fields;
      
      // Calculate derived metrics
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
      
      // Calculate rates
      const smsLeadRate = smsSend > 0 ? Math.round((smsLeads / smsSend) * 100) : 0;
      const coldCallRate = coldCallsMade > 0 ? Math.round((coldCallLeads / coldCallsMade) * 100) : 0;
      const totalLeads = hotLeads + warmLeads;
      const qualificationFee = totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0;
      const leadToOffer = totalLeads > 0 ? Math.round((offersSent / totalLeads) * 100) : 0;
      const closeRate = offersSent > 0 ? Math.round((signedContracts / offersSent) * 100) : 0;

      return {
        id: index + 1,
        name: fields['Name'] || fields['name'] || 'Unknown',
        date: fields['Date'] || fields['date'] || new Date().toISOString().split('T')[0],
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

    return new Response(JSON.stringify({ data: kpiData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching Airtable data:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
