import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import OwnerGetApi from "@/app/api/Controller/Codes/Owner/GetOwner";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";

import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import {
  OwnerList,
  responseOwnerListGet,
} from "@/app/api/Types/Codes/Owner/Owner";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface BankModifyProps {
  initalData: (data: OwnerList) => void;
  callbackFunction: () => void;
}
export default function OwnerGetList({
  initalData,
  callbackFunction,
}: BankModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<OwnerList[]>([]);
  const [isloading, setisLoading] = useState(false);

  const header = [
    "#",
    "NAME",
    "PHONE NO",
    "ADDRESS",
    "OPENING BALANCE",
    "Type",
    "ACTION",
  ];

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await OwnerGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseOwnerListGet;
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
    const data = getEmplyeeData.find((item) => item.ownerID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return (
      emp?.name.toLowerCase().includes(SearchEmployee.toLowerCase()) ||
      emp?.phoneNo.toLowerCase().includes(GenderName.toLowerCase())
    );
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
              placeholder="Search by Name/Phone No..."
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
                <td colSpan={8} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {filterData.length === 0 ? (
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
                  filterData.map((employee, index) => (
                    <tr key={employee.ownerID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.name}</td>
                      <td className="px-4 py-3">{employee.phoneNo}</td>
                      <td className="px-4 py-3">{employee.openingBalance}</td>
                      <td className="px-4 py-3">{employee.type}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.ownerID)}
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
