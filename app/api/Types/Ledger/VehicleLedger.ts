export interface responsevehicleLedgerListGet {
  message: string;
  error: string;
  dataList: vehicleLedegrList[];
}

export interface vehicleLedgerAddRequest {
  vehicleID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}
export interface vehicleLedgerModifyRequest {
  vehicleID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}

export interface vehicleLedegrList {
  ledgerID: string;
  vehicleID: string;
  vehicleName: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  status: string;
  remarks: string;
}
