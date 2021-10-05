import type { BigNumber } from "bignumber.js";
import { RangeRaw } from "../../range";
import type {
  TransactionCommon,
  TransactionCommonRaw,
} from "../../types/transaction";
export type CoreStatics = Record<string, never>;
export type CoreAccountSpecifics = Record<string, never>;
export type CoreOperationSpecifics = Record<string, never>;
export type CoreCurrencySpecifics = Record<string, never>;
export type ElrondResources = {
  nonce: number;
};

/**
 * Elrond account resources from raw JSON
 */
export type ElrondResourcesRaw = {
  nonce: number;
};

export type ElrondProtocolTransaction = {
  nonce: number;
  value: string;
  receiver: string;
  sender: string;
  gasPrice: number;
  gasLimit: number;
  chainID: string;
  signature?: string;
  data?: string; //for ESDT or stake transactions
  version: number;
  options: number;
}
/**
 * Elrond transaction
 */
export type Transaction = TransactionCommon & {
  mode: string;
  family: "elrond";
  fees: BigNumber | null | undefined;
  txHash?: string;
  sender?: string;
  receiver?: string;
  value?: BigNumber;
  blockHash?: string;
  blockHeight?: number;
  timestamp?: number;
  nonce?: number;
  status?: string;
  fee?: BigNumber;
  round?: number;
  miniBlockHash?: string;
  data?: string;
};

export type ESDTTransaction = Transaction & {
  type: 'ESDT'
  tokenIdentifier?: string;
  tokenValue?: string;
}

export type ESDTToken = {
  identifier: string;
  name: string;
  balance: string;
}

/**
 * Elrond transaction from a raw JSON
 */
export type TransactionRaw = TransactionCommonRaw & {
  family: "elrond";
  mode: string;
  fees: string | null | undefined;
};
export type ElrondValidator = {
  bls: string;
  identity: string;
  owner: string;
  provider: string;
  type: string;
  status: string;
  nonce: number;
  stake: BigNumber;
  topUp: BigNumber;
  locked: BigNumber;
  online: boolean;
};

export type NetworkInfo = {
  family?: "elrond";
  chainID: string;
  denomination: number;
  gasLimit: number;
  gasPrice: number;
  gasPerByte: number;
};

export type NetworkInfoRaw = {
  family?: "elrond";
  chainID: string;
  denomination: number;
  gasLimit: number;
  gasPrice: number;
  gasPerByte: number;
};

export type ElrondPreloadData = {
  validators: Record<string, any>;
};
export const reflect = (_declare: any) => {};
