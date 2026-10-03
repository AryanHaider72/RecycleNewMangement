import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import CustomerGetApi from "@/app/api/Controller/Codes/Customer/CustomerGet";
import ProductGetApi from "@/app/api/Controller/Codes/Product/GetProduct";
import SaleAddApi from "@/app/api/Controller/Module1/SaleModule/AddSale";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import {
  CustomerList,
  responseCustomerListGet,
} from "@/app/api/Types/Codes/Customer/Customer";
import {
  ProductList,
  responseProductListGet,
} from "@/app/api/Types/Codes/Product/Product";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import StatsCard from "@/app/ui/StatCard/StatCard";
import { Trash } from "lucide-react";
import { refresh } from "next/cache";
import { useEffect, useState } from "react";

interface CartList {
  productID: string;
  productName: string;
  avalibleQty: string;
  qty: string;
  salePrice: string;
}
interface PropsPurchaseTrip {
  update: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
  setRefresh: (data: number) => void;
}
export default function AddSaleForm({
  update,
  onShowMessage,
  setRefresh,
}: PropsPurchaseTrip) {
  const [PostingDate, setPostingDate] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [BankID, setBankID] = useState("");
  const [BankName, setBankName] = useState("");
  const [getBankData, setgetBankData] = useState<BankList[]>([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [CustomerList, setCustomerList] = useState<CustomerList[]>([]);
  const [ProductList, setProductList] = useState<ProductList[]>([]);
  const [PaymentID, setPaymentID] = useState("");
  const payment = [
    { ID: "1", method: "Cash" },
    { ID: "2", method: "Bank" },
  ];
  const [cartData, setCartData] = useState<CartList[]>([]);

  const resetFunction = () => {
    setCustomerID("");
    setCustomerName("");
    setCartData([]);
    setAmountPaid("");
  };

  const BankGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await BankGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseBankListGet;
      setgetBankData(data.dataList);
    } else {
      setgetBankData([]);
    }
  };
  useEffect(() => {
    BankGet();
  }, []);
  const updateDataTripExpense = (
    index: number,
    field: keyof CartList,
    value: string | number,
  ) => {
    setCartData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const deleteRowTripExpense = (index: number) => {
    setCartData((prev) => prev.filter((_, i) => i !== index));
  };
  const addRowTrip = () => {
    setCartData((prev) => [
      ...prev,
      {
        productID: "",
        productName: "",
        qty: "",
        avalibleQty: "",
        salePrice: "",
      },
    ]);
  };

  const ProductGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await ProductGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseProductListGet;
      setProductList(data.dataList);
    } else {
      setProductList([]);
    }
  };

  const CustomerGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await CustomerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseCustomerListGet;
      setCustomerList(data.dataList);
    } else {
      setCustomerList([]);
    }
  };
  useEffect(() => {
    ProductGet();
    CustomerGet();
  }, []);

  const total = cartData.reduce((sum, item) => {
    return sum + Number(item.salePrice) * Number(item.qty);
  }, 0);
  const SaleAdd = async () => {
    try {
      setLoading(true);
      if (!PostingDate || !CustomerID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          postingDate: PostingDate,
          customerID: CustomerID,
          amountPaid: Number(amountPaid),
          totalBill: Number(total),
          paymentMode: PaymentMethod,
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          productList: cartData.map((item) => ({
            productID: item.productID,
            productName: item.productName,
            qty: Number(item.qty),
            salePrice: Number(item.salePrice),
          })),
        };
        //console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await SaleAddApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");
          setRefresh(1);
          resetFunction();
        } else {
          onShowMessage(response.data.message, "error");
          //console.log(response);
          // setMessageType("error");
          // setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div>
        <div>
          <div className="mt-4 mb-2">
            <div className="w-full flex justify-between">
              <div>
                <h1 className="text-gray-600 font-medium">
                  Sale Info (سیل معلومات)
                </h1>
              </div>
            </div>
            <hr className="border-gray-300 mt-1 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 ">
            <div>
              <InputFieldGeneric
                label="Sale Date (ٹرپ  کی تاریخ )"
                type="date"
                required={true}
                placeholder="Enter Trip Date"
                SateChange={PostingDate}
                setSateChange={setPostingDate}
                disabled={false}
              />
            </div>
            <div className="mt-2">
              <DropDownList
                label="Customer (گاہک)"
                required={true}
                placeholder="Enter Customer"
                filedID={setCustomerID}
                options={CustomerList.map((item) => ({
                  id: item.customerID,
                  label: item.name,
                  value: item.name,
                }))}
                value={CustomerName}
                onChange={setCustomerName}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="mt-4 mb-2">
            <div className="w-full flex justify-between">
              <h1 className="text-gray-600 font-medium">
                Qty/Price (مقدار/قیمت)
              </h1>
              <button
                title="Add Cart Product"
                className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                onClick={addRowTrip}
              >
                +Add Row (قطار شامل کریں)
              </button>
            </div>
            <hr className="border-gray-300 mt-1 w-full" />
          </div>
          {cartData.length > 0 && (
            <div className="space-y-2">
              {cartData.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                    value={item.productID}
                    onChange={(e) => {
                      const data = ProductList.find(
                        (item) => item.productID === e.target.value,
                      );
                      if (data) {
                        setCartData((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  avalibleQty: String(data.availableQty),
                                }
                              : item,
                          ),
                        );
                        updateDataTripExpense(
                          index,
                          "salePrice",
                          String(data.salePrice),
                        );
                      }
                      updateDataTripExpense(index, "productID", e.target.value);
                    }}
                  >
                    <option>{"Select Product"}</option>
                    {ProductList.map((item) => (
                      <option value={item.productID}>
                        {item.productName + " - " + item.availableQty}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.qty}
                    placeholder="Qty (تعداد)"
                    max={item.avalibleQty}
                    min={0}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                    onChange={(e) =>
                      updateDataTripExpense(index, "qty", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={item.salePrice}
                    placeholder="Sale Price (فروخت کی قیمت)"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                    onChange={(e) =>
                      updateDataTripExpense(index, "salePrice", e.target.value)
                    }
                  />

                  <div>
                    <button
                      onClick={() => deleteRowTripExpense(index)}
                      className="h-10 w-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="mt-4 mb-2">
            <h1 className="text-gray-600 font-medium">
              Billing Info (بلنگ معلومات)
            </h1>
            <hr className="border-gray-300 mt-1 w-full" />
          </div>
          <div className="flex gap-2 ">
            <div className="w-full ">
              <input
                value={total}
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm text-center "
                readOnly
              />
            </div>
            <div className="w-full">
              <DropDownList
                label=""
                required={true}
                placeholder="Enter Payment Mode"
                filedID={setPaymentID}
                options={payment.map((item) => ({
                  id: item.ID,
                  label: item.method,
                  value: item.method,
                }))}
                value={PaymentMethod}
                onChange={setPaymentMethod}
              />
            </div>
            {PaymentMethod === "Bank" && (
              <div className="w-full">
                <DropDownList
                  label=""
                  required={true}
                  placeholder="Enter Bank"
                  filedID={setBankID}
                  options={getBankData.map((item) => ({
                    id: item.bankID,
                    label: item.accountTitle,
                    value: item.accountTitle,
                  }))}
                  value={BankName}
                  onChange={setBankName}
                />
              </div>
            )}
            <div className="w-full ">
              <input
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                type="number"
                placeholder="Amount Paid (ادا کردہ رقم)"
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm "
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <ActionButton
            text={update ? "Update (اپ ڈیٹ)" : "Add Sale (شامل کریں)"}
            update={loading}
            loading={loading}
            size={"w-full"}
            loadingtext={update ? "Updating..." : "Adding Sale..."}
            onClick={() => SaleAdd()}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
}
