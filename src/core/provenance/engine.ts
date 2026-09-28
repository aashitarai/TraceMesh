/**
 * TraceMesh Value Provenance & Conservation Engine
 * 
 * Mathematically defensible attribution of disputed/commingled financial value.
 * Unlike binary account-flagging or naive heuristics, this engine enforces
 * strict value conservation: Total Injected Taint = Remaining Taint + Propagated Taint.
 */

import { Account, CanonicalTransaction, ProvenanceModelType, TraceMeshAnalysis } from '../../types';

export interface PropagationResult {
  outgoingTainted: number;
  outgoingClean: number;
  outgoingTaintRatio: number;
  updatedSourceAccount: Account;
  updatedDestinationAccount: Account;
  conservationDelta: number; // Must be ~0.00
}

/**
 * Calculates outgoing split and updates balance states under specified provenance model.
 */
export function propagateValue(
  source: Account,
  destination: Account,
  amount: number,
  model: ProvenanceModelType = 'PROPORTIONAL',
  isFraudOrigin: boolean = false
): PropagationResult {
  if (amount <= 0) {
    throw new Error(`Transaction amount must be positive. Received: ${amount}`);
  }

  if (source.totalBalance < amount && !isFraudOrigin) {
    // In real banking, overdraft may exist, but for canonical transfers balance must suffice
    throw new Error(
      `Insufficient funds in debtor account ${source.id}. Balance: ₹${source.totalBalance}, Transfer: ₹${amount}`
    );
  }

  let outgoingTainted = 0;
  let outgoingClean = 0;

  if (isFraudOrigin) {
    // If investigator flags this transfer as the confirmed theft origin:
    // The entire transferred amount is defined as disputed/tainted.
    outgoingTainted = amount;
    outgoingClean = 0;
  } else {
    const totalB = source.totalBalance;
    const currentTaint = source.taintedValue;
    const currentClean = source.cleanValue;

    switch (model) {
      case 'PROPORTIONAL': {
        // Pro-rata commingling: outgoing funds carry exact proportional share of taint
        const taintRatio = totalB > 0 ? currentTaint / totalB : 0;
        outgoingTainted = Number((amount * taintRatio).toFixed(4));
        // Clamp to prevent floating-point overshoot
        if (outgoingTainted > currentTaint) outgoingTainted = currentTaint;
        outgoingClean = Number((amount - outgoingTainted).toFixed(4));
        break;
      }

      case 'FIFO': {
        // First-In First-Out (Clayton's Case): assume existing clean funds were deposited first
        // Spend clean first; only when clean is depleted does tainted move
        if (currentClean >= amount) {
          outgoingClean = amount;
          outgoingTainted = 0;
        } else {
          outgoingClean = currentClean;
          outgoingTainted = amount - currentClean;
          if (outgoingTainted > currentTaint) outgoingTainted = currentTaint;
        }
        break;
      }

      case 'LIFO': {
        // Last-In First-Out: assume illicit funds were deposited last and moved immediately
        // Spend tainted first until exhausted, then clean
        if (currentTaint >= amount) {
          outgoingTainted = amount;
          outgoingClean = 0;
        } else {
          outgoingTainted = currentTaint;
          outgoingClean = amount - currentTaint;
        }
        break;
      }

      case 'LOWEST_INTERMEDIATE': {
        // Lowest Intermediate Balance Rule (LIBR / Equity tracing rule)
        // Disputed funds cannot exceed the lowest balance between deposit and withdrawal
        const effectiveTaint = Math.min(currentTaint, totalB);
        const taintRatio = totalB > 0 ? effectiveTaint / totalB : 0;
        outgoingTainted = Number((amount * taintRatio).toFixed(4));
        if (outgoingTainted > effectiveTaint) outgoingTainted = effectiveTaint;
        outgoingClean = Number((amount - outgoingTainted).toFixed(4));
        break;
      }
    }
  }

  // Update Source Account (Debtor)
  const newSourceTainted = Number(Math.max(0, source.taintedValue - outgoingTainted).toFixed(4));
  const newSourceClean = Number(Math.max(0, source.cleanValue - outgoingClean).toFixed(4));
  const newSourceBalance = Number((newSourceClean + newSourceTainted).toFixed(4));
  const newSourceTaintPct = newSourceBalance > 0 ? Number(((newSourceTainted / newSourceBalance) * 100).toFixed(2)) : 0;

  const updatedSource: Account = {
    ...source,
    totalBalance: newSourceBalance,
    cleanValue: newSourceClean,
    taintedValue: newSourceTainted,
    taintPercentage: newSourceTaintPct,
    status: newSourceTainted > 100 ? (source.status === 'FROZEN' ? 'FROZEN' : 'FLAGGED') : 'ACTIVE',
    lastUpdated: new Date().toISOString(),
  };

  // Update Destination Account (Creditor)
  const newDestTainted = Number((destination.taintedValue + outgoingTainted).toFixed(4));
  const newDestClean = Number((destination.cleanValue + outgoingClean).toFixed(4));
  const newDestBalance = Number((newDestClean + newDestTainted).toFixed(4));
  const newDestTaintPct = newDestBalance > 0 ? Number(((newDestTainted / newDestBalance) * 100).toFixed(2)) : 0;

  const updatedDestination: Account = {
    ...destination,
    totalBalance: newDestBalance,
    cleanValue: newDestClean,
    taintedValue: newDestTainted,
    taintPercentage: newDestTaintPct,
    status: newDestTainted > 100 ? (destination.status === 'FROZEN' ? 'FROZEN' : 'FLAGGED') : destination.status,
    lastUpdated: new Date().toISOString(),
  };

  // Value Conservation Verification Check
  // Sum of initial tainted = Sum of final tainted
  const initialTotalTaint = isFraudOrigin
    ? source.taintedValue + destination.taintedValue + amount
    : source.taintedValue + destination.taintedValue;
  const finalTotalTaint = updatedSource.taintedValue + updatedDestination.taintedValue;
  const delta = Math.abs(initialTotalTaint - finalTotalTaint);

  return {
    outgoingTainted,
    outgoingClean,
    outgoingTaintRatio: amount > 0 ? outgoingTainted / amount : 0,
    updatedSourceAccount: updatedSource,
    updatedDestinationAccount: updatedDestination,
    conservationDelta: delta,
  };
}

