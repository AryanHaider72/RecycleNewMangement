export interface AddRequestSalryLabour {
  labourList: labourListSalary[];
  postingDate: string;
}
export interface labourListSalary {
  empID: string;
  employeeName?: string;
  qty: number;
  amount: number;
  rateKG?: number;
  labourID: string;
  labourType?: string;
  remarks: string;
}
export interface responseGetSalaryLabour {
  message: string;
  error: string;
  dataList: ListLabourSalrayData[];
}
export interface ListLabourSalrayData {
  salaryID: string;
  postingDate: string;
  empID: string;
  employeeName: string;
  labourList: labourListSalary[];
}
