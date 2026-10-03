"use client";
import Heading from "@/app/ui/Heading/Heading";
import CashFlowDetailReport from "./CashFlowDetail";
import { useEffect, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import CashInFlowDetailReport from "./CashInFlowDetail";

export default function CashFlowReport() {
  const [activeTab, setActiveTab] = useState("Cash in Report");
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");
  const onclick = () => {
    return;
  };
  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();

    lastYear.setMonth(date.getMonth() - 1);

    setdateFrom(lastYear.toISOString().split("T")[0]);
    setdateTo(date.toISOString().split("T")[0]);
  }, []);
  return (
    <>
      <div>
        <Heading
          heading="Cash Flow Report (کیش فلو رپورٹ)"
          subHeading="(تمام تفصیلات)"
          onClick={onclick}
          disable={true}
        />
        <div className="w-full flex gap-2">
          <div className="w-full">
            <InputFieldGeneric
              label="Date From (تاریخِ آغاز)"
              type="date"
              required={false}
              placeholder="Enter Date From"
              SateChange={dateFrom}
              setSateChange={setdateFrom}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputFieldGeneric
              label="Date To (تاریخِ اختتام)"
              type="date"
              required={false}
              placeholder="Enter Date To"
              SateChange={dateTo}
              setSateChange={setdateTo}
              disabled={false}
            />
          </div>
        </div>
        <div className="mt-2 mb-2">
          <ul className="flex w-full text-center bg-gray-100 rounded-md">
            <li className="flex-1">
              <button
                onClick={() => {
                  setActiveTab("Cash in Report");
                }}
                className={`block w-full py-2 px-4 rounded-t-md ${
                  activeTab === "Cash in Report"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                Cash in Report
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => {
                  setActiveTab("Cash Flow Report");
                }}
                className={`block w-full text-gray-400 bg-gray-50 border-gray-100 py-2 px-4 rounded-t-md cursor-not-allowed`}
              >
                Cash Flow Report
              </button>
            </li>
          </ul>
        </div>
        {activeTab === "Cash Flow Report" && (
          <div className="w-full">
            <CashFlowDetailReport dateFrom={dateFrom} dateTo={dateTo} />
          </div>
        )}
        {activeTab === "Cash in Report" && (
          <CashInFlowDetailReport dateFrom={dateFrom} dateTo={dateTo} />
        )}
      </div>
    </>
  );
}
