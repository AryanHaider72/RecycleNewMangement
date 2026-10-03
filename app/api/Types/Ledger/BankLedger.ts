export interface responseBankLedgerListGet {
  message: string;
  error: string;
  balance: number;
  dataList: BankLedegrList[];
}

export interface BankLedgerAddRequest {
  bankFromID: string;
  bankToID: string;
  postingDate: string;
  amount: number;
  transactionType: string;
  remarks: string;
}
export interface BankLedgerModifyRequest {
  bankID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}

export interface BankLedegrList {
  ledgerID: string;
  creditAmount: number;
  debitAmount: number;
  runningBalance: number;
  postingDate: string;
  myStatus: string;
  systemStatus: string;
  remarks: string;
}
