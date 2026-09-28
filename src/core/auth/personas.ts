/**
 * Pre-configured Authenticated Personas for Bank Approvals & Inter-Agency Coordination
 */

import { InstitutionId, SecurityRole, UserSecurityContext } from '../../types';

export interface AuthPersona {
  id: string;
  name: string;
  email: string;
  role: SecurityRole;
  institutionId?: InstitutionId;
  institutionName: string;
  designation: string;
  avatarInitials: string;
  badgeColor: string;
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
  pendingActionsCount: number;
}

export const AUTH_PERSONAS: AuthPersona[] = [
  {
    id: 'user-hdfc-mgr',
    name: 'Rajesh K. Varma',
    email: 'r.varma@hdfcbank.com',
    role: 'BANK_MANAGER',
    institutionId: 'HDFCINBB',
    institutionName: 'HDFC Bank Ltd',
    designation: 'VP - Fraud Risk Operations & Dual-Key Signatory',
    avatarInitials: 'RV',
    badgeColor: '#dc2626',
    clearanceLevel: 'LEVEL_2',
    pendingActionsCount: 1,
  },
  {
    id: 'user-hdfc-analyst',
    name: 'Sneha Chawla',
    email: 's.chawla@hdfcbank.com',
    role: 'BANK_ANALYST',
    institutionId: 'HDFCINBB',
    institutionName: 'HDFC Bank Ltd',
    designation: 'Senior AML & Real-Time Monitoring Analyst',
    avatarInitials: 'SC',
    badgeColor: '#dc2626',
    clearanceLevel: 'LEVEL_1',
    pendingActionsCount: 0,
  },
  {
    id: 'user-icici-mgr',
    name: 'Vikramaditya Rao',
    email: 'v.rao@icicibank.com',
    role: 'BANK_MANAGER',
    institutionId: 'ICICINBB',
    institutionName: 'ICICI Bank Ltd',
    designation: 'Head of Special Investigations & Lien Enforcement',
    avatarInitials: 'VR',
    badgeColor: '#ea580c',
    clearanceLevel: 'LEVEL_2',
    pendingActionsCount: 1,
  },
  {
    id: 'user-sbi-analyst',
    name: 'Pooja Iyer',
    email: 'p.iyer@sbi.co.in',
    role: 'BANK_ANALYST',
    institutionId: 'SBININBB',
    institutionName: 'State Bank of India',
    designation: 'CFCFRMS Coordination Desk Officer',
    avatarInitials: 'PI',
    badgeColor: '#0284c7',
    clearanceLevel: 'LEVEL_1',
    pendingActionsCount: 0,
  },
  {
    id: 'user-axis-mgr',
    name: 'Devendra Joshi',
    email: 'd.joshi@axisbank.com',
    role: 'BANK_MANAGER',
    institutionId: 'UTIBINBB',
    institutionName: 'Axis Bank Ltd',
    designation: 'Nodal Account & Merchant Fraud Operations',
    avatarInitials: 'DJ',
    badgeColor: '#9333ea',
    clearanceLevel: 'LEVEL_2',
    pendingActionsCount: 1,
  },
  {
    id: 'user-inv-vikram',
    name: 'Inspector Vikram Sen',
    email: 'vikram.sen@i4c-cyber.gov.in',
    role: 'INVESTIGATOR',
    institutionName: 'I4C / CFCFRMS Central Bureau',
    designation: 'Lead Cyber-Financial Crime Investigator',
    avatarInitials: 'VS',
    badgeColor: '#f59e0b',
    clearanceLevel: 'LEVEL_3',
    pendingActionsCount: 2,
  },
  {
    id: 'user-rbi-regulator',
    name: 'Dr. Aruna Swaminathan',
    email: 'a.swaminathan@rbi.org.in',
    role: 'REGULATOR',
    institutionName: 'Reserve Bank of India / NPCI Oversight',
    designation: 'Chief Director - Financial Surveillance',
    avatarInitials: 'AS',
    badgeColor: '#a855f7',
    clearanceLevel: 'LEVEL_3',
    pendingActionsCount: 0,
  },
  {
    id: 'user-admin',
    name: 'System Root Authority',
    email: 'secops@tracemesh.network',
    role: 'ADMIN',
    institutionName: 'TraceMesh Core Infrastructure',
    designation: 'Platform Cryptographic Administrator',
    avatarInitials: 'SA',
    badgeColor: '#10b981',
    clearanceLevel: 'LEVEL_3',
    pendingActionsCount: 0,
  },
];
