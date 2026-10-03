"use client";
import AttendenceAddApi from "@/app/api/Controller/Attendence/AddAttendence";
import AddCashInHandApi from "@/app/api/Controller/CashInHand/AddCashInHand";
import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDown/DropDown";
import Heading from "@/app/ui/Heading/Heading";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useState } from "react";
import CashinGetList from "./GetCashInHand";
import { cashInList } from "@/app/api/Types/CashinHand/CashInHand";
import ModifyCashInHandApi from "@/app/api/Controller/CashInHand/ModifyCashInHand";

export default function CashInHandManagement() {
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [refresh, setRefresh] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [Notes, setNotes] = useState("");
  const [Amount, setAmount] = useState("");
  const [PostingDate, setPostingDate] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [moduleList, setModuleList] = useState<cashInList>();
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };

  const resetFunction = () => {
    setPostingDate("");
    setUpdate(false);
    setNotes("");
    setAmount("");
  };
  const AddCashInHand = async () => {
    try {
      setLoading(true);
      if (!PostingDate || !Amount) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          postingDate: PostingDate,
          amount: Number(Amount),
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await AddCashInHandApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
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
  const ModifyCashInHand = async () => {
    try {
      setLoading(true);
      if (!PostingDate || !Amount) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          cashID: ID,
          postingDate: PostingDate,
          amount: Number(Amount),
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ModifyCashInHandApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
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
    if (moduleList) {
      setUpdate(true);
      setShowForm(true);
      setPostingDate(
        new Date(moduleList.postingDate).toISOString().split("T")[0],
      );
      setID(moduleList.cashID);
      setAmount(String(moduleList.amount));
      setNotes(moduleList.remarks);
    } else {
      resetFunction();
    }
  }, [moduleList]);
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
          title={update ? "Edit Cash (ترمیم)" : "New Cash In Hand (نقد رقم)"}
        >
          <div className="">
            <div className="mt-2">
              <InputFieldGeneric
                label="Posting Date (تاریخ)"
                type="date"
                required={false}
                placeholder="Enter Address"
                SateChange={PostingDate}
                setSateChange={setPostingDate}
                disabled={false}
              />
            </div>
            <div className="mt-2 mb-2">
              <InputFieldGeneric
                type="number"
                label="Amount"
                required={true}
                placeholder="Enter Amount"
                SateChange={Amount}
                setSateChange={setAmount}
                disabled={false}
              />
            </div>
            <div className="mt-2 mb-2">
              <TextAreaFieldGeneric
                label="Notes"
                required={false}
                placeholder="Enter Notes"
                SateChange={Notes}
                setSateChange={setNotes}
                disabled={false}
              />
            </div>
            <ActionButton
              text={update ? "Update (اپ ڈیٹ)" : "Add Cash (شامل کریں)"}
              update={loading}
              loading={loading}
              size={"w-full"}
              loadingtext={update ? "Updating..." : "Adding Cash..."}
              onClick={() => (update ? ModifyCashInHand() : AddCashInHand())}
              disabled={false}
            />
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Cash In Hand (نقد رقم)"
          subHeading="(تمام نقد رقم)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <CashinGetList initalData={setModuleList} refresh={refresh} />
        </div>
      </div>
    </>
  );
}
