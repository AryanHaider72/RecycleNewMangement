import GetCustomerLedgerApi from "@/app/api/Controller/Ledger/Customer/GetCustomerLedger";
import { CustomerList } from "@/app/api/Types/Codes/Customer/Customer";

import {
  CustomerLedegrList,
  responseCustomerLedgerListGet,
} from "@/app/api/Types/Ledger/CustomerLedger";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import StatsCard from "@/app/ui/StatCard/StatCard";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface EmployeeModifyProps {
  initalData: (data: CustomerLedegrList) => void;
  setDateFrom: (data: string) => void;
  DateFrom: string;
  DateTo: string;
  isLoading: boolean;
  setDateTo: (data: string) => void;
  setCustomerID: (data: string) => void;
  setCustomerName: (data: string) => void;
  CustomerName: string;
  moduleList: CustomerList[];
  balance: number;
  deleteID: (data: string) => void;
  deleteNow: (data: boolean) => void;
  setCustomerGetData: CustomerLedegrList[];
}
export default function CustomerLedgerGetList({
  initalData,
  moduleList,
  deleteID,
  deleteNow,
  setDateFrom,
  setDateTo,
  setCustomerName,
  setCustomerID,
  setCustomerGetData,
  CustomerName,
  balance,
  isLoading,
  DateFrom,
  DateTo,
}: EmployeeModifyProps) {
  const [getEmplyeeData, setgetEmplyeeData] = useState<CustomerLedegrList[]>(
    [],
  );
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (setCustomerGetData) {
      setisLoading(isLoading);
      setgetEmplyeeData(setCustomerGetData);
    }
  }, [setCustomerGetData, isLoading, setDateFrom, setDateTo, setCustomerID]);

  const header = [
    "#",
    "DATE",
    "CREDIT AMOUNT",
    "DEBIT AMOUNT",
    "STATUS",
    "Payment Mode",
    "Bank Name",
    "REMARKS",
    "ACTIONS",
  ];

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.ledgerID === ID);
    if (data) {
      initalData(data);
    }
  };

  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(date.getFullYear() - 1);

    setDateFrom(lastYear.toISOString().split("T")[0]);
    setDateTo(date.toISOString().split("T")[0]);
  }, []);

  // const balance = getEmplyeeData.reduce((sum, item) => {
  //   return sum + item.debitAmount - item.creditAmount;
  // }, 0);

  const cashIN = getEmplyeeData
    // .filter(
    //   (item) =>
    //     item.status?.trim().toLowerCase() !== "opening balance" &&
    //     item.status?.trim().toLowerCase() !== "sale",
    // )
    .reduce((sum, item) => {
      return sum + Number(item.debitAmount || 0);
    }, 0);

  const cashOut = getEmplyeeData
    // .filter(
    //   (item) =>
    //     item.status?.trim().toLowerCase() !== "opening balance" &&
    //     item.status?.trim().toLowerCase() !== "sale",
    // )
    .reduce((sum, item) => {
      return sum + Number(item.creditAmount || 0);
    }, 0);

  return (
    <>
      <div>
        <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Employee Dropdown - Takes full width on mobile */}
          <div className="w-full mt-2 md:w-1/3">
            <DropDownList
              label="Customer (گاہک)"
              placeholder="Select Customer"
              required={true}
              filedID={setCustomerID}
              value={CustomerName}
              onChange={setCustomerName}
              options={moduleList.map((item) => ({
                label: item.name,
                value: item.name,
                id: item.customerID,
              }))}
            />
          </div>

          {/* Date From */}
          <div className="w-full md:w-1/3">
            <InputFieldGeneric
              label="Date From (تاریخِ آغاز)"
              type="date"
              required={true}
              placeholder="Enter Name/Phone/CNIC..."
              SateChange={DateFrom}
              setSateChange={setDateFrom}
              disabled={false}
            />
          </div>

          {/* Date To */}
          <div className="w-full md:w-1/3">
            <InputFieldGeneric
              label="Date To (تاریخِ اختتام)"
              type="date"
              required={true}
              placeholder="Enter Name/Phone/CNIC..."
              SateChange={DateTo}
              setSateChange={setDateTo}
              disabled={false}
            />
          </div>
        </div>
        {getEmplyeeData.length > 0 && (
          <div className="flex gap-2 mt-4 mb-4">
            <StatsCard
              title="Cash In"
              value={String(cashIN) || "0"}
              urduTitle="کیش اِن"
              icon=""
            />
            <StatsCard
              title="Arrear/Balance"
              value={String(balance) || "0"}
              urduTitle="بقایا جات / بیلنس"
              icon=""
            />
            <StatsCard
              title="Cash Out"
              value={String(cashOut) || "0"}
              urduTitle="کیش آؤٹ"
              icon=""
            />
          </div>
        )}
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
            {isloading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {getEmplyeeData.length === 0 ? (
                  <>
                    <tr>
                      <td colSpan={8} className="py-10 text-center">
                        <span className="text-lg font-semibold text-gray-500">
                          No Record Found
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  getEmplyeeData.map((employee, index) => (
                    <tr key={employee.customerID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        {
                          new Date(employee.postingDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-3">{employee.creditAmount}</td>
                      <td className="px-4 py-3">{employee.debitAmount}</td>
                      <td className="px-4 py-3">{employee.status}</td>
                      <td className="px-4 py-3">{employee.paymentMode}</td>
                      <td className="px-4 py-3">{employee.bankName}</td>
                      <td className="px-4 py-3">{employee.remarks}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => assignData(employee.customerID)}
                          className="px-3 py-1 border rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteID(employee.ledgerID);
                            deleteNow(true);
                          }}
                          className="px-3 py-1 text-red-500 border border-red-500 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
