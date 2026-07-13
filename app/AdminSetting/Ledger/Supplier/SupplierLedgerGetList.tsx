import GetCustomerLedgerApi from "@/app/api/Controller/Ledger/Customer/GetCustomerLedger";
import { CustomerList } from "@/app/api/Types/Codes/Customer/Customer";
import { SupplierList } from "@/app/api/Types/Codes/Supplier/Supplier";

import {
  CustomerLedegrList,
  responseCustomerLedgerListGet,
} from "@/app/api/Types/Ledger/CustomerLedger";
import {
  responseSupplierLedgerListGet,
  SupplierLedegrList,
} from "@/app/api/Types/Ledger/SupplierLedger";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import StatsCard from "@/app/ui/StatCard/StatCard";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface EmployeeModifyProps {
  initalData: (data: SupplierLedegrList) => void;
  moduleList: SupplierList[];
  callbackFunction: () => void;
  deleteID: (data: string) => void;
  deleteNow: (data: boolean) => void;
}
export default function SupplierLedgerGetList({
  initalData,
  moduleList,
  callbackFunction,
  deleteID,
  deleteNow,
}: EmployeeModifyProps) {
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState("");
  const [getEmplyeeData, setgetEmplyeeData] = useState<SupplierLedegrList[]>(
    [],
  );
  const [isloading, setisLoading] = useState(false);

  const header = [
    "#",
    "DATE",
    "CREDIT AMOUNT",
    "DEBIT AMOUNT",
    "STATUS",
    "REMARKS",
    "ACTIONS",
  ];

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        dateFrom: DateFrom,
        dateTo: DateTo,
        customerID: GenderID,
      };
      const response = await GetCustomerLedgerApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as responseSupplierLedgerListGet;
        setgetEmplyeeData(data.dataList);
      } else {
        setgetEmplyeeData([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    EmployeeGet();
  }, [callbackFunction, DateFrom, DateTo, GenderID]);

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.ledgerID === ID);
    if (data) {
      initalData(data);
    }
  };

  useEffect(() => {
    EmployeeGet();
  }, [DateFrom, DateTo, GenderID]);
  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(date.getFullYear() - 1);

    setDateFrom(lastYear.toISOString().split("T")[0]);
    setDateTo(date.toISOString().split("T")[0]);
  }, []);
  return (
    <>
      <div>
        <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Employee Dropdown - Takes full width on mobile */}
          <div className="w-full mt-2 md:w-1/3">
            <DropDownList
              label="Supplier (سپلائر)"
              placeholder="Select Supplier"
              required={true}
              filedID={setGenderID}
              value={GenderName}
              onChange={setGenderName}
              options={moduleList.map((item) => ({
                label: item.name,
                value: item.name,
                id: item.supplierID,
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
              title="Total Earned"
              value="0.00"
              urduTitle=" کل کمائیں "
              icon=""
            />
            <StatsCard
              title="Total Paid"
              value="0.00"
              urduTitle="کل ادا شدہ"
              icon=""
            />
            <StatsCard
              title="OutStanding"
              value="0.00"
              urduTitle="بقیہ"
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
                    <tr key={employee.supplierID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.postingDate}</td>
                      <td className="px-4 py-3">{employee.creditAmount}</td>
                      <td className="px-4 py-3">{employee.debitAmount}</td>
                      <td className="px-4 py-3">{employee.status}</td>
                      <td className="px-4 py-3">{employee.remarks}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => assignData(employee.supplierID)}
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
