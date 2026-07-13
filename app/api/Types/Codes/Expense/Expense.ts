export interface responseExpenseListGet {
  message: string;
  error: string;
  dataList: ExpenseList[];
}

export interface ExpenseAddRequest {
  categoryName: string;
  expenseType: string;
  description: string;
}

export interface ExpenseList {
  expID: string;
  categoryName: string;
  expenseType: string;
  description: string;
}
