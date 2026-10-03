"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useRef, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

import { OwnerList } from "@/app/api/Types/Codes/Owner/Owner";
import OwnerAddApi from "@/app/api/Controller/Codes/Owner/AddOwner";
import OwnerModifyApi from "@/app/api/Controller/Codes/Owner/ModifyOwner";
import ProductAddApi from "@/app/api/Controller/Codes/Product/AddProduct";
import ProductModifyApi from "@/app/api/Controller/Codes/Product/ModifyProduct";
import {
  ProductList,
  responseProductListGet,
} from "@/app/api/Types/Codes/Product/Product";
import ProductGetList from "./ProductDetail";
import ProductGetApi from "@/app/api/Controller/Codes/Product/GetProduct";

export default function BankManagement() {
  const hasFetchedEmployees = useRef(false);
  const [ShowForm, setShowForm] = useState(false);
  const [ProductName, setProductName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [ShortCode, setShortCode] = useState("");
  const [Threshold, setThreshold] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [GetProductDateList, setGetProductDateList] = useState<ProductList[]>(
    [],
  );
  const [isloading, setisLoading] = useState(false);
  const [getEmplyeeData, setgetEmplyeeData] = useState<ProductList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const moduleList = [
    { ID: "1", label: "Owner" },
    { ID: "2", label: "Investor" },
  ];

  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };
  const resetFunction = () => {
    setProductName("");
    setShortCode("");
    setPhoneNo("");
    setThreshold("");
    setID("");
    setNotes("");
    setUpdate(false);
  };
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await ProductGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseProductListGet;
        setGetProductDateList(data.dataList);
      } else {
        setGetProductDateList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    if (hasFetchedEmployees.current) return;

    hasFetchedEmployees.current = true;
    EmployeeGet();
  }, []);
  const ProductAdd = async () => {
    try {
      setLoading(true);
      if (!ProductName) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          productName: ProductName,
          shortCode: ShortCode,
          threshold: Number(Threshold),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ProductAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          EmployeeGet();
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const ProductModify = async () => {
    try {
      setLoading(true);
      if (!ProductName || !ID) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          productID: ID,
          productName: ProductName,
          shortCode: ShortCode,
          threshold: Number(Threshold),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ProductModifyApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          EmployeeGet();
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
    if (getEmplyeeData) {
      setUpdate(true);
      setShowForm(true);
      setProductName(getEmplyeeData.productName);
      setThreshold(String(getEmplyeeData.threshold));
      setShortCode(getEmplyeeData.shortCode);
      setID(getEmplyeeData.productID);
      setNotes(getEmplyeeData.description);
    } else {
      resetFunction();
    }
  }, [getEmplyeeData]);
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
          onClick={eventTrigger}
          title={update ? "Edit Product (ترمیم)" : "New Product (نئے پروڈکٹ)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label=" Product Name (نام)"
                  type="text"
                  required={true}
                  placeholder="Enter  Product Name"
                  SateChange={ProductName}
                  setSateChange={setProductName}
                  disabled={false}
                />
              </div>
              <div className="mt-2">
                <InputFieldGeneric
                  label=" ShortCode (پتہ)"
                  type="text"
                  required={false}
                  placeholder="Enter ShortCode"
                  SateChange={ShortCode}
                  setSateChange={setShortCode}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Threshold "
                  type="number"
                  required={false}
                  placeholder="Enter Threshold"
                  SateChange={Threshold}
                  setSateChange={setThreshold}
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
                onClick={() => (update ? ProductModify() : ProductAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Product (پروڈکٹ)"
          subHeading="(تمام پروڈکٹ)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <ProductGetList
            initalData={setgetEmplyeeData}
            setGetProductDateList={GetProductDateList}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
