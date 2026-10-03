export interface PurcahseTripReportReposne {
  message: string;
  error: string;
  dataList: PurcahseTripReport[];
}

export interface PurcahseTripReport {
  tripDate: string;
  employeeName: string;
  supplierList: supplierList[];
}
export interface supplierList {
  vehicleNo: string;
  phoneNo: string;
  supplierName: string;
  qty: number;
  runningPurchaseAmmount: number;
  runningPurchaseKG: number;
  rate: number;
  amountPaid: number;
  averageRate: number;
}
