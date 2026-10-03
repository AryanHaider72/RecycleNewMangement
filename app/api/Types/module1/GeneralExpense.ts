export interface RequeestAddGeneralExpense {
  categoryID: string;
  expnseType: string;
  bankID: string;
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
  categoryID: string;
  expenseName?: string;
  expnseType: string;
  bankID: string;
  bankName?: string;
  expenseDate: string;
  expenseAmount: number;
  paymentMethod: string;
  status?: string;
  description: string;
}
