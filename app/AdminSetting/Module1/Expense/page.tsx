"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

import { purchaseTripList } from "@/app/api/Types/module1/purchaseTrip";
import { useEffect, useRef, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import GeneralExpenseGetList from "./GetExpenseList";
import {
  generalExpenseList,
  GetExpenseListResposne,
} from "@/app/api/Types/module1/GeneralExpense";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import GeneralExpenseAddApi from "@/app/api/Controller/Module1/GeneralExpense/AddGeneralExpense";
import GeneralExpenseModifyApi from "@/app/api/Controller/Module1/GeneralExpense/ModifyGeneralExpense";
import { MoreHorizontal, X } from "lucide-react";
import EmployeeLoanComonent from "./EmployeeLoanCOmponent";
import GeneralExpenseGetApi from "@/app/api/Controller/Module1/GeneralExpense/GetGeneralExpense";

export default function BankManagement() {
  const hasFetchedEmployees = useRef(false);
  const [ShowForm, setShowForm] = useState(false);

  const [getEmplyeeData, setgetEmplyeeData] = useState<generalExpenseList>();
  const [getExpenseData, setgetExpenseData] = useState<ExpenseList[]>([]);
  const [model, setModel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [getBankData, setgetBankData] = useState<BankList[]>([]);
  const [BankID, setBankID] = useState("");
  const [BankName, setBankName] = useState("");
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [ExpenseAmount, setExpenseAmount] = useState("");
  const [ExpenseDate, setExpenseDate] = useState("");
  const [Payment, setPayment] = useState("");
  const [PaymentID, setPaymentID] = useState("");
  const [ExpenseCategoryID, setExpenseCategoryID] = useState("");
  const [ExpenseTypeID, setExpenseTypeID] = useState("");
  const [ExpenseType, setExpenseType] = useState("");
  const [ID, setID] = useState("");
  const [ExpenseCategroyName, setExpenseCategroyName] = useState("");
  const [Notes, setNotes] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isloading, setisLoading] = useState(false);
  const [getExpenseDataForList, setgetExpenseDataForList] = useState<
    generalExpenseList[]
  >([]);
  const [showLoanForm, setShowLoanForm] = useState(false);

  const paymentMdoe = [
    { ID: "1", label: "Cash" },
    { ID: "2", label: "Bank" },
    { ID: "3", label: "Owner Account" },
  ];
  const ExpenseTypeData = [{ ID: "1", label: "Company" }];

  const resetFunction = () => {
    setExpenseAmount("");
    setExpenseDate("");
    setPayment("");
    setPaymentID("");
    setExpenseType("");
    setExpenseTypeID("");
    setBankID("");
    setBankName("");
    setExpenseCategoryID("");
    setID("");
    setExpenseCategroyName("");
    setNotes("");
  };
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    setModel(true);
    resetFunction();
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
  const ExpenseGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await ExpenseGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseExpenseListGet;
      setgetExpenseData(data.dataList);
    } else {
      setgetExpenseData([]);
    }
  };
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GeneralExpenseGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as GetExpenseListResposne;
        setgetExpenseDataForList(data.dataList);
      } else {
        setgetExpenseDataForList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    if (hasFetchedEmployees.current) return;

    hasFetchedEmployees.current = true;
    EmployeeGet();
    ExpenseGet();
    BankGet();
  }, []);

  const ExpenseAdd = async () => {
    try {
      setLoading(true);
      if (
        !ExpenseCategoryID ||
        !ExpenseType ||
        !ExpenseAmount ||
        !ExpenseDate ||
        !Payment
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          categoryID: ExpenseCategoryID,
          expnseType: ExpenseType,
          bankID:
            Payment === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          expenseDate: ExpenseDate,
          expenseAmount: Number(ExpenseAmount),
          paymentMethod: Payment,
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await GeneralExpenseAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          EmployeeGet();
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
  const ExpenseModify = async () => {
    try {
      setLoading(true);
      if (
        !ID ||
        !ExpenseCategoryID ||
        !ExpenseType ||
        !ExpenseAmount ||
        !ExpenseDate ||
        !Payment
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          expenseID: ID,
          categoryID: ExpenseCategoryID,
          expnseType: ExpenseType,
          bankID:
            Payment === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          expenseDate: ExpenseDate,
          expenseAmount: Number(ExpenseAmount),
          paymentMethod: Payment,
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await GeneralExpenseModifyApi(formData, String(token));
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
      setExpenseCategoryID(getEmplyeeData.categoryID);
      setExpenseCategroyName(getEmplyeeData.expenseName || "");
      setExpenseType(getEmplyeeData.expnseType);
      setExpenseAmount(String(getEmplyeeData.expenseAmount));
      setNotes(getEmplyeeData.description);
      setPayment(getEmplyeeData.paymentMethod);
      setBankID(getEmplyeeData.bankID);
      setBankName(getEmplyeeData.bankName || "");
      setExpenseDate(
        new Date(getEmplyeeData.expenseDate).toISOString().split("T")[0],
      );
      setID(getEmplyeeData.expenseID);
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
      {showLoanForm && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header - Fixed */}
              <div className="flex items-center justify-between py-1 border-b border-gray-300 flex-shrink-0">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Edit Ledger (ترمیم)
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowLoanForm(false);
                  }}
                  title="Close"
                  className="text-muted-foreground hover:text-red-500 cursor-pointer p-1 rounded-lg hover:bg-accent"
                >
                  <X />
                </button>
              </div>

              {/* Content - Scrollable with hidden scrollbar */}
              <div className="px-2 py-2 overflow-y-auto flex-1 hide-scrollbar">
                <EmployeeLoanComonent setValue={setShowLoanForm} />
              </div>
            </div>
          </div>
        </>
      )}
      {ShowForm && (
        <PopupComponent
          onClick={eventTrigger}
          title={update ? "Edit Expense (ترمیم)" : "New Expense (نئے اخراجات)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <InputFieldGeneric
                  label="Expense Date (اخراجات کی تاریخ)"
                  type="date"
                  required={true}
                  placeholder="Enter Expense Date"
                  SateChange={ExpenseDate}
                  setSateChange={setExpenseDate}
                  disabled={false}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Expense Category (اخراجات کی زمرہ)"
                  required={true}
                  placeholder="Enter Expense Category"
                  filedID={setExpenseCategoryID}
                  options={getExpenseData
                    .filter((item) => item.expenseType === "M1 - Recycling")
                    .map((item) => ({
                      id: item.expID,
                      label: item.categoryName,
                      value: item.categoryName,
                    }))}
                  value={ExpenseCategroyName}
                  onChange={setExpenseCategroyName}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Expense Type (اخراجات کی قسم)"
                  required={true}
                  placeholder="Enter Expense Type"
                  filedID={setExpenseTypeID}
                  options={ExpenseTypeData.map((item) => ({
                    id: item.ID,
                    label: item.label,
                    value: item.label,
                  }))}
                  value={ExpenseType}
                  onChange={setExpenseType}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Expense Amount (اخراجات کی رقم)"
                  type="text"
                  required={true}
                  placeholder="Enter Expense Amount"
                  SateChange={ExpenseAmount}
                  setSateChange={setExpenseAmount}
                  disabled={false}
                />
              </div>

              <div className="mt-2">
                <DropDownList
                  label="Payment Method (ادائیگی کا طریقہ)"
                  required={true}
                  placeholder="Enter Payment Method"
                  filedID={setPaymentID}
                  options={paymentMdoe.map((item) => ({
                    id: item.ID,
                    label: item.label,
                    value: item.label,
                  }))}
                  value={Payment}
                  onChange={setPayment}
                />
              </div>
              {Payment === "Bank" && (
                <div className="mt-2">
                  <DropDownList
                    label="Bank (بینک)"
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
                text={update ? "Update (اپ ڈیٹ)" : "Add Expense (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Expense..."}
                onClick={() => (update ? ExpenseModify() : ExpenseAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="General Expense (عام اخراجات)"
          subHeading="(تمام اخراجات)"
          onClick={eventTrigger}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              setShowLoanForm(true);
            }}
            className={`flex gap-2  "border border-gray-200 hover:bg-gray-100 cursor-pointer rounded-md shadow-sm px-3 py-2  `}
          >
            <MoreHorizontal className="w-4 h-4 mt-1" /> Add Loan (شامل کریں)
          </button>
        </div>
        <div className="mt-8">
          <GeneralExpenseGetList
            initalData={setgetEmplyeeData}
            refresh={refresh}
            setgetExpenseDataForList={getExpenseDataForList}
            setIsLoading={isloading}
            expenseData={getExpenseData}
          />
        </div>
      </div>
    </>
  );
}
