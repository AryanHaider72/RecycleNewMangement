"use client";
import Heading from "@/app/ui/Heading/Heading";

import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

import { employeeLedegrList } from "@/app/api/Types/Ledger/EmoployeeLedger";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import DeleteEmployeeLedgerApi from "@/app/api/Controller/Ledger/Employee/DeleteEmployeeLedeger";
import {
  OwnerList,
  responseOwnerListGet,
} from "@/app/api/Types/Codes/Owner/Owner";
import OwnerGetApi from "@/app/api/Controller/Codes/Owner/GetOwner";
import AddOwnerLedgerApi from "@/app/api/Controller/Ledger/Owner/AddOwnerLedger";
import ModifyOwnerLedgerApi from "@/app/api/Controller/Ledger/Owner/ModifyOwnerLedger";
import { OwnerLedegrList } from "@/app/api/Types/Ledger/OwnerLedger";
import { vehicleLedegrList } from "@/app/api/Types/Ledger/VehicleLedger";
import {
  responseVehicleListGet,
  VehicleList,
} from "@/app/api/Types/Codes/Vehicle/Vehicle";
import GetVehicleApi from "@/app/api/Controller/Codes/Vehicle/GetVehicle";
import AddVehicleLedgerApi from "@/app/api/Controller/Ledger/Vehicle/AddVehicleLedger";
import ModifyVehicleLedgerApi from "@/app/api/Controller/Ledger/Vehicle/ModifyVehicleLedger";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import AddBankLedgerApi from "@/app/api/Controller/Ledger/Bank/AddBankLedger";
import ModifyBankLedgerApi from "@/app/api/Controller/Ledger/Bank/ModifyBankLedger";
import { BankLedegrList } from "@/app/api/Types/Ledger/BankLedger";
import BankLedgerGetList from "./BankLedgerGetList";

export default function VehicleLedgerManagement() {
  const [ShowForm, setShowForm] = useState(false);
  const [postingDate, setpostingDate] = useState("");
  const [Amount, setAmount] = useState("");
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [DeleteID, setDeleteID] = useState("");
  const [getEmplyeeData, setgetEmplyeeData] = useState<BankLedegrList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [Delete, setDelete] = useState(false);
  const [moduleList, setModuleList] = useState<BankList[]>([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };
  const resetFunction = () => {
    setpostingDate("");
    setModule("");
    setUpdate(false);
    setAmount("");
    setNotes("");
  };

  const EmployeeGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await BankGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseBankListGet;
      setModuleList(data.dataList);
    } else {
      setModuleList([]);
    }
  };

  const EmployeeAdd = async () => {
    try {
      setLoading(true);
      if (!moduleID || !postingDate || !Amount)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          bankID: moduleID,
          postingDate: postingDate,
          amount: Number(Amount),
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await AddBankLedgerApi(formData, String(token));
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
  const EmployeeModify = async () => {
    try {
      setLoading(true);
      if (!moduleID || !postingDate || !Amount || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          ledgerID: ID,
          bankID: moduleID,
          postingDate: postingDate,
          amount: Number(Amount),
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ModifyBankLedgerApi(formData, String(token));
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
    EmployeeGet();
  }, []);
  useEffect(() => {
    if (getEmplyeeData) {
      setUpdate(true);
      setShowForm(true);
      setID(getEmplyeeData.ledgerID);
      setModule(getEmplyeeData.accountTitle);
      setModuleID(getEmplyeeData.bankID);
      setAmount(String(getEmplyeeData.debitAmount));
      setNotes(getEmplyeeData.remarks);
      setpostingDate(
        new Date(getEmplyeeData.postingDate).toISOString().split("T")[0],
      );
    } else {
      resetFunction();
    }
  }, [getEmplyeeData]);
  const click = () => {};

  const DeleteFunction = async (ID: string) => {
    if (!ID) return alert("Please Fill in Filed with *");
    else {
      const token = localStorage.getItem("adminToken");
      const response = await DeleteEmployeeLedgerApi(ID, String(token));
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
  };

  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => DeleteFunction(ID)}
        />
      )}
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
          title={update ? "Edit Ledger (ترمیم)" : "New Ledger (نیا کھاتہ)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}

              {/* Department - Column 2 */}
              <div className="md:col-span-2">
                <DropDownList
                  label="Bank (بینک)"
                  required={true}
                  placeholder="Enter Bank"
                  filedID={setModuleID}
                  options={moduleList.map((item) => ({
                    id: item.bankID,
                    label: item.accountTitle,
                    value: item.accountTitle,
                  }))}
                  value={Module}
                  onChange={setModule}
                />
              </div>

              {/* Address - Full Width (both columns) */}
              <div className="md:col-span-2">
                <InputFieldGeneric
                  label="Posting Date (تاریخ)"
                  type="date"
                  required={false}
                  placeholder="Enter Address"
                  SateChange={postingDate}
                  setSateChange={setpostingDate}
                  disabled={false}
                />
              </div>

              {/* Amount - Full Width (both columns) */}
              <div className="md:col-span-2">
                <InputFieldGeneric
                  label="Amount (قیمت)"
                  type="number"
                  required={true}
                  placeholder="Enter Amount"
                  SateChange={Amount}
                  setSateChange={setAmount}
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
                text={update ? "Update (اپ ڈیٹ)" : "Add Ledger (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Owner..."}
                onClick={() => (update ? EmployeeModify() : EmployeeAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Bank Ledger (بینک کا کھاتہ )"
          subHeading="(تمام  بینک  کا کھاتہ)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <BankLedgerGetList
            initalData={setgetEmplyeeData}
            moduleList={moduleList}
            deleteID={setDeleteID}
            deleteNow={setDelete}
            callbackFunction={() => click()}
          />
        </div>
      </div>
    </>
  );
}
