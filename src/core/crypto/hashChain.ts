/**
 * Cryptographic Hash Chain and Integrity Verification
 * Implements tamper-evident audit logging and transaction block hashing:
 * H_n = SHA-256(Record_n + H_{n-1})
 */

export async function sha256(message: string): Promise<string> {
  // Use browser CryptoSubtle if available, fallback to pure JS implementation for universal safety
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Pure JS SHA-256 fallback
  return sha256Sync(message);
}

export function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);

  for (i = 0; i < ascii.length; i++) {
    const jIndex = i >> 2;
    words[jIndex] = (words[jIndex] || 0) | ((ascii.charCodeAt(i) & 255) << (8 * (3 - (i % 4))));
  }

  words[asciiBitLength >> 5] = (words[asciiBitLength >> 5] || 0) | (0x80 << (24 - (asciiBitLength % 32)));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (let blockIndex = 0; blockIndex < words.length; blockIndex += 16) {
    const w = words.slice(blockIndex, blockIndex + 16);
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      let w15 = w[i - 15];
      let w2 = w[i - 2];

      const s0 = i >= 16 ? rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3) : 0;
      const s1 = i >= 16 ? rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10) : 0;

      if (i >= 16) {
        w[i] = ((w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff) >>> 0;
      }

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + w[i]) >>> 0;
      const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) >>> 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) >>> 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) >>> 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) >>> 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

export interface ChainedRecord {
  index: number;
  data: string;
  previousHash: string;
  hash: string;
}

export function computeNextHash(recordData: string, previousHash: string): string {
  return sha256Sync(recordData + '::' + previousHash);
}

export function verifyChainIntegrity(records: ChainedRecord[]): {
  valid: boolean;
  tamperedIndex?: number;
  reason?: string;
} {
  if (records.length === 0) return { valid: true };

  for (let i = 0; i < records.length; i++) {
    const current = records[i];
    const prevHash = i === 0 ? 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000' : records[i - 1].hash;

    if (current.previousHash !== prevHash) {
      return {
        valid: false,
        tamperedIndex: i,
        reason: `Previous hash pointer mismatch at index ${i}. Expected ${prevHash.substring(0, 10)}... but found ${current.previousHash.substring(0, 10)}...`,
      };
    }

    const expectedHash = computeNextHash(current.data, prevHash);
    if (current.hash !== expectedHash) {
      return {
        valid: false,
        tamperedIndex: i,
        reason: `Content hash mismatch at index ${i}. Data was altered! Calculated: ${expectedHash.substring(0, 10)}... vs Recorded: ${current.hash.substring(0, 10)}...`,
      };
    }
  }

  return { valid: true };
}
