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
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import BankGetList from "./BankGetList";
import BankModifyApi from "@/app/api/Controller/Codes/Bank/ModifyBank";
import BankAddApi from "@/app/api/Controller/Codes/Bank/AddBank";
import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";

export default function BankManagement() {
  const hasFetchedEmployees = useRef(false);
  const [refresh, setRefresh] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const [BankName, setBankName] = useState("");
  const [AccountTitle, setAccountTitle] = useState("");
  const [AccountNumber, setAccountNumber] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [getBankDataForList, setgetBankDataForList] = useState<BankList[]>([]);
  const [isloading, setisLoading] = useState(false);

  const [getEmplyeeData, setgetEmplyeeData] = useState<BankList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };
  const resetFunction = () => {
    setBankName("");
    setAccountNumber("");
    setAccountTitle("");
    setOpeningBalance("");
    setID("");
    setNotes("");
    setUpdate(false);
  };
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await BankGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseBankListGet;
        setgetBankDataForList(data.dataList);
      } else {
        setgetBankDataForList([]);
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
  const BankAdd = async () => {
    try {
      setLoading(true);
      if (!BankName || !AccountNumber || !AccountTitle)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          bankName: BankName,
          accountNumber: AccountNumber,
          accountTitle: AccountTitle,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await BankAddApi(formData, String(token));
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
  const BankModify = async () => {
    try {
      setLoading(true);
      if (!BankName || !AccountNumber || !AccountTitle || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          bankID: ID,
          bankName: BankName,
          accountNumber: AccountNumber,
          accountTitle: AccountTitle,
          openingBalance: Number(OpeningBalance),
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await BankModifyApi(formData, String(token));
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
      setAccountNumber(getEmplyeeData.accountNumber);
      setAccountTitle(getEmplyeeData.accountTitle);
      setOpeningBalance(String(getEmplyeeData.openingBalance));
      setBankName(getEmplyeeData.bankName);
      setID(getEmplyeeData.bankID);
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
          title={update ? "Edit Bank (ترمیم)" : "New Bank (نیا بینک)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Bank Name (بینک کا نام)"
                  type="text"
                  required={true}
                  placeholder="Enter Bank Name"
                  SateChange={BankName}
                  setSateChange={setBankName}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Account Title (اکاؤنٹ کا عنوان)"
                  type="text"
                  required={true}
                  placeholder="Enter Account Title"
                  SateChange={AccountTitle}
                  setSateChange={setAccountTitle}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Account Number (اکاؤنٹ نمبر)"
                  type="text"
                  required={true}
                  placeholder="Enter Account Number"
                  SateChange={AccountNumber}
                  setSateChange={setAccountNumber}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Opening Balance"
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
                text={update ? "Update (اپ ڈیٹ)" : "Add Bank (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Bank..."}
                onClick={() => (update ? BankModify() : BankAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Bank (بینک)"
          subHeading="(تمام بینک)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <BankGetList
            initalData={setgetEmplyeeData}
            setgetBankDataForList={getBankDataForList}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
