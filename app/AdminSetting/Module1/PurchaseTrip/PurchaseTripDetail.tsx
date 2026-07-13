import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import PurchaseTripGetApi from "@/app/api/Controller/Module1/purchaseTrip/GetPurchasetTrip";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";

import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import {
  purchaseTripList,
  responsePurchaseTripListGet,
} from "@/app/api/Types/module1/purchaseTrip";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface BankModifyProps {
  initalData: (data: purchaseTripList) => void;
  callbackFunction: () => void;
}
export default function PurchaseTripDetail({
  initalData,
  callbackFunction,
}: BankModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<purchaseTripList[]>([]);
  const [isloading, setisLoading] = useState(false);

  const header = [
    "Trip No (ٹرپ نمبر)",
    "Date (تاریخ)",
    "Vehicle  (گاڑی)",
    "Advance (پیشگی)",
    "Supplier Wt (سپلائر وزن)",
    "Factory Wt  (فیکٹری وزن)",
    "Difference  (فرق)",
    "Status  (حالت)",
    "ACTION",
  ];

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await PurchaseTripGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responsePurchaseTripListGet;
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
  }, [callbackFunction]);
  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.tripID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return emp?.tripNo.toLowerCase().includes(SearchEmployee.toLowerCase());
  });

  useEffect(() => {
    EmployeeGet();
  }, []);
  return (
    <>
      <div>
        <div className="w-1/2 flex gap-2">
          <div>
            <InputFieldGeneric
              label=""
              type="text"
              required={false}
              placeholder="Search by Trip No..."
              SateChange={SearchEmployee}
              setSateChange={setSearchEmployee}
              disabled={false}
            />
          </div>
        </div>
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
                <td colSpan={9} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {filterData.length === 0 ? (
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
                  filterData.map((employee, index) => (
                    <tr key={employee.tripID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{employee.tripNo}</td>
                      <td className="px-4 py-3">
                        {
                          new Date(employee.postingDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-3">{employee.vehicleNo}</td>
                      <td className="px-4 py-3">{employee.advanceAmount}</td>
                      <td className="px-4 py-3">{employee.weightLoadedKG}</td>
                      <td className="px-4 py-3">{employee.weightEmptyKG}</td>
                      <td className="px-4 py-3">
                        {employee.weightLoadedKG - employee.weightEmptyKG}
                      </td>

                      <td className="px-4 py-3">{employee.paymentMode}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.tripID)}
                          className="px-3 py-1 border rounded"
                        >
                          Edit
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
