export interface Transaction {
  id?: string;
  senderName: string;
  bankNumber: string;
  amount: number;
  walletId: string;
  timestamp: string;
}
