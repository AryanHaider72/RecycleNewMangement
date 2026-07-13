export interface responseCustomerListGet {
  message: string;
  error: string;
  dataList: CustomerList[];
}

export interface CustomerAddRequest {
  name: string;
  phoneNo: string;
  type: string;
  address: string;
  openingBalance: number;
  description: string;
}

export interface CustomerList {
  customerID: string;
  name: string;
  type: string;
  phoneNo: string;
  address: string;
  openingBalance: number;
  description: string;
}
