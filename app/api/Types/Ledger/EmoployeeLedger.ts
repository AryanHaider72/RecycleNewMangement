export interface responseEmployeeLedgerListGet {
  message: string;
  error: string;
  dataList: employeeLedegrList[];
  openingBalance: number;
}

export interface EmployeeLedgerAddRequest {
  empID: string;
  amount: number;
  postingDate: string;
  remarks: string;
  paymentType: string;
  bankID: string;
  paymentMode: string;
}
export interface EmployeeLedgerModifyRequest {
  empID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
  paymentType: string;
  bankID: string;
  paymentMode: string;
}

export interface employeeLedegrList {
  ledgerID: string;
  empID: string;
  empName: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  runningBalance: number;
  bankName: string;
  paymentMode: string;
  status: string;
  remarks: string;
}
