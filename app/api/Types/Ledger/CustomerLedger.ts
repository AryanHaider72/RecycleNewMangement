export interface responseCustomerLedgerListGet {
  message: string;
  error: string;
  dataList: CustomerLedegrList[];
}

export interface CustomerLedgerAddRequest {
  customerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}
export interface CustomerLedgerModifyRequest {
  customerID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}

export interface CustomerLedegrList {
  ledgerID: string;
  customerID: string;
  customerName: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  status: string;
  remarks: string;
}
