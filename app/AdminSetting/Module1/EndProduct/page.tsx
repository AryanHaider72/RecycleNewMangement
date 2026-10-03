"use client";
import ProductGetApi from "@/app/api/Controller/Codes/Product/GetProduct";
import AddEndProductApi from "@/app/api/Controller/Module1/EndProduct/AddEndProduct";
import GetEndProductApi from "@/app/api/Controller/Module1/EndProduct/GetEndProduct";
import ModifyEndProductApi from "@/app/api/Controller/Module1/EndProduct/ModifyEndProduct";
import {
  ProductList,
  responseProductListGet,
} from "@/app/api/Types/Codes/Product/Product";
import {
  EndProductList,
  GetResposneEndProduct,
} from "@/app/api/Types/module1/EndProductList";
import DropDownList from "@/app/ui/DropDown/DropDown";
import Heading from "@/app/ui/Heading/Heading";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useRef, useState } from "react";
import EndProductGetList from "./GetEndProductList";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import TotalScrapAvaliableApi from "@/app/api/Controller/Module1/EndProduct/TotalScrapAvaliable";

interface AvaliableScrap {
  message: string;
  error: string;
  totalScrap: number;
}
export default function EndProduct() {
  const hasFetchedEmployees = useRef(false);
  const [ShowForm, setShowForm] = useState(false);
  const [model, setModel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ShowDetail, setShowDetail] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [PostingDate, setPostingDate] = useState("");
  const [Qty, setQty] = useState("");
  const [SalePrice, setSalePrice] = useState("");
  const [CostPrice, setCostPrice] = useState("");
  const [Notes, setNotes] = useState("");
  const [ID, setID] = useState("");
  const [ProductName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [ScrapKG, setScrapKG] = useState("");
  const [TotalAvaliableScrap, setTotalAvaliableScrap] = useState("");
  const [ProductID, setProductID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<ProductList[]>([]);
  const [EndProductList, setEndProductList] = useState<EndProductList[]>([]);
  const [isloading, setisLoading] = useState(false);

  const eventTrigger = () => {
    setShowForm(!ShowForm);
    setModel(true);
    // resetFunction();
  };
  const eventTrigger2 = () => {
    resetFunction();
  };
  const resetFunction = () => {
    setProductName("");
    setPostingDate("");
    setProductID("");
    setCostPrice("");
    setID("");
    setScrapKG("");
    setSalePrice("");
    setQty("");
    setShowForm(false);
    setUpdate(false);
    setNotes("");
  };
  const EmployeeGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await ProductGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseProductListGet;
      setgetEmplyeeData(data.dataList);
    } else {
      setgetEmplyeeData([]);
    }
  };
  useEffect(() => {
    EmployeeGet();
    TotalScrap();
  }, []);
  const EndProductGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetEndProductApi(DateFrom, DateTo, String(token));
      if (response.status == 200) {
        const data = response.data as GetResposneEndProduct;
        setEndProductList(data.dataList);
      } else {
        setEndProductList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const TotalScrap = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await TotalScrapAvaliableApi(String(token));
      if (response.status == 200) {
        const data = response.data as AvaliableScrap;
        setTotalAvaliableScrap(String(data.totalScrap));
      } else {
        setTotalAvaliableScrap("0");
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    if (DateFrom && DateTo) {
      EndProductGet();
    }
  }, [DateFrom, DateTo]);

  const AddEndProduct = async () => {
    try {
      setLoading(true);
      if (!PostingDate || !ProductID || !Qty || !CostPrice || !SalePrice)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          postingDate: PostingDate,
          remarks: Notes,
          productID: ProductID,
          scrapKG: Number(ScrapKG),
          qty: Number(Qty),
          costPrice: Number(CostPrice),
          salePrice: Number(SalePrice),
        };
        const token = localStorage.getItem("adminToken");
        const response = await AddEndProductApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          EndProductGet();
          TotalScrap();
          setShowForm(false);
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const ModifyEndProduct = async () => {
    try {
      setLoading(true);
      if (!ID || !PostingDate || !ProductID || !Qty || !CostPrice || !SalePrice)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          endID: ID,
          postingDate: PostingDate,
          remarks: Notes,
          productID: ProductID,
          scrapKG: Number(ScrapKG),
          qty: Number(Qty),
          costPrice: Number(CostPrice),
          salePrice: Number(SalePrice),
        };
        const token = localStorage.getItem("adminToken");
        const response = await ModifyEndProductApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          EndProductGet();
          setShowForm(false);
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (EndProductList) {
      const data = EndProductList.find((item) => item.endID === ID);
      if (data) {
        setUpdate(true);
        setProductName(data.productName);
        setPostingDate(new Date(data.postingDate).toISOString().split("T")[0]);
        setProductID(data.productID);
        setCostPrice(String(data.costPrice));
        setScrapKG(String(data.scrapKG));
        setID(data.endID);
        setSalePrice(String(data.salePrice));
        setQty(String(data.qty));
        setNotes(data.remarks);
      }
    } else {
      resetFunction();
    }
  }, [EndProductList, ID]);
  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      {ShowForm && (
        <PopupComponent
          onClick={eventTrigger2}
          title={
            update
              ? "Edit End-Product (ترمیم)"
              : "New End-Product (حتمی پروڈکٹ)"
          }
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <InputFieldGeneric
                  label="Posting Date ( تاریخ)"
                  type="date"
                  required={true}
                  placeholder="Enter Posting Date"
                  SateChange={PostingDate}
                  setSateChange={setPostingDate}
                  disabled={false}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Product (پروڈکٹ)"
                  required={true}
                  placeholder="Enter Product"
                  filedID={setProductID}
                  options={getEmplyeeData.map((item) => ({
                    id: item.productID,
                    label: item.productName,
                    value: item.productName,
                  }))}
                  value={ProductName}
                  onChange={setProductName}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Qty (مقدار )"
                  type="number"
                  required={true}
                  placeholder="Enter Qty"
                  SateChange={Qty}
                  setSateChange={setQty}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label={`Scrap Qty (اسکریپ کی مقدار) - ${TotalAvaliableScrap} Kg`}
                  type="number"
                  required={true}
                  placeholder="Enter Scrap Qty"
                  SateChange={ScrapKG}
                  setSateChange={setScrapKG}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Cost Price (لاگت کی قیمت )"
                  type="number"
                  required={true}
                  placeholder="Enter Cost Price"
                  SateChange={CostPrice}
                  setSateChange={setCostPrice}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Sale Price (فروخت کی قیمت )"
                  type="number"
                  required={true}
                  placeholder="Enter Sale Price"
                  SateChange={SalePrice}
                  setSateChange={setSalePrice}
                  disabled={false}
                />
              </div>

              <div className="md:col-span-2">
                <TextAreaFieldGeneric
                  label="Notes"
                  required={false}
                  placeholder="Enter Notes"
                  SateChange={Notes}
                  setSateChange={setNotes}
                  disabled={false}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <ActionButton
                text={update ? "Update (اپ ڈیٹ)" : "Add Product (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Product..."}
                onClick={() => (update ? ModifyEndProduct() : AddEndProduct())}
                disabled={false}
              />
            </div>
            {/* <div className="flex justify-end mt-2">
              <ActionButton
                text={update ? "Update (اپ ڈیٹ)" : "Add Expense (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Expense..."}
                onClick={() => (update ? ExpenseModify() : ExpenseAdd())}
                disabled={false}
              />
            </div> */}
          </div>
        </PopupComponent>
      )}
      <Heading
        heading="End-Product Module (حتمی پروڈکٹ)"
        subHeading="(تمام حتمی پروڈکٹ)"
        onClick={eventTrigger}
      />
      <div className="mt-8">
        <EndProductGetList
          EndProductListMain={EndProductList}
          isLoading={isloading}
          searchDateFrom={setDateFrom}
          searchDateTo={setDateTo}
          setID={(item) => {
            setID(item);
            setShowForm(true);
          }}
        />
      </div>
    </>
  );
}
