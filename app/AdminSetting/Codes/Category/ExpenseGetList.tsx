import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";

import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface EmployeeModifyProps {
  initalData: (data: ExpenseList) => void;
  setgetExpenseDataForList: ExpenseList[];
  setIsLoading: boolean;
}
export default function ExpenseGetList({
  initalData,
  setgetExpenseDataForList,
  setIsLoading,
}: EmployeeModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<ExpenseList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (setgetExpenseDataForList || setIsLoading) {
      setisLoading(setIsLoading);
      setgetEmplyeeData(setgetExpenseDataForList);
    }
  }, [setgetExpenseDataForList, setIsLoading]);
  const GenderList = [
    { ID: "1", label: "M1 - Recycling" },
    { ID: "2", label: "M2 - Preform" },
    { ID: "3", label: "M3 - Bottle" },
  ];
  const header = ["#", "NAME", "EXPENSE CATEGORY", "ACTIONS"];

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.expID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return (
      emp?.categoryName.toLowerCase().includes(SearchEmployee.toLowerCase()) &&
      emp?.expenseType.includes(GenderName)
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
              placeholder="Search by Expense Name..."
              SateChange={SearchEmployee}
              setSateChange={setSearchEmployee}
              disabled={false}
            />
          </div>
          <div className="">
            <DropDownList
              label=""
              placeholder="Search by Expense Category"
              required={true}
              filedID={setGenderID}
              value={GenderName}
              onChange={setGenderName}
              options={GenderList.map((item) => ({
                label: item.label,
                value: item.label,
                id: item.ID,
              }))}
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
                <td colSpan={4} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {filterData.length === 0 ? (
                  <>
                    <tr>
                      <td colSpan={4} className="py-10 text-center">
                        <span className="text-lg font-semibold text-gray-500">
                          No Record Found
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  filterData.map((employee, index) => (
                    <tr key={employee.expID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.categoryName}</td>
                      <td className="px-4 py-3">{employee.expenseType}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.expID)}
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
