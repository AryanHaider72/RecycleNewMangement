export interface responseBankLedgerListGet {
  message: string;
  error: string;
  dataList: BankLedegrList[];
}

export interface BankLedgerAddRequest {
  bankID: string;
  amount: number;
  postingDate: string;
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
  bankID: string;
  accountTitle: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  status: string;
  remarks: string;
}
