export interface KPIData {
  id: number;
  name: string;
  date: string;
  smsSend: number;
  smsLeads: number;
  coldCallsMade: number;
  coldCallLeads: number;
  mailReceived: number;
  mailLeads: number;
  totalInboundLeads: number;
  hotLeads: number;
  warmLeads: number;
  comparedProperties: number;
  businessInProgress: number;
  offersSent: number;
  contractsSent: number;
  signedContracts: number;
  smsLeadRate: number;
  coldCallRate: number;
  qualificationFee: number;
  leadToOffer: number;
  closeRate: number;
}

export const mockData: KPIData[] = [
  {
    id: 5,
    name: "Jhaniel Repuela",
    date: "2025-03-12",
    smsSend: 123,
    smsLeads: 12,
    coldCallsMade: 16,
    coldCallLeads: 13,
    mailReceived: 12,
    mailLeads: 11,
    totalInboundLeads: 320,
    hotLeads: 4,
    warmLeads: 12,
    comparedProperties: 2,
    businessInProgress: 1,
    offersSent: 4,
    contractsSent: 1,
    signedContracts: 1,
    smsLeadRate: 10,
    coldCallRate: 81,
    qualificationFee: 5,
    leadToOffer: 1,
    closeRate: 25
  },
  {
    id: 6,
    name: "Lana Brown",
    date: "2025-03-12",
    smsSend: 127,
    smsLeads: 123,
    coldCallsMade: 12,
    coldCallLeads: 11,
    mailReceived: 31,
    mailLeads: 12,
    totalInboundLeads: 400,
    hotLeads: 2,
    warmLeads: 3,
    comparedProperties: 1,
    businessInProgress: 1,
    offersSent: 1,
    contractsSent: 1,
    signedContracts: 0,
    smsLeadRate: 97,
    coldCallRate: 92,
    qualificationFee: 1,
    leadToOffer: 0,
    closeRate: 0
  },
  {
    id: 4,
    name: "Pedro Dev",
    date: "2025-03-12",
    smsSend: 2,
    smsLeads: 1,
    coldCallsMade: 1,
    coldCallLeads: 0,
    mailReceived: 1,
    mailLeads: 10,
    totalInboundLeads: 1,
    hotLeads: 0,
    warmLeads: 1,
    comparedProperties: 0,
    businessInProgress: 2,
    offersSent: 12,
    contractsSent: 1,
    signedContracts: 0,
    smsLeadRate: 50,
    coldCallRate: 0,
    qualificationFee: 100,
    leadToOffer: 1200,
    closeRate: 0
  },
  {
    id: 7,
    name: "Jhaniel Repuela",
    date: "2025-03-11",
    smsSend: 98,
    smsLeads: 8,
    coldCallsMade: 22,
    coldCallLeads: 15,
    mailReceived: 18,
    mailLeads: 9,
    totalInboundLeads: 280,
    hotLeads: 6,
    warmLeads: 10,
    comparedProperties: 3,
    businessInProgress: 2,
    offersSent: 5,
    contractsSent: 2,
    signedContracts: 1,
    smsLeadRate: 8,
    coldCallRate: 68,
    qualificationFee: 6,
    leadToOffer: 2,
    closeRate: 20
  },
  {
    id: 8,
    name: "Lana Brown",
    date: "2025-03-11",
    smsSend: 145,
    smsLeads: 95,
    coldCallsMade: 18,
    coldCallLeads: 14,
    mailReceived: 25,
    mailLeads: 15,
    totalInboundLeads: 350,
    hotLeads: 5,
    warmLeads: 8,
    comparedProperties: 2,
    businessInProgress: 3,
    offersSent: 3,
    contractsSent: 2,
    signedContracts: 1,
    smsLeadRate: 66,
    coldCallRate: 78,
    qualificationFee: 3,
    leadToOffer: 1,
    closeRate: 33
  }
];

export const calculateTotals = (data: KPIData[]) => {
  return {
    totalSMS: data.reduce((acc, curr) => acc + curr.smsSend, 0),
    totalSMSLeads: data.reduce((acc, curr) => acc + curr.smsLeads, 0),
    totalColdCalls: data.reduce((acc, curr) => acc + curr.coldCallsMade, 0),
    totalColdCallLeads: data.reduce((acc, curr) => acc + curr.coldCallLeads, 0),
    totalInbound: data.reduce((acc, curr) => acc + curr.totalInboundLeads, 0),
    totalHotLeads: data.reduce((acc, curr) => acc + curr.hotLeads, 0),
    totalWarmLeads: data.reduce((acc, curr) => acc + curr.warmLeads, 0),
    totalOffers: data.reduce((acc, curr) => acc + curr.offersSent, 0),
    totalContracts: data.reduce((acc, curr) => acc + curr.signedContracts, 0),
    avgSMSRate: data.length > 0 ? data.reduce((acc, curr) => acc + curr.smsLeadRate, 0) / data.length : 0,
    avgColdCallRate: data.length > 0 ? data.reduce((acc, curr) => acc + curr.coldCallRate, 0) / data.length : 0,
    avgCloseRate: data.length > 0 ? data.reduce((acc, curr) => acc + curr.closeRate, 0) / data.length : 0,
  };
};
