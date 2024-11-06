export interface Wallet {
  id: string;
  walletName: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  qrCodeUrl: string;
  status: boolean;
  uid: string;
}
