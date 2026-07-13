export interface responseBankListGet {
  message: string;
  error: string;
  dataList: BankList[];
}

export interface BankAddRequest {
  bankName: string;
  accountNumber: string;
  accountTitle: string;
  openingBalance: number;
  description: string;
}

export interface BankList {
  bankID: string;
  bankName: string;
  accountNumber: string;
  accountTitle: string;
  openingBalance: number;
  description: string;
}
