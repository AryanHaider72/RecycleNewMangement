import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import CustomerGetApi from "@/app/api/Controller/Codes/Customer/CustomerGet";
import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import OwnerGetApi from "@/app/api/Controller/Codes/Owner/GetOwner";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import {
  CustomerList,
  responseCustomerListGet,
} from "@/app/api/Types/Codes/Customer/Customer";

import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import { responseOwnerListGet } from "@/app/api/Types/Codes/Owner/Owner";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface BankModifyProps {
  initalData: (data: CustomerList) => void;
  setgetCustomerData: CustomerList[];
  setIsLoading: boolean;
}
export default function CustomerGetList({
  initalData,
  setgetCustomerData,
  setIsLoading,
}: BankModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<CustomerList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (setgetCustomerData || setIsLoading) {
      setisLoading(setIsLoading);
      setgetEmplyeeData(setgetCustomerData);
    }
  }, [setgetCustomerData, setIsLoading]);

  const header = ["#", "NAME", "PHONE NO", "OPENING BALANCE", "TYPE", "ACTION"];

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.customerID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return (
      emp?.name.toLowerCase().includes(SearchEmployee.toLowerCase()) &&
      emp?.phoneNo.toLowerCase().includes(GenderName.toLowerCase())
    );
  });

  return (
    <>
      <div>
        <div className="w-1/2 flex gap-2">
          <div>
            <InputFieldGeneric
              label=""
              type="text"
              required={false}
              placeholder="Search by Name..."
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
                <td colSpan={7} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {filterData.length === 0 ? (
                  <>
                    <tr>
                      <td colSpan={7} className="py-10 text-center">
                        <span className="text-lg font-semibold text-gray-500">
                          No Record Found
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  filterData.map((employee, index) => (
                    <tr key={employee.customerID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.name}</td>
                      <td className="px-4 py-3">{employee.phoneNo}</td>
                      <td className="px-4 py-3">{employee.openingBalance}</td>
                      <td className="px-4 py-3">{employee.type}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.customerID)}
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
