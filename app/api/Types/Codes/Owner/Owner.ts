export interface responseOwnerListGet {
  message: string;
  error: string;
  dataList: OwnerList[];
}

export interface OwnerAddRequest {
  name: string;
  phoneNo: string;
  address: string;
  type: string;
  openingBalance: number;
  description: string;
}

export interface OwnerList {
  ownerID: string;
  name: string;
  type: string;
  phoneNo: string;
  address: string;
  openingBalance: number;
  description: string;
}
