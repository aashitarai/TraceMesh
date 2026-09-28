/**
 * Realistic Indian Financial Environment & Seeded Data Simulator
 * Generates statistically plausible banking entities and the primary
 * Citi × NPCI Drunix Hackathon 2026 fraud-origin mixing scenario.
 */

import { Account, Customer, Institution, InstitutionId, InvestigationCase } from '../../types';

// Linear Congruential Generator for reproducible, seeded pseudo-randomness
class SeededRandom {
  private m = 0x80000000; // 2^31
  private a = 1103515245;
  private c = 12345;
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
  }

  nextFloat(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state / (this.m - 1);
  }

  nextInt(min: number, max: number): number {
    return Math.floor(min + this.nextFloat() * (max - min + 1));
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

export const INSTITUTIONS: Institution[] = [
  {
    id: 'SBININBB',
    name: 'State Bank of India',
    code: 'SBI',
    ifscPrefix: 'SBIN00',
    country: 'IN',
    color: '#0284c7', // Sky-600
  },
  {
    id: 'HDFCINBB',
    name: 'HDFC Bank Ltd',
    code: 'HDFC',
    ifscPrefix: 'HDFC00',
    country: 'IN',
    color: '#dc2626', // Red-600
  },
  {
    id: 'ICICINBB',
    name: 'ICICI Bank Ltd',
    code: 'ICICI',
    ifscPrefix: 'ICIC00',
    country: 'IN',
    color: '#ea580c', // Orange-600
  },
  {
    id: 'UTIBINBB',
    name: 'Axis Bank Ltd',
    code: 'AXIS',
    ifscPrefix: 'UTIB00',
    country: 'IN',
    color: '#9333ea', // Purple-600
  },
];

export interface InitialBankingState {
  institutions: Institution[];
  customers: Customer[];
  accounts: Account[];
  primaryCase: InvestigationCase;
}

export function generateInitialBankingEnvironment(seed: number = 42): InitialBankingState {
  const rng = new SeededRandom(seed);

  // 1. Core Accounts for Primary Fraud Scenario
  const accounts: Account[] = [
    // Victim Account at SBI
    {
      id: 'ACC-SBI-VICTIM-01',
      accountNumberMasked: 'SBIN••••9812',
      customerId: 'CUST-VICTIM-01',
      institutionId: 'SBININBB',
      accountType: 'SAVINGS',
      totalBalance: 450000,
      cleanValue: 450000,
      taintedValue: 0,
      taintPercentage: 0,
      status: 'ACTIVE',
      activeLienAmount: 0,
      branch: 'Nariman Point, Mumbai',
      lastUpdated: '2026-09-24T09:30:00Z',
    },
    // Mule A at HDFC (Starts with ₹5,00,000 clean legitimate balance)
    {
      id: 'ACC-HDFC-MULE-A',
      accountNumberMasked: 'HDFC••••4401',
      customerId: 'CUST-MULE-A',
      institutionId: 'HDFCINBB',
      accountType: 'SAVINGS',
      totalBalance: 500000,
      cleanValue: 500000,
      taintedValue: 0,
      taintPercentage: 0,
      status: 'ACTIVE',
      activeLienAmount: 0,
      branch: 'Koramangala, Bengaluru',
      lastUpdated: '2026-09-24T10:00:00Z',
    },
    // Mule B at ICICI (Starts with ₹50,000 clean balance)
    {
      id: 'ACC-ICICI-MULE-B',
      accountNumberMasked: 'ICIC••••7721',
      customerId: 'CUST-MULE-B',
      institutionId: 'ICICINBB',
      accountType: 'CURRENT',
      totalBalance: 50000,
      cleanValue: 50000,
      taintedValue: 0,
      taintPercentage: 0,
      status: 'ACTIVE',
      activeLienAmount: 0,
      branch: 'Cyber City, Gurugram',
      lastUpdated: '2026-09-24T10:15:00Z',
    },
    // Mule C at Axis (Starts with ₹25,000 clean balance)
    {
      id: 'ACC-AXIS-MULE-C',
      accountNumberMasked: 'UTIB••••3309',
      customerId: 'CUST-MULE-C',
      institutionId: 'UTIBINBB',
      accountType: 'SAVINGS',
      totalBalance: 25000,
      cleanValue: 25000,
      taintedValue: 0,
      taintPercentage: 0,
      status: 'ACTIVE',
      activeLienAmount: 0,
      branch: 'Salt Lake, Kolkata',
      lastUpdated: '2026-09-24T10:30:00Z',
    },
    // Mule D at SBI (Starts with ₹10,000 clean balance)
    {
      id: 'ACC-SBI-MULE-D',
      accountNumberMasked: 'SBIN••••1188',
      customerId: 'CUST-MULE-D',
      institutionId: 'SBININBB',
      accountType: 'SAVINGS',
      totalBalance: 10000,
      cleanValue: 10000,
      taintedValue: 0,
      taintPercentage: 0,
      status: 'ACTIVE',
      activeLienAmount: 0,
      branch: 'Banjara Hills, Hyderabad',
      lastUpdated: '2026-09-24T10:45:00Z',
    },
    // Merchant Nodal / Terminal account at Axis Bank
    {
      id: 'ACC-MERCHANT-TERM',
      accountNumberMasked: 'UTIB••••9900',
      customerId: 'CUST-MERCHANT-01',
      institutionId: 'UTIBINBB',
      accountType: 'MERCHANT_NODAL',
      totalBalance: 1200000,
      cleanValue: 1200000,
      taintedValue: 0,
      taintPercentage: 0,
      status: 'ACTIVE',
      activeLienAmount: 0,
      branch: 'BKC Corporate, Mumbai',
      lastUpdated: '2026-09-24T11:00:00Z',
    },
  ];

  // 2. Add realistic background legitimate accounts across banks
  const branches = ['Connaught Place, Delhi', 'MG Road, Pune', 'Anna Salai, Chennai', 'Indiranagar, Bengaluru', 'Vashi, Navi Mumbai'];
  for (let i = 1; i <= 14; i++) {
    const inst = rng.choice(INSTITUTIONS);
    const balance = rng.nextInt(35000, 850000);
    accounts.push({
      id: `ACC-BG-${inst.code}-${i.toString().padStart(2, '0')}`,
      accountNumberMasked: `${inst.ifscPrefix.substring(0, 4)}••••${rng.nextInt(1000, 9999)}`,
      customerId: `CUST-BG-${i}`,
      institutionId: inst.id,
      accountType: rng.choice(['SAVINGS', 'CURRENT']),
      totalBalance: balance,
      cleanValue: balance,
      taintedValue: 0,
      taintPercentage: 0,
      status: 'ACTIVE',
      activeLienAmount: 0,
      branch: rng.choice(branches),
      lastUpdated: '2026-09-24T08:00:00Z',
    });
  }

  // 3. Customers
  const customers: Customer[] = accounts.map((acc) => ({
    id: acc.customerId,
    institutionId: acc.institutionId,
    maskedName: acc.id.includes('VICTIM')
      ? 'Ananya S. (Victim)'
      : acc.id.includes('MULE-A')
      ? 'R. Sharma (Mule A - First Hop)'
      : acc.id.includes('MULE-B')
      ? 'P. Kulkarni (Mule B - Layer 2)'
      : acc.id.includes('MULE-C')
      ? 'S. Verma (Mule C - Layer 2)'
      : acc.id.includes('MULE-D')
      ? 'K. Nayak (Mule D - Layer 3)'
      : acc.id.includes('MERCHANT')
      ? 'PayGateway Crypto/Bullion Desk'
      : `Tokenized Entity #${acc.customerId.replace('CUST-BG-', '')}`,
    customerType: acc.id.includes('MERCHANT') ? 'MERCHANT' : 'INDIVIDUAL',
    riskScore: acc.id.includes('MULE') ? 85 : 15,
    kycTier: 'TIER_1',
    createdAt: '2024-03-15T00:00:00Z',
  }));

  // 4. Primary Investigation Case
  const primaryCase: InvestigationCase = {
    id: 'CASE-2026-00041',
    title: 'Cross-Bank Fraud Origin & Disputed Value Commingling Investigation',
    status: 'OPEN',
    priority: 'CRITICAL',
    createdAt: '2026-09-24T12:00:00Z',
    updatedAt: '2026-09-25T05:00:00Z',
    leadInvestigator: 'Inspector Vikram Sen (I4C / CFCFRMS Coordination Cell)',
    fraudOrigin: {
      originId: 'ORG-2026-001',
      caseId: 'CASE-2026-00041',
      initialTransactionId: 'TXN-ORIGIN-001',
      victimAccountId: 'ACC-SBI-VICTIM-01',
      victimInstitutionId: 'SBININBB',
      disputedAmount: 200000,
      currency: 'INR',
      reportedAt: '2026-09-24T12:05:00Z',
      narrative: 'Victim deceived via screen-share impersonation APK; ₹2,00,000 siphoned into HDFC Mule A account.',
    },
    disputedValue: 200000,
    currentAttributedValue: 200000,
    recoveredValue: 0,
    involvedInstitutions: ['SBININBB', 'HDFCINBB', 'ICICINBB', 'UTIBINBB'],
    involvedAccountIds: [
      'ACC-SBI-VICTIM-01',
      'ACC-HDFC-MULE-A',
      'ACC-ICICI-MULE-B',
      'ACC-AXIS-MULE-C',
      'ACC-SBI-MULE-D',
      'ACC-MERCHANT-TERM',
    ],
    involvedTransactionIds: [],
    traceDepth: 4,
    evidence: [
      {
        evidenceId: 'EVD-001',
        type: 'TRANSACTION_RECEIPT',
        description: 'First Information Report (FIR) cyber cell reference #CYB-2026-8812',
        data: { complainant: 'Ananya S.', amount: 200000, targetUpiId: 'rmule@hdfcbank' },
        timestamp: '2026-09-24T12:10:00Z',
        signedBy: 'Officer K. Ramanathan, Cyber Police Station',
      },
    ],
    notes: [
      'Disputed value ₹2,00,000 mixed with ₹5,00,000 clean balance at HDFC Mule A.',
      'Downstream propagation evaluated under Proportional Pro-Rata Commingling theorem.',
      'Partial lien recommendation submitted to HDFC Bank and ICICI Bank ops desks.',
    ],
  };

  return {
    institutions: INSTITUTIONS,
    customers,
    accounts,
    primaryCase,
  };
}
