export interface responsePurchaseTripListGet {
  message: string;
  error: string;
  dataList: purchaseTripList[];
}

export interface ModifyPurchaseTripRequest {
  tripID: string;
  postingDate: string;
  vehicleID: string;
  empID: string;
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
}

export interface AddPurchaseTripRequest {
  postingDate: string;
  vehicleID: string;
  empID: string;
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
}
export interface scrapPurcahse {
  supplierID: string;
  supplierName?: string;
  purchaseKg: number;
  purchasedRate: number;
  amountPaid: number;
}
interface fuelExpense {
  liter: number;
  rate: number;
  paymentMode: string;
  supplierID: string;
}
interface tripExpense {
  expenseID: string;
  expenseName?: string;
  amount: number;
  paidBy: string;
  paymentMode: string;
}
export interface purchaseTripList {
  tripID: string;
  tripNo: string;
  postingDate: string;
  vehicleID: string;
  vehicleNo: string;
  empID: string;
  empName: string;
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
}
