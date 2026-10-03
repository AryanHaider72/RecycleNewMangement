"use client";
import Heading from "@/app/ui/Heading/Heading";

import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import DeleteEmployeeLedgerApi from "@/app/api/Controller/Ledger/Employee/DeleteEmployeeLedeger";
import CustomerGetApi from "@/app/api/Controller/Codes/Customer/CustomerGet";
import {
  CustomerList,
  responseCustomerListGet,
} from "@/app/api/Types/Codes/Customer/Customer";
import AddCustomerLedgerApi from "@/app/api/Controller/Ledger/Customer/AddCustomerLedger";
import ModifyCustomerLedgerApi from "@/app/api/Controller/Ledger/Customer/ModifyCustomerLedger";
import {
  CustomerLedegrList,
  responseCustomerLedgerListGet,
} from "@/app/api/Types/Ledger/CustomerLedger";
import CustomerLedgerGetList from "./GetCustomerLedgerList";
import DeleteCustomerLedgerApi from "@/app/api/Controller/Ledger/Customer/DeleteCustomerLedger";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import GetCustomerLedgerApi from "@/app/api/Controller/Ledger/Customer/GetCustomerLedger";

export default function CustomerLedgerManagement() {
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
  const [getEmplyeeData, setgetEmplyeeData] = useState<CustomerLedegrList>();
  const [GetCustomerData, setGetCustomerData] = useState<CustomerLedegrList[]>(
    [],
  );
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [Delete, setDelete] = useState(false);
  const [moduleList, setModuleList] = useState<CustomerList[]>([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [PaymentTypeID, setPaymentTypeID] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [BankID, setBankID] = useState("");
  const [BankName, setBankName] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [isloading, setisLoading] = useState(false);
  const [getBankData, setgetBankData] = useState<BankList[]>([]);
  const [arrear, setArrear] = useState("");
  const paymentMethodList = [
    { ID: "1", label: "Cash" },
    { ID: "2", label: "Bank" },
  ];
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
  useEffect(() => {
    BankGet();
  }, []);
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

  const CustomerLegderGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        dateFrom: DateFrom,
        dateTo: DateTo,
        customerID: CustomerID,
      };
      const response = await GetCustomerLedgerApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as responseCustomerLedgerListGet;
        setGetCustomerData(data.dataList);
        setArrear(String(data.balance));
      } else {
        setGetCustomerData([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    CustomerLegderGet();
  }, [DateFrom, DateTo, CustomerID]);

  const EmployeeGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await CustomerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseCustomerListGet;
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
          customerID: moduleID,
          postingDate: postingDate,
          amount: Number(Amount),
          remarks: Notes,
          paymentMode: PaymentMethod,
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
        };
        const token = localStorage.getItem("adminToken");
        const response = await AddCustomerLedgerApi(formData, String(token));
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
          customerID: moduleID,
          postingDate: postingDate,
          amount: Number(Amount),
          paymentMode: PaymentMethod,
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ModifyCustomerLedgerApi(formData, String(token));
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
      setModule(getEmplyeeData.customerName);
      setModuleID(getEmplyeeData.customerID);
      setAmount(String(getEmplyeeData.debitAmount));
      setPaymentMethod(getEmplyeeData.paymentMode);
      setBankID(getEmplyeeData.bankID);
      setBankName(getEmplyeeData.bankName);
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
      const response = await DeleteCustomerLedgerApi(ID, String(token));
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
                  label="Customer (گاہک)"
                  required={true}
                  placeholder="Enter Customer"
                  filedID={setModuleID}
                  options={moduleList.map((item) => ({
                    id: item.customerID,
                    label: item.name,
                    value: item.name,
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

              <div className="md:col-span-2">
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
                <div className="md:col-span-2">
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
          heading="Customers Ledger ( گاہک کا کھاتہ)"
          subHeading="(تمام  گاہک کا کھاتہ)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <CustomerLedgerGetList
            initalData={setgetEmplyeeData}
            moduleList={moduleList}
            deleteID={setDeleteID}
            balance={Number(arrear)}
            deleteNow={setDelete}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            setCustomerID={setCustomerID}
            setCustomerName={setCustomerName}
            CustomerName={CustomerName}
            DateFrom={DateFrom}
            DateTo={DateTo}
            isLoading={isloading}
            setCustomerGetData={GetCustomerData}
          />
        </div>
      </div>
    </>
  );
}
