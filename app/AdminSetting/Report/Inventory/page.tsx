"use client";
import Heading from "@/app/ui/Heading/Heading";
import InventoryReportDetail from "./InventoryDetail";
import InventoryDateReportDetail from "./InventoryDetailDate";
import { useState } from "react";
import InventorySecondReportDetail from "./InventoryProductDetail";

export default function InventoryReport() {
  const [process, setprocess] = useState(false);
  const [activeTab, setActiveTab] = useState("Inventory Detail 1");
  const onclick = () => {
    return;
  };
  return (
    <>
      <div>
        <Heading
          heading="All Stock ( تمام اسٹاک)"
          subHeading="(تمام اسٹاک )"
          onClick={onclick}
          disable={true}
        />
        <div className="mt-2 mb-2">
          <ul className="flex w-full text-center bg-gray-100 rounded-md">
            <li className="flex-1">
              <button
                onClick={() => {
                  setActiveTab("Inventory Detail 1");
                }}
                className={`block w-full py-2 px-4 rounded-t-md ${
                  activeTab === "Inventory Detail 1"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                Inventory Detail 1
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => {
                  setActiveTab("Inventory Detail 2");
                }}
                className={`block w-full py-2 px-4 rounded-t-md ${
                  activeTab === "Inventory Detail 2"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                Inventory Detail 2
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => {
                  setActiveTab("Payment Detail");
                }}
                className={`block w-full py-2 px-4 rounded-t-md ${
                  activeTab === "Payment Detail"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                Payment Detail
              </button>
            </li>
          </ul>
        </div>
        {activeTab === "Payment Detail" && (
          <div className="w-full">
            <InventoryDateReportDetail />
          </div>
        )}
        {activeTab === "Inventory Detail 2" && (
          <div className="w-full">
            <InventorySecondReportDetail />
          </div>
        )}
        {activeTab === "Inventory Detail 1" && (
          <div className="w-full">
            <InventoryReportDetail />
          </div>
        )}
      </div>
    </>
  );
}
