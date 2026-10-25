import { postData, getData } from "./services";

// Types

export interface WalletData {
  balance: number;
  is_active: boolean;
}

export interface WalletBalanceResponse {
  statusCode: number;
  // Allow message to be a string OR the nested object from the 422 error
  message: string | Record<string, unknown>;
  // Allow data to be null
  data: WalletData | null;
}

export interface DepositPayload {
  amount: number;
}

export interface DepositResponse {
  data: Record<string, unknown>;
  message: string;
  statusCode: number;
}

export interface Transaction {
  amount: number;
  created_at: number;
  id: number;
  reason: string;
  type: string;
}

export interface WalletTransactionsResponse {
  statusCode: number;
  message: string;
  data: Transaction[];
}

// Service Functions

export const getWalletBalanceService =
  async (): Promise<WalletBalanceResponse> => {
    return getData({
      endPoint: `/v1/wallet`,
    });
  };

export const depositWalletService = async (
  payload: DepositPayload,
): Promise<DepositResponse> => {
  return postData({
    endPoint: `/v1/wallet/deposit`,
    data: payload,
  });
};

export const getWalletTransactionsService =
  async (): Promise<WalletTransactionsResponse> => {
    return getData({
      endPoint: `/v1/wallet/transactions`,
    });
  };
