"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

import { purchaseTripList } from "@/app/api/Types/module1/purchaseTrip";
import { useEffect, useState } from "react";
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
import { generalExpenseList } from "@/app/api/Types/module1/GeneralExpense";

export default function BankManagement() {
  const [ShowForm, setShowForm] = useState(false);

  const [getEmplyeeData, setgetEmplyeeData] = useState<generalExpenseList>();
  const [getExpenseData, setgetExpenseData] = useState<ExpenseList[]>([]);
  const [model, setModel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseAmount, setExpenseAmount] = useState("");
  const [ExpenseDate, setExpenseDate] = useState("");
  const [Payment, setPayment] = useState("");
  const [PaymentID, setPaymentID] = useState("");
  const [ExpenseID, setExpenseID] = useState("");
  const [ID, setID] = useState("");
  const [Expense, setExpense] = useState("");
  const [Notes, setNotes] = useState("");

  const paymentMdoe = [
    { ID: "1", label: "Cash" },
    { ID: "2", label: "Bank" },
    { ID: "3", label: "Owner Account" },
  ];
  const resetFunction = () => {
    setExpenseName("");
    setExpenseAmount("");
    setExpenseDate("");
    setPayment("");
    setPaymentID("");
    setExpenseID("");
    setID("");
    setExpense("");
    setNotes("");
  };
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    setModel(true);
    resetFunction();
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
  useEffect(() => {
    ExpenseGet();
  }, []);
  useEffect(() => {
    if (getEmplyeeData) {
      setUpdate(true);
      setShowForm(true);
      setExpenseName(getEmplyeeData.expenseName);
      const data = getExpenseData.find(
        (item) => item.categoryName === getEmplyeeData.expnseType,
      );
      if (data) {
        setExpense(data.categoryName);
        setExpenseID(data.expID);
      }
      setExpenseAmount(String(getEmplyeeData.expenseAmount));
      setNotes(getEmplyeeData.description);
      setPayment(getEmplyeeData.paymentMethod);
      setExpenseDate(
        new Date(getEmplyeeData.expenseDate).toISOString().split("T")[0],
      );
      setID(getEmplyeeData.expenseID);
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
          title={update ? "Edit Expense (ترمیم)" : "New Expense (نئے اخراجات)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Expense Name (اخراجات کا نام)"
                  type="text"
                  required={true}
                  placeholder="Enter Expense Name"
                  SateChange={ExpenseName}
                  setSateChange={setExpenseName}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Expense Date (اخراجات کی تاریخ)"
                  type="text"
                  required={true}
                  placeholder="Enter Expense Date"
                  SateChange={ExpenseDate}
                  setSateChange={setExpenseDate}
                  disabled={false}
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
                  label="Expense Type (اخراجات کی قسم)"
                  required={true}
                  placeholder="Enter Expense Type"
                  filedID={setExpenseID}
                  options={getExpenseData.map((item) => ({
                    id: item.expID,
                    label: item.categoryName,
                    value: item.categoryName,
                  }))}
                  value={Expense}
                  onChange={setExpense}
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
                //onClick={() => (update ? ExpenseModify() : ExpenseAdd())}
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
        <div className="mt-8">
          <GeneralExpenseGetList
            initalData={setgetEmplyeeData}
            callbackFunction={() => click()}
          />
        </div>
      </div>
    </>
  );
}
