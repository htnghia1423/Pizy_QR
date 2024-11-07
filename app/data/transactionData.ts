import { Transaction } from "../models/Transaction";

export const transactionDataList: Transaction[] = [
  {
    senderName: "HO TRONG NGHIA",
    bankNumber: "101984221",
    amount: 50000,
    walletId: "-OAzBsPXjBAUTRMkQ5CW",
    timestamp: new Date().toISOString(),
  },
  {
    senderName: "NGUYEN VAN A",
    bankNumber: "987654321",
    amount: 100000,
    walletId: "-OAzBsPXjBAUTRMkQ5CW",
    timestamp: new Date().toISOString(),
  },
  {
    senderName: "TRAN VAN B",
    bankNumber: "456789123",
    amount: 75000,
    walletId: "-OAzBsPXjBAUTRMkQ5CW",
    timestamp: new Date().toISOString(),
  },
];
