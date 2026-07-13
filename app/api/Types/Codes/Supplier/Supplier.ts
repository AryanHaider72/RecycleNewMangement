export interface responseSupplierListGet {
  message: string;
  error: string;
  dataList: SupplierList[];
}

export interface SupplierAddRequest {
  name: string;
  phoneNo: string;
  address: string;
  accountType: string;
  openingBalance: number;
  description: string;
}

export interface SupplierList {
  supplierID: string;
  name: string;
  phoneNo: string;
  accountType: string;
  address: string;
  openingBalance: number;
  description: string;
}
