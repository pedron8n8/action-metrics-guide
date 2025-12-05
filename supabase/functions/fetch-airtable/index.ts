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
    console.log('Fetching data from Airtable...');
    
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;
    
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
      const smsSend = fields['SMS Send'] || fields['sms_send'] || 0;
      const smsLeads = fields['SMS Leads'] || fields['sms_leads'] || 0;
      const coldCallsMade = fields['Cold Calls Made'] || fields['cold_calls_made'] || 0;
      const coldCallLeads = fields['Cold Call Leads'] || fields['cold_call_leads'] || 0;
      const hotLeads = fields['Hot Leads'] || fields['hot_leads'] || 0;
      const warmLeads = fields['Warm Leads'] || fields['warm_leads'] || 0;
      const offersSent = fields['Offers Sent'] || fields['offers_sent'] || 0;
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
        mailReceived: fields['Mail Received'] || fields['mail_received'] || 0,
        mailLeads: fields['Mail Leads'] || fields['mail_leads'] || 0,
        totalInboundLeads: fields['Total Inbound Leads'] || fields['total_inbound_leads'] || 0,
        hotLeads,
        warmLeads,
        comparedProperties: fields['Compared Properties'] || fields['compared_properties'] || 0,
        businessInProgress: fields['Business in Progress'] || fields['business_in_progress'] || 0,
        offersSent,
        contractsSent: fields['Contracts Sent'] || fields['contracts_sent'] || 0,
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