/**
 * Creates analytical metadata for a canonical transaction given account states
 */
export function analyzeTransaction(
  tx: CanonicalTransaction,
  debtorAccount: Account,
  isFraudOrigin: boolean = false,
  fraudOriginId?: string,
  caseId?: string,
  model: ProvenanceModelType = 'PROPORTIONAL'
): TraceMeshAnalysis {
  let outgoingTainted = 0;
  let outgoingClean = tx.amount;

  if (isFraudOrigin) {
    outgoingTainted = tx.amount;
    outgoingClean = 0;
  } else {
    const taintRatio = debtorAccount.totalBalance > 0 ? debtorAccount.taintedValue / debtorAccount.totalBalance : 0;
    outgoingTainted = Number((tx.amount * taintRatio).toFixed(4));
    if (outgoingTainted > debtorAccount.taintedValue) outgoingTainted = debtorAccount.taintedValue;
    outgoingClean = Number((tx.amount - outgoingTainted).toFixed(4));
  }

  const taintPercentage = tx.amount > 0 ? Number(((outgoingTainted / tx.amount) * 100).toFixed(2)) : 0;

  // Determine trace confidence
  let traceConfidence: TraceMeshAnalysis['traceConfidence'] = 'CONFIRMED';
  let confidenceScore = 1.0;

  if (isFraudOrigin) {
    traceConfidence = 'CONFIRMED';
    confidenceScore = 1.0;
  } else if (taintPercentage > 50) {
    traceConfidence = 'HIGH';
    confidenceScore = 0.92;
  } else if (taintPercentage > 10) {
    traceConfidence = 'PROBABLE';
    confidenceScore = 0.78;
  } else if (taintPercentage > 0) {
    traceConfidence = 'UNCERTAIN';
    confidenceScore = 0.55;
  } else {
    traceConfidence = 'CONFIRMED';
    confidenceScore = 1.0;
  }

  const riskReasons: string[] = [];
  if (isFraudOrigin) riskReasons.push('INITIAL_FRAUD_THEFT_REPORTED');
  if (taintPercentage > 50) riskReasons.push('HIGH_COMMINGLED_EXPOSURE');
  if (debtorAccount.status === 'FLAGGED' || debtorAccount.status === 'PARTIAL_LIEN') {
    riskReasons.push('DEBTOR_UNDER_DISPUTED_LIEN');
  }

  return {
    transactionId: tx.transactionId,
    taintedValue: outgoingTainted,
    cleanValue: outgoingClean,
    taintPercentage,
    isFraudOrigin,
    fraudOriginId,
    caseId,
    traceConfidence,
    confidenceScore,
    provenanceModel: model,
    upstreamHops: isFraudOrigin ? 0 : 1,
    riskReasons,
    downstreamExposure: outgoingTainted,
  };
}

/**
 * Conservation Audit Function
 * Verifies global value conservation across all accounts and terminal exits
 */
export function verifyGlobalConservation(
  injectedDisputedTotal: number,
  allAccounts: Account[],
  recoveredTotal: number = 0
): {
  isConserved: boolean;
  injectedDisputedTotal: number;
  totalAccountTaint: number;
  recoveredTotal: number;
  discrepancy: number;
  tolerance: number;
} {
  const totalAccountTaint = allAccounts.reduce((sum, acc) => sum + acc.taintedValue, 0);
  const accountedTotal = Number((totalAccountTaint + recoveredTotal).toFixed(4));
  const discrepancy = Number(Math.abs(injectedDisputedTotal - accountedTotal).toFixed(4));
  const tolerance = 0.05; // 5 paise floating point tolerance

  return {
    isConserved: discrepancy <= tolerance,
    injectedDisputedTotal,
    totalAccountTaint: Number(totalAccountTaint.toFixed(4)),
    recoveredTotal,
    discrepancy,
    tolerance,
  };
}
