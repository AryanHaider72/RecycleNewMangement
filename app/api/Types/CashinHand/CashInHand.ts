export interface ResposneCashInHand {
  error: string;
  message: string;
  dataList: cashInList[];
}
export interface cashInList {
  cashID: string;
  postingDate: string;
  amount: number;
  remarks: string;
}
