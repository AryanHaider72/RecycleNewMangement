"use client";
import Heading from "@/app/ui/Heading/Heading";

import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import EmployeeAddApi from "@/app/api/Controller/Codes/Employee/AddEmployee";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import EmployeeModifyApi from "@/app/api/Controller/Codes/Employee/ModifyEmployee";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import EmployeeLedgerGetList from "./EmployeeLedgerGet";
import { employeeLedegrList } from "@/app/api/Types/Ledger/EmoployeeLedger";
import AddEmployeeLedgerApi from "@/app/api/Controller/Ledger/Employee/AddEmployeeLedger";
import ModifyEmployeeLedgerApi from "@/app/api/Controller/Ledger/Employee/ModifyEmployeeLedger";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import DeleteEmployeeLedgerApi from "@/app/api/Controller/Ledger/Employee/DeleteEmployeeLedeger";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";

export default function EmployeeLedgerManagement() {
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
  const [PaymentTypeID, setPaymentTypeID] = useState("");
  const [PaymentType, setPaymentType] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [BankID, setBankID] = useState("");
  const [BankName, setBankName] = useState("");
  const [getBankData, setgetBankData] = useState<BankList[]>([]);
  const [refresh, setrefresh] = useState(0);
  const [getEmplyeeData, setgetEmplyeeData] = useState<employeeLedegrList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [Delete, setDelete] = useState(false);
  const [moduleList, setModuleList] = useState<employeeList[]>([]);
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
    setPaymentMethod("Cash");
    setBankName("");
    setBankID("");
    setPaymentType("");
    setNotes("");
  };

  const paymentType = [
    { ID: "1", label: "Bonus" },
    { ID: "2", label: "Loss" },
    { ID: "3", label: "Salary" },
    { ID: "4", label: "Loan" },
    { ID: "5", label: "Loan Return" },
    { ID: "6", label: "Salary(KG)" },
    { ID: "7", label: "Trip Return" },
    { ID: "8", label: "Driver Payment" },
    { ID: "9", label: "Company Payment" },
    { ID: "10", label: "Labour Payment" },
  ];

  const paymentMethodList = [
    { ID: "1", label: "Cash" },
    { ID: "2", label: "Bank" },
  ];
  const EmployeeGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetEmployeeApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseEmployeeListGet;
      setModuleList(data.dataList);
    } else {
      setModuleList([]);
    }
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

  const EmployeeAdd = async () => {
    try {
      setLoading(true);
      if (!moduleID || !postingDate || !Amount)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          empID: moduleID,
          postingDate: postingDate,
          amount: Number(Amount),
          paymentMode: PaymentMethod,
          paymentType: PaymentType,
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await AddEmployeeLedgerApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          setrefresh((prev) => prev + 1);
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
          console.log(response);
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
          empID: moduleID,
          postingDate: postingDate,
          amount: Number(Amount),
          remarks: Notes,
          paymentMode: PaymentMethod,
          paymentType: PaymentType,
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ModifyEmployeeLedgerApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setrefresh((prev) => prev + 1);
          setShowForm(false);
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
    BankGet();
  }, []);
  useEffect(() => {
    if (getEmplyeeData) {
      setUpdate(true);
      setShowForm(true);
      setID(getEmplyeeData.ledgerID);
      setModule(getEmplyeeData.empName);
      setModuleID(getEmplyeeData.empID);
      setAmount(String(getEmplyeeData.debitAmount));
      setNotes(getEmplyeeData.remarks);
      (setPaymentType(getEmplyeeData.status),
        setpostingDate(
          new Date(getEmplyeeData.postingDate).toISOString().split("T")[0],
        ));
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
              <div className="">
                <DropDownList
                  label="Employee (ملازم)"
                  required={true}
                  placeholder="Enter Employee"
                  filedID={setModuleID}
                  options={moduleList.map((item) => ({
                    id: item.empID,
                    label: item.name,
                    value: item.name,
                  }))}
                  value={Module}
                  onChange={setModule}
                />
              </div>

              {/* Address - Full Width (both columns) */}
              <div className="">
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
              <div className="">
                <DropDownList
                  label="Payment Type (ادائیگی کی قسم)"
                  required={true}
                  placeholder="Enter Payment Type"
                  filedID={setPaymentTypeID}
                  options={paymentType.map((item) => ({
                    id: item.ID,
                    label: item.label,
                    value: item.label,
                  }))}
                  value={PaymentType}
                  onChange={setPaymentType}
                />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-neutral-700 ">
                  Payment Method (ادائیگی کا طریقہ)
                  <span className="text-red-600 text-lg ml-1">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                  value={PaymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>
              {PaymentMethod === "Bank" && (
                <div className="">
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

              {/* Amount - Full Width (both columns) */}
              <div className="">
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
                loadingtext={update ? "Updating..." : "Adding Employee..."}
                onClick={() => (update ? EmployeeModify() : EmployeeAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Employees Ledger ( ملازمین کا کھاتہ)"
          subHeading="(تمام  ملازمین کا کھاتہ)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <EmployeeLedgerGetList
            initalData={setgetEmplyeeData}
            moduleList={moduleList}
            deleteID={setDeleteID}
            deleteNow={setDelete}
            refresh={refresh}
          />
        </div>
      </div>
    </>
  );
}
