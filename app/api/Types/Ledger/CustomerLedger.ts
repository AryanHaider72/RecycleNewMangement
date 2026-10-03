export interface responseCustomerLedgerListGet {
  message: string;
  error: string;
  dataList: CustomerLedegrList[];
  balance: number;
}

export interface CustomerLedgerAddRequest {
  customerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
  bankID: string;
  paymentMode: string;
}
export interface CustomerLedgerModifyRequest {
  customerID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  bankID: string;
  paymentMode: string;
  remarks: string;
}

export interface CustomerLedegrList {
  ledgerID: string;
  customerID: string;
  customerName: string;
  bankID: string;
  bankName: string;
  paymentMode: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  status: string;
  remarks: string;
}
