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
import {
  purchaseTripList,
  responsePurchaseTripListGet,
} from "@/app/api/Types/module1/purchaseTrip";
import AddPurchaseTrip from "./AddPurchaseTrip";
import DetailSupplierData from "./DetailFolder/DetailSupplierData";
import PurchaseTripGetApi from "@/app/api/Controller/Module1/purchaseTrip/GetPurchasetTrip";

export default function BankManagement() {
  const [ShowForm, setShowForm] = useState(false);
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");

  const [getEmplyeeData, setgetEmplyeeData] = useState<purchaseTripList>();
  const [ShowDetail, setShowDetail] = useState(false);
  const [model, setModel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [refresh, setRefresh] = useState(0);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [getEmplyeeDataList, setgetEmplyeeDataList] = useState<
    purchaseTripList[]
  >([]);
  const [isloading, setisLoading] = useState(false);
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    setModel(true);
    //resetFunction();
  };
  const eventTriger2 = () => {
    setShowDetail(!ShowDetail);
  };

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await PurchaseTripGetApi(
        DateFrom,
        DateTo,
        String(token),
      );
      if (response.status == 200) {
        const data = response.data as responsePurchaseTripListGet;
        setgetEmplyeeDataList(data.dataList);
      } else {
        setgetEmplyeeDataList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(date.getFullYear() - 1);

    setDateFrom(lastYear.toISOString().split("T")[0]);
    setDateTo(date.toISOString().split("T")[0]);
  }, []);
  useEffect(() => {
    if (!DateFrom || !DateTo) return;
    else {
      EmployeeGet();
    }
  }, [DateFrom, DateTo, refresh]);
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
              setRefresh((prev) => prev + 1);
              if (type === "success") {
                setShowForm(false);
              }
            }}
          />
        </PopupComponent>
      )}
      {ShowDetail && (
        <PopupComponent
          onClick={eventTriger2}
          title={"View Detail (تفصیلات دیکھیں)"}
        >
          <DetailSupplierData data={getEmplyeeData} />
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Purchase Trip (خریداری ٹرپ)"
          subHeading="(تمام ٹرپ)"
          onClick={eventTrigger}
        />
        <div className="flex gap-2">
          <div className="w-full">
            <InputFieldGeneric
              label="Date From (تاریخِ آغاز)"
              type="date"
              required={true}
              placeholder="Enter Date From"
              SateChange={DateFrom}
              setSateChange={setDateFrom}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputFieldGeneric
              label="Date To (تاریخِ اختتام)"
              type="date"
              required={true}
              placeholder="Enter Date To"
              SateChange={DateTo}
              setSateChange={setDateTo}
              disabled={false}
            />
          </div>
        </div>
        <div className="mt-8">
          <PurchaseTripDetail
            initalData={setgetEmplyeeData}
            setIsLoading={isloading}
            DateFrom={DateFrom}
            DateTo={DateTo}
            getEmplyeeDataList={getEmplyeeDataList}
            showDetail={setShowDetail}
          />
        </div>
      </div>
    </>
  );
}
