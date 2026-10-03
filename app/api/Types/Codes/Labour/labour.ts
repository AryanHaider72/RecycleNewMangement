export interface responseLabourListGet {
  message: string;
  error: string;
  dataList: labourList[];
}

export interface LabourAddRequest {
  labourType: string;
  rateKG: number;
}

export interface labourList {
  labourID: string;
  labourType: string;
  qty: number;
  rateKG: number;
}
