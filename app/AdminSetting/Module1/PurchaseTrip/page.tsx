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
import { BankList } from "@/app/api/Types/Codes/Bank/Bank";
import BankModifyApi from "@/app/api/Controller/Codes/Bank/ModifyBank";
import BankAddApi from "@/app/api/Controller/Codes/Bank/AddBank";
import PurchaseTripDetail from "./PurchaseTripDetail";
import { purchaseTripList } from "@/app/api/Types/module1/purchaseTrip";
import AddPurchaseTrip from "./AddPurchaseTrip";

export default function BankManagement() {
  const [ShowForm, setShowForm] = useState(false);

  const [getEmplyeeData, setgetEmplyeeData] = useState<purchaseTripList>();
  const [model, setModel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const eventTrigger = () => {
    setShowForm(!ShowForm);
    setModel(true);
    //resetFunction();
  };

  //   useEffect(() => {
  //     if (getEmplyeeData) {
  //       setUpdate(true);
  //       setShowForm(true);
  //       setAccountNumber(getEmplyeeData.accountNumber);
  //       setAccountTitle(getEmplyeeData.accountTitle);
  //       setOpeningBalance(String(getEmplyeeData.openingBalance));
  //       setBankName(getEmplyeeData.bankName);
  //       setID(getEmplyeeData.bankID);
  //     } else {
  //       resetFunction();
  //     }
  //   }, [getEmplyeeData]);
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
          title={update ? "Edit Trip (ترمیم)" : "New Trip (نئی ٹرپ)"}
        >
          <AddPurchaseTrip
            modelClose={model}
            update={update}
            initalData={getEmplyeeData}
            onShowMessage={(msg, type) => {
              setShowMessage(msg);
              setMessageType(type);
              if (type === "success") {
                setShowForm(false);
              }
            }}
          />
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Purchase Trip (خریداری ٹرپ)"
          subHeading="(تمام ٹرپ)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <PurchaseTripDetail
            initalData={setgetEmplyeeData}
            callbackFunction={() => click()}
          />
        </div>
      </div>
    </>
  );
}
