"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

import { CustomerList } from "@/app/api/Types/Codes/Customer/Customer";
import CustomerModifyApi from "@/app/api/Controller/Codes/Customer/CustomerModify";
import CustomerAddApi from "@/app/api/Controller/Codes/Customer/CustomerAdd";
import SupplierAddApi from "@/app/api/Controller/Codes/Supplier/AddSupplier";
import SupplierModifyApi from "@/app/api/Controller/Codes/Supplier/ModifySupplier";
import SupplierGetList from "./SupplierGetList";
import { SupplierList } from "@/app/api/Types/Codes/Supplier/Supplier";
import DropDownList from "@/app/ui/DropDown/DropDown";

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
  const [getEmplyeeData, setgetEmplyeeData] = useState<SupplierList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [AccountType, setAccountType] = useState("");
  const [AccountID, setAccountID] = useState("");
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const accountType = [
    { ID: "1", label: "Scrap Dealer (اسکریپ ڈیلر)", value: "ScrapDealer" },
    { ID: "2", label: "Vendor (وینڈر)", value: "Vendor" },
    { ID: "3", label: "Pump (پمپ)", value: "Pump" },
  ];
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };
  const resetFunction = () => {
    setName("");
    setAddress("");
    setPhoneNo("");
    setOpeningBalance("");
    setID("");
    setNotes("");
    setUpdate(false);
  };
  const SupplierAdd = async () => {
    try {
      setLoading(true);
      if (!Name || !Address || !PhoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          name: Name,
          address: Address,
          accountType: AccountType,
          phoneNo: PhoneNo,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await SupplierAddApi(formData, String(token));
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
  const SupplierModify = async () => {
    try {
      setLoading(true);
      if (!Name || !Address || !PhoneNo || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          supplierID: ID,
          name: Name,
          address: Address,
          phoneNo: PhoneNo,
          accountType: AccountType,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await SupplierModifyApi(formData, String(token));
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
      setOpeningBalance(String(getEmplyeeData.openingBalance));
      setName(getEmplyeeData.name);
      setID(getEmplyeeData.supplierID);
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
          title={update ? "Edit Supplier (ترمیم)" : "New Supplier (نئے سپلائر)"}
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
              <div className="mt-2">
                <DropDownList
                  label="Account Type (قسم)"
                  required={true}
                  placeholder="Enter Type (قسم)"
                  filedID={setAccountID}
                  options={accountType.map((item) => ({
                    id: item.ID,
                    label: item.label,
                    value: item.value,
                  }))}
                  value={AccountType}
                  onChange={setAccountType}
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
                onClick={() => (update ? SupplierModify() : SupplierAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Supplier (سپلائر)"
          subHeading="(تمام سپلائر)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <SupplierGetList
            initalData={setgetEmplyeeData}
            callbackFunction={() => click()}
          />
        </div>
      </div>
    </>
  );
}
