export interface responsePurchaseTripListGet {
  message: string;
  error: string;
  dataList: purchaseTripList[];
}

export interface ModifyPurchaseTripRequest {
  tripID: string;
  postingDate: string;
  ratePerKg: number;
  vehicleID: string;
  empID: string;
  bankID: string;
  advanceAmount: number;
  paymentMode: string;
  weightEmptyKG: number;
  weightLoadedKG: number;
  meterstartKG: number;
  meterEndKG: number;
  description: string;
  scrapPurchase: scrapPurcahse[];
  fuelExpense: fuelExpense[];
  tripExpense: tripExpense[];
  labourList: labourList[];
}

export interface AddPurchaseTripRequest {
  postingDate: string;
  vehicleID: string;
  empID: string;
  salary: number;
  ratePerKg: number;
  bankID: string;
  advanceAmount: number;
  profitLoss: number;
  remainingCash: number;
  paymentMode: string;
  weightEmptyKG: number;
  weightLoadedKG: number;
  meterstartKG: number;
  meterEndKG: number;
  description: string;
  scrapPurchaseProfitLoss: scrapPurcahse;
  scrapPurchase: scrapPurcahse[];
  fuelExpense: fuelExpense[];
  tripExpense: tripExpense[];
  labourList: labourList[];
  customerRecovery: customerRecovery[];
  supplierPayment: supplierPayment[];
}
export interface labourList {
  employeeID: string;
  employeeName?: string;
  isPaid: boolean;
  rate: number;
}
export interface customerRecovery {
  customerID: string;
  rate: number;
}
export interface supplierPayment {
  supplierID: string;
  rate: number;
}
export interface scrapPurcahse {
  scrapID?: string;
  supplierID: string;
  phoneNo: string;
  supplierName?: string;
  purchaseKg: number;
  purchasedRate: number;
  amountPaid: number;
}
interface fuelExpense {
  expenseID: string;
  liter: number;
  rate: number;
  paymentMode: string;

  supplierID: string;
}
interface tripExpense {
  expenseID: string;
  expenseName?: string;
  amount: number;
  companyCash?: boolean;
  bankID?: string;
  paidBy: string;
  paymentMode: string;
}
export interface purchaseTripList {
  tripID: string;
  postingDate: string;
  vehicleID: string;
  vehicleNo: string;
  empID: string;
  empName: string;
  bankID: string;
  bankName: string;
  advanceAmount: number;
  paymentMode: string;
  averageRate: number;
  weightEmptyKG: number;
  weightLoadedKG: number;
  meterstartKG: number;
  meterEndKG: number;
  description: string;
  labourList: labourListResposne[];
  scrapPurchase: scrapPurcahse[];
  fuelExpense: fuelExpense[];
  tripExpense: tripExpense[];
  customerRecovery: customerRecoveryResponse[];
  supplierPayments: supplierPaymentsRespoonse[];
}
export interface labourListResposne {
  labourName: string;
  labourPaid: string;
  labourDue: string;
}
interface customerRecoveryResponse {
  customerID: string;
  customerName: string;
  remarks: string;
  amount: number;
}
interface supplierPaymentsRespoonse {
  supplierID: string;
  supplierName: string;
  remarks: string;
  amountCredit: number;
  amountDebit: number;
}
