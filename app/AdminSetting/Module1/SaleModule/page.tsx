"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useRef, useState } from "react";
import AddSaleForm from "./AddSaleForm";
import SaleGetForm from "./SaleGetForm";
import {
  responseSaleListGet,
  SaleList,
} from "@/app/api/Types/module1/SaleModuel";
import AddCustomerFormPayment from "./AddCustomerPayment";
import { MoreHorizontal, X } from "lucide-react";
import SaleGetApi from "@/app/api/Controller/Module1/SaleModule/GetSale";

export default function SaleModule() {
  const hasFetchedEmployees = useRef(false);
  const [ShowForm, setShowForm] = useState(false);
  const [model, setModel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [showLoanForm, setShowLoanForm] = useState(false);
  const [ShowDetail, setShowDetail] = useState(false);
  const [getEmplyeeData, setgetEmplyeeData] = useState<SaleList>();
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [getEmplyeeDataForList, setgetEmplyeeDataForList] = useState<
    SaleList[]
  >([]);
  const [isloading, setisLoading] = useState(false);
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    setModel(true);
    //resetFunction();
  };
  const eventTrigger2 = () => {
    setShowDetail(false);
  };
  const header = [
    "Product Name (پروڈکٹ کا نام )",
    "Qty (مِقدار)",
    "Sale Price (فروخت کی قیمت)",
  ];
  const supplier = getEmplyeeData?.productList;
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await SaleGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseSaleListGet;
        setgetEmplyeeDataForList(data.dataList);
      } else {
        setgetEmplyeeDataForList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    EmployeeGet();
  }, [refresh]);
  return (
    <>
      <div className="">
        {ShowForm && (
          <PopupComponent
            onClick={eventTrigger}
            title={update ? "Edit Sale (ترمیم)" : "New Sale (نئی سیل)"}
          >
            <>
              <AddSaleForm
                update={update}
                setRefresh={setRefresh}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setShowForm(false);
                  }
                }}
              />
            </>
          </PopupComponent>
        )}
        {showLoanForm && (
          <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between py-1 border-b border-gray-300 flex-shrink-0">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      Edit Ledger (ترمیم)
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowLoanForm(false);
                    }}
                    title="Close"
                    className="text-muted-foreground hover:text-red-500 cursor-pointer p-1 rounded-lg hover:bg-accent"
                  >
                    <X />
                  </button>
                </div>

                {/* Content - Scrollable with hidden scrollbar */}
                <div className="px-2 py-2 overflow-y-auto flex-1 hide-scrollbar">
                  <AddCustomerFormPayment setValue={setShowLoanForm} />
                </div>
              </div>
            </div>
          </>
        )}
        {ShowDetail && (
          <PopupComponent
            onClick={eventTrigger2}
            title={"View Detail (تفصیلات دیکھیں)"}
          >
            <table className="w-full  bg-white border-collapse border border-gray-300 rounded-lg  shadow-lg mt-2">
              <thead className="bg-gray-100">
                <tr className="sticky top-0 bg-white z-10">
                  {header.map((heading) => (
                    <th
                      key={heading}
                      className=" px-4 py-3 text-left text-sm font-semibold uppercase border-b border-gray-300"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-200">
                <>
                  {supplier?.length === 0 ? (
                    <>
                      <tr>
                        <td colSpan={9} className="py-10 text-center">
                          <span className="text-lg font-semibold text-gray-500">
                            No Record Found
                          </span>
                        </td>
                      </tr>
                    </>
                  ) : (
                    supplier?.map((employee, index) => (
                      <tr key={employee.productID} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{employee.productName}</td>
                        <td className="px-4 py-3">{employee.qty}</td>
                        <td className="px-4 py-3">{employee.salePrice}</td>
                      </tr>
                    ))
                  )}
                </>
              </tbody>
            </table>
          </PopupComponent>
        )}
        <Heading
          heading="Sale Module (فروخت کا ماڈیول)"
          subHeading="(تمام فروخت)"
          onClick={eventTrigger}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              setShowLoanForm(true);
            }}
            className={`flex gap-2  "border border-gray-200 hover:bg-gray-100 cursor-pointer rounded-md shadow-sm px-3 py-2  `}
          >
            <MoreHorizontal className="w-4 h-4 mt-1" /> Add Loan (شامل کریں)
          </button>
        </div>

        <div className="mt-8">
          <SaleGetForm
            initalData={setgetEmplyeeData}
            showDetail={setShowDetail}
            setGetEmployeeDataForList={getEmplyeeDataForList}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
