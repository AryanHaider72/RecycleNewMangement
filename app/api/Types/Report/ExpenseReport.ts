export interface ExpenseReportReposne {
  message: string;
  error: string;
  dataList: ExpenseReport[];
}
export interface ExpenseReport {
  expenseID: string;
  categoryName: string;
  amount: number;
  expenseDate: string;
  status: string;
  paymentMode: string;
  bankID: string;
  accountTitle: string;
  remakrs: string;
}
