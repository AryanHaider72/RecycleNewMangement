export interface responseSupplierLedgerListGet {
  message: string;
  error: string;
  dataList: SupplierLedegrList[];
  openingBalance: number;
  balance: number;
}

export interface SupplierLedgerAddRequest {
  supplierID: string;
  amount: number;
  paymentMode: string;
  bankID: string;
  postingDate: string;
  remarks: string;
}
export interface SupplierLedgerModifyRequest {
  supplierID: string;
  ledgerID: string;
  paymentMode: string;
  bankID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}

export interface SupplierLedegrList {
  ledgerID: string;
  creditAmount: number;
  debitAmount: number;
  runningBalance: number;
  bankID: string;
  supplierID: string;
  supplierName: string;
  bankName: string;
  paymentMode: string;
  postingDate: string;
  status: string;
  remarks: string;
}
