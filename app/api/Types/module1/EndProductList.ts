export interface GetResposneEndProduct {
  message: string;
  error: string;
  dataList: EndProductList[];
}
export interface EndProductList {
  postingDate: string;
  remarks: string;
  endID: string;
  productID: string;
  scrapKG: number;
  productName: string;
  qty: number;
  costPrice: number;
  salePrice: number;
}
