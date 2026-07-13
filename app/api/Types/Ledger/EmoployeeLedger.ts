export interface responseEmployeeLedgerListGet {
  message: string;
  error: string;
  dataList: employeeLedegrList[];
}

export interface EmployeeLedgerAddRequest {
  empID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}
export interface EmployeeLedgerModifyRequest {
  empID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}

export interface employeeLedegrList {
  ledgerID: string;
  empID: string;
  empName: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  status: string;
  remarks: string;
}
