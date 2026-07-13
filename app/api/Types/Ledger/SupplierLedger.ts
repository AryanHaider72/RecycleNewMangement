export interface responseSupplierLedgerListGet {
  message: string;
  error: string;
  dataList: SupplierLedegrList[];
}

export interface SupplierLedgerAddRequest {
  supplierID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}
export interface SupplierLedgerModifyRequest {
  supplierID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}

export interface SupplierLedegrList {
  ledgerID: string;
  supplierID: string;
  supplierName: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  status: string;
  remarks: string;
}
