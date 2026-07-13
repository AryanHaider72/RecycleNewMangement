"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import ExpenseAddApi from "@/app/api/Controller/Codes/Expense/AddExpense";
import ExpenseModifyApi from "@/app/api/Controller/Codes/Expense/ModifyExpense";

import BankModifyApi from "@/app/api/Controller/Codes/Bank/ModifyBank";
import BankAddApi from "@/app/api/Controller/Codes/Bank/AddBank";
import { OwnerList } from "@/app/api/Types/Codes/Owner/Owner";
import OwnerAddApi from "@/app/api/Controller/Codes/Owner/AddOwner";
import OwnerModifyApi from "@/app/api/Controller/Codes/Owner/ModifyOwner";
import CustomerGetList from "./CustomerGetList";
import { CustomerList } from "@/app/api/Types/Codes/Customer/Customer";
import CustomerModifyApi from "@/app/api/Controller/Codes/Customer/CustomerModify";
import CustomerAddApi from "@/app/api/Controller/Codes/Customer/CustomerAdd";

export default function CustomerManagement() {
  const [ShowForm, setShowForm] = useState(false);
  const [Name, setName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [getEmplyeeData, setgetEmplyeeData] = useState<CustomerList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
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

  const moduleList = [
    { ID: "1", label: "Crush Customer (کرش)", value: "Crush Customer" },
    {
      ID: "2",
      label: "Preform Customer (پری فارم)",
      value: "Preform Customer",
    },
    { ID: "3", label: "Bottle Customer (پری فارم)", value: "Bottle Customer" },
  ];
  const CustomerAdd = async () => {
    try {
      setLoading(true);
      if (!Name || !Address || !PhoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          name: Name,
          address: Address,
          phoneNo: PhoneNo,
          type: Module,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await CustomerAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          click();
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const CustomerModify = async () => {
    try {
      setLoading(true);
      if (!Name || !Address || !PhoneNo || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          customerID: ID,
          name: Name,
          address: Address,
          type: Module,
          phoneNo: PhoneNo,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await CustomerModifyApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          click();
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
      setModule(getEmplyeeData.type);
      setOpeningBalance(String(getEmplyeeData.openingBalance));
      setName(getEmplyeeData.name);
      setID(getEmplyeeData.customerID);
      setNotes(getEmplyeeData.description);
    } else {
      resetFunction();
    }
  }, [getEmplyeeData]);
  const click = () => {};
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
          title={update ? "Edit Customer (ترمیم)" : "New Customer (نئے گاہک)"}
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
                    value: item.value,
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
                  placeholder="Enter  Address"
                  SateChange={Address}
                  setSateChange={setAddress}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label=" Opening Balance "
                  type="text"
                  required={true}
                  placeholder="Enter  Opening Balance"
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
                text={update ? "Update (اپ ڈیٹ)" : "Add Customer (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Customer..."}
                onClick={() => (update ? CustomerModify() : CustomerAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Customer (گاہک)"
          subHeading="(تمام گاہک)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <CustomerGetList
            initalData={setgetEmplyeeData}
            callbackFunction={() => click()}
          />
        </div>
      </div>
    </>
  );
}
