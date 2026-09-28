/**
 * Interactive System Walkthrough & Synchronized Voice/Text Narration Controller
 * Guides investors, risk executives, and regulatory examiners step-by-step
 * through TraceMesh with simulated realistic audio commentary.
 */

export interface TourStep {
  id: string;
  tab: string;
  title: string;
  badge: string;
  narration: string;
  durationSeconds: number;
  highlightSelector?: string;
  callout: {
    heading: string;
    subheading: string;
    keyMetric?: string;
  };
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-1-the-problem',
    tab: 'investigator',
    title: '1. The Commingling Crisis: ₹2,00,000 Theft Siphoned',
    badge: 'Origin Fraud',
    narration:
      'Welcome to TraceMesh. Consider a real-world scenario: An innocent victim loses two lakh rupees to a screen-share scam. The funds enter Mule Account A at HDFC Bank. But Account A already contains five lakh rupees of clean, legitimate customer money. Traditional systems flag the entire account as suspicious. But when Mule A transfers money downstream to Mule B and Mule C, how much of that downstream value is actually stolen money versus clean money? TraceMesh solves this.',
    durationSeconds: 16,
    callout: {
      heading: 'Victim Loss: ₹2,00,000',
      subheading: 'Enters Mule A which already held ₹5,00,000 legitimate funds. Total = ₹7,00,000.',
      keyMetric: 'Taint Ratio: 28.57%',
    },
  },
  {
    id: 'step-2-provenance-math',
    tab: 'investigator',
    title: '2. Value Conservation & Pro-Rata Attribution',
    badge: 'Mathematical Truth',
    narration:
      'Notice the interactive graph. Instead of painting every downstream node red, TraceMesh maintains an immutable double-entry partitioned balance: clean value, plus tainted value. When Mule A sends one lakh fifty thousand to Mule B, our engine calculates twenty-eight point five seven percent taint—conserving forty-two thousand eight hundred fifty-seven rupees of disputed value. Not a single rupee is created or destroyed. Global value conservation delta is zero.',
    durationSeconds: 18,
    callout: {
      heading: 'Zero Disputed Value Leaked (Δ = ₹0.00)',
      subheading: 'Calculates exact rupee attribution at every hop instead of binary account suspicion.',
      keyMetric: 'Conservation: 100%',
    },
  },
  {
    id: 'step-3-bank-ops',
    tab: 'bank_ops',
    title: '3. Bank Operations & Surgical Partial Liens',
    badge: 'Zero Collateral Damage',
    narration:
      'Let us switch to the Bank Operations desk. In legacy banking, a cyber cell freeze freezes one hundred percent of an account. That stops innocent payrolls and bounces legitimate vendor cheques, exposing banks to litigation. In TraceMesh, HDFC Bank can execute a surgical statutory partial lien on exactly one lakh twenty-eight thousand five hundred seventy-one rupees of tainted funds, leaving the customer’s clean funds completely liquid and safe.',
    durationSeconds: 18,
    callout: {
      heading: 'Dual-Key Maker-Checker Approval',
      subheading: 'Bank Managers approve targeted statutory debit restrictions with full auditability.',
      keyMetric: 'Clean Funds Saved: 100%',
    },
  },
  {
    id: 'step-4-regulator',
    tab: 'regulator',
    title: '4. Macro Financial Surveillance & Zero-PII Compliance',
    badge: 'Regulator Oversight',
    narration:
      'Now viewing the Regulator dashboard for the Reserve Bank of India and financial intelligence agencies. In compliance with the Digital Personal Data Protection Act, this view exposes zero customer personal identifiers. It reveals cross-institution velocity, aggregate systemic taint transit, and inter-bank liquidity trails without violating privacy.',
    durationSeconds: 16,
    callout: {
      heading: 'Central Intelligence Matrix',
      subheading: 'Aggregated cross-bank clearing transit matrix without personal identity exposure.',
      keyMetric: 'Avg Time to Lien: 4.2 min',
    },
  },
  {
    id: 'step-5-iso20022',
    tab: 'raw_inspector',
    title: '5. 3-Layer ISO 20022 Architecture',
    badge: 'Banking Infrastructure',
    narration:
      'This screen proves TraceMesh is an enterprise infrastructure layer. Layer 1 stores raw ISO 20022 pacs.008 XML payment messages with cryptographic SHA-256 hashes. Layer 2 normalizes them into canonical transactions. Layer 3 computes the forensic value attribution metadata. Financial data and analytical data are strictly decoupled.',
    durationSeconds: 16,
    callout: {
      heading: 'Immutable Raw Message Archival',
      subheading: 'Decoupled pacs.008 XML, canonical core banking model, and analytical provenance.',
      keyMetric: 'Tamper Hash: SHA-256',
    },
  },
  {
    id: 'step-6-red-team',
    tab: 'red_team',
    title: '6. Zero-Trust Security & Adversarial Resilience',
    badge: 'Security Verification',
    narration:
      'Finally, our Zero-Trust Red-Team Sandbox. TraceMesh enforces strict attribute-based access control. Cross-tenant IDOR attacks between banks are denied, prompt injections inside ISO remittance texts are quarantined, and unauthorized database tampering is instantly detected by our cryptographic block hash chain.',
    durationSeconds: 17,
    callout: {
      heading: 'Automated Exploit Defense',
      subheading: 'Proves mathematical defense against IDOR, privilege escalation, and prompt injection.',
      keyMetric: 'Attacks Defended: 5/5',
    },
  },
];
