export const BENCHMARKS = {
  // Response Rate Targets
  smsResponseRate: 10,         // Target: > 10-15%
  coldCallResponseRate: 1,     // Target: > 1-3%
  mailResponseRate: 1.5,       // Target: > 1.5-3%

  // Qualified Leads (20-35% of warm leads)
  // We use 20% as the baseline for "Good"
  leadToQualifiedRate: 20,

  // Offers Sent (7-12% of responses)
  // If we assume Qualified = 20% of Leads, and Offers = 7% of Leads
  // Then Offers / Qualified = 7/20 = 35%
  qualifiedToOfferRate: 35,

  // Offer -> Contract (Sent) 
  // Not explicitly in benchmark text as a standalone rate, but we can stick to a reasonable pipeline metric. 
  // If Offers=7% of leads and Contracts=1% of leads (SMS), then Contract/Offer = 1/7 = ~14%
  offerToContractRate: 15,

  // Contract -> Close Rate (Signed)
  // "Healthy: 80-92%"
  contractSignRate: 80, 

  // Additional Context
  warmLeadRate: {
    sms: 2,       // 2-4%
    coldCall: 0.3, // 0.3-1%
    mail: 0.5     // 0.5-1.5%
  }
};
