export interface responseEmployeeListGet {
  message: string;
  error: string;
  dataList: employeeList[];
}

export interface EmployeeAddRequest {
  name: string;
  phoneNo: string;
  address: string;
  dept: string;
  wagesType: string;
  cnic: string;
  salary: number;
  description: string;
  status: string;
}

export interface employeeList {
  empID: string;
  name: string;
  phoneNo: string;
  address: string;
  dept: string;
  wagesType: string;
  cnic: string;
  salary: number;
  description: string;
  status: string;
}
