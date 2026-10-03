export interface responseSaleListGet {
  message: string;
  error: string;
  dataList: SaleList[];
}
export interface SaleList {
  saleID: string;
  invoiceNo: string;
  postingDate: string;
  customerID: string;
  customerName: string;
  phoneNo?: string;
  amountPaid: number;
  bankID: string;
  bankName: string;
  paymentMode: string;
  totalBill: number;
  productList: productListCart[];
}
export interface productListCart {
  productID: string;
  productName?: string;
  qty: number;
  salePrice: number;
}

export interface AddSaleRequest {
  postingDate: string;
  customerID: string;
  amountPaid: number;
  totalBill: number;
  productList: productListCart[];
}
