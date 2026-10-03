"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useRef, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import ExpenseAddApi from "@/app/api/Controller/Codes/Expense/AddExpense";
import ExpenseModifyApi from "@/app/api/Controller/Codes/Expense/ModifyExpense";

import BankModifyApi from "@/app/api/Controller/Codes/Bank/ModifyBank";
import BankAddApi from "@/app/api/Controller/Codes/Bank/AddBank";
import {
  OwnerList,
  responseOwnerListGet,
} from "@/app/api/Types/Codes/Owner/Owner";
import OwnerAddApi from "@/app/api/Controller/Codes/Owner/AddOwner";
import OwnerModifyApi from "@/app/api/Controller/Codes/Owner/ModifyOwner";
import OwnerGetList from "./OwnerListData";
import { RefreshCcwDotIcon } from "lucide-react";
import OwnerGetApi from "@/app/api/Controller/Codes/Owner/GetOwner";

export default function BankManagement() {
  const hasFetchedEmployees = useRef(false);
  const [refresh, setRefresh] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const [Name, setName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [getOwnerData, setgetOwnerData] = useState<OwnerList>();
  const [getEmplyeeData, setgetEmplyeeData] = useState<OwnerList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [GetOwnerDateForList, setGetOwnerDateForList] = useState<OwnerList[]>(
    [],
  );
  const [isloading, setisLoading] = useState(false);
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
    setName("");
    setAddress("");
    setModule("");
    setModuleID("");
    setPhoneNo("");
    setOpeningBalance("");
    setID("");
    setNotes("");
    setUpdate(false);
  };
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await OwnerGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseOwnerListGet;
        setGetOwnerDateForList(data.dataList);
      } else {
        setGetOwnerDateForList([]);
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
  const OwnerAdd = async () => {
    try {
      setLoading(true);
      if (Module !== "Owner" && Module !== "Investor") {
        return alert("Please Select From OwnerShip Type");
      }
      if (!Name || !Address || !PhoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          name: Name,
          address: Address,
          type: Module,
          phoneNo: PhoneNo,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await OwnerAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          EmployeeGet();
          setShowForm(false);
          setRefresh((prev) => prev + 1);
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const OwnerModify = async () => {
    try {
      setLoading(true);
      if (Module !== "Owner" && Module !== "Investor") {
        return alert("Please Select From OwnerShip Type");
      }
      if (!Name || !Address || !PhoneNo || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          ownerID: ID,
          name: Name,
          address: Address,
          phoneNo: PhoneNo,
          type: Module,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await OwnerModifyApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          EmployeeGet();
          setShowForm(false);
          setRefresh((prev) => prev + 1);
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
      setAddress(getEmplyeeData.address);
      setPhoneNo(getEmplyeeData.phoneNo);
      setOpeningBalance(String(getEmplyeeData.openingBalance));
      setName(getEmplyeeData.name);
      setModule(getEmplyeeData.type);
      setID(getEmplyeeData.ownerID);
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
          title={update ? "Edit Owners (ترمیم)" : "New Owners (نئے مالکان)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label=" Name (نام)"
                  type="text"
                  required={true}
                  placeholder="Enter  Name"
                  SateChange={Name}
                  setSateChange={setName}
                  disabled={false}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Type (قسم)"
                  required={true}
                  placeholder="Enter Type"
                  filedID={setModuleID}
                  options={moduleList.map((item) => ({
                    id: item.ID,
                    label: item.label,
                    value: item.label,
                  }))}
                  value={Module}
                  onChange={setModule}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label=" PhoneNo (فون نمبر)"
                  type="text"
                  required={true}
                  placeholder="Enter  PhoneNo"
                  SateChange={PhoneNo}
                  setSateChange={setPhoneNo}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label=" Address (پتہ)"
                  type="text"
                  required={true}
                  placeholder="Enter Address"
                  SateChange={Address}
                  setSateChange={setAddress}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label=" Opening Balance "
                  type="number"
                  required={true}
                  placeholder="Enter Opening Balance"
                  SateChange={OpeningBalance}
                  setSateChange={setOpeningBalance}
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
                text={
                  update ? "Update (اپ ڈیٹ)" : "Add Owner/Investor (شامل کریں)"
                }
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Owner..."}
                onClick={() => (update ? OwnerModify() : OwnerAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Owners (مالکان)"
          subHeading="(تمام مالکان)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <OwnerGetList
            initalData={setgetEmplyeeData}
            setGetOwnerDateForList={GetOwnerDateForList}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
