export interface responseProductListGet {
  message: string;
  error: string;
  dataList: ProductList[];
}

export interface ProductAddRequest {
  productName: string;
  shortCode: string;
  threshold: number;
  description: string;
}

export interface ProductList {
  productID: string;
  productName: string;
  salePrice?: number;
  availableQty?: number;
  shortCode: string;
  threshold: number;
  description: string;
}
