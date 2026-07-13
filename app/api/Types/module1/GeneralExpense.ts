export interface RequeestAddGeneralExpense {
  expenseName: string;
  expnseType: string;
  expenseDate: string;
  expenseAmount: number;
  paymentMethod: string;
  description: string;
}
export interface GetExpenseListResposne {
  message: string;
  error: string;
  dataList: generalExpenseList[];
}
export interface generalExpenseList {
  expenseID: string;
  expenseName: string;
  expnseType: string;
  expenseDate: string;
  expenseAmount: number;
  paymentMethod: string;
  description: string;
}
