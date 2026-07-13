export interface responseOwnerLedgerListGet {
  message: string;
  error: string;
  dataList: OwnerLedegrList[];
}

export interface OwnerLedgerAddRequest {
  ownerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}
export interface OwnerLedgerModifyRequest {
  ownerID: string;
  ledgerID: string;
  amount: number;
  postingDate: string;
  remarks: string;
}

export interface OwnerLedegrList {
  ledgerID: string;
  ownerID: string;
  ownerName: string;
  creditAmount: number;
  debitAmount: number;
  postingDate: string;
  status: string;
  remarks: string;
}
