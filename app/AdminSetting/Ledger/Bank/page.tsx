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
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import AddBankLedgerApi from "@/app/api/Controller/Ledger/Bank/AddBankLedger";
import ModifyBankLedgerApi from "@/app/api/Controller/Ledger/Bank/ModifyBankLedger";
import {
  BankLedegrList,
  responseBankLedgerListGet,
} from "@/app/api/Types/Ledger/BankLedger";
import BankLedgerGetList from "./BankLedgerGetList";
import CashtoBank from "./AddBankDataLedger/CashToBank";
import BanktoCash from "./AddBankDataLedger/BankToCash";
import BanktoBank from "./AddBankDataLedger/BanktoBank";
import GetBankLedgerApi from "@/app/api/Controller/Ledger/Bank/GetBankLedger";

export default function VehicleLedgerManagement() {
  const [ShowForm, setShowForm] = useState(false);
  const [BankID, setBankID] = useState("");
  const [update, setUpdate] = useState(false);
  const [ID, setID] = useState("");
  const [DeleteID, setDeleteID] = useState("");
  const [activeTab, setActiveTab] = useState("Cash to Bank");
  const [getEmplyeeData, setgetEmplyeeData] = useState<BankLedegrList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [Balacnce, setBalacnce] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [Delete, setDelete] = useState(false);
  const [moduleList, setModuleList] = useState<BankList[]>([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const [GetBankLedgerList, setGetBankLedgerList] = useState<BankLedegrList[]>(
    [],
  );
  const [isloading, setisLoading] = useState(false);

  const eventTrigger = () => {
    setShowForm(!ShowForm);
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
  useEffect(() => {
    EmployeeGet();
  }, []);

  const LedgerGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        dateFrom: DateFrom,
        dateTo: DateTo,
        bankID: BankID,
      };
      const response = await GetBankLedgerApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as responseBankLedgerListGet;
        setBalacnce(String(data.balance));
        setGetBankLedgerList(data.dataList);
      } else {
        setGetBankLedgerList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (!DateFrom || !DateTo || !BankID) return;
    else {
      LedgerGet();
    }
  }, [DateFrom, DateTo, BankID]);

  const DeleteFunction = async (ID: string) => {
    if (!ID) return alert("Please Fill in Filed with *");
    else {
      const token = localStorage.getItem("adminToken");
      const response = await DeleteEmployeeLedgerApi(ID, String(token));
      if (response.status == 200) {
        setMessageType("success");
        setShowMessage(response.data.message);

        setShowForm(false);
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
            <ul className="flex w-full text-center bg-gray-100">
              <li className="flex-1">
                <button
                  onClick={() => {
                    setActiveTab("Cash to Bank");
                  }}
                  className={`block w-full py-2 px-4 rounded-t-md ${
                    activeTab === "Cash to Bank"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-black"
                  }`}
                >
                  Cash to Bank
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => {
                    setActiveTab("Bank To Cash");
                  }}
                  className={`block w-full py-2 px-4 rounded-t-md ${
                    activeTab === "Bank To Cash"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-black"
                  }`}
                >
                  Bank To Cash
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => {
                    setActiveTab("Bank To Bank");
                  }}
                  className={`block w-full py-2 px-4 rounded-t-md ${
                    activeTab === "Bank To Bank"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-black"
                  }`}
                >
                  Bank To Bank
                </button>
              </li>
            </ul>
            {activeTab === "Cash to Bank" && (
              <CashtoBank
                bankList={moduleList}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setUpdate(false);
                    setShowForm(false);
                  }
                }}
              />
            )}
            {activeTab === "Bank To Cash" && (
              <BanktoCash
                bankList={moduleList}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setUpdate(false);
                    setShowForm(false);
                  }
                }}
              />
            )}
            {activeTab === "Bank To Bank" && (
              <BanktoBank
                bankList={moduleList}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setUpdate(false);
                    setShowForm(false);
                  }
                }}
              />
            )}
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
            balance={Number(Balacnce)}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            DateFrom={DateFrom}
            DateTo={DateTo}
            setBankID={setBankID}
            loading={isloading}
            BankLedegrList={GetBankLedgerList}
          />
        </div>
      </div>
    </>
  );
}
