import { ExpenseList } from "@/app/api/Types/Codes/Expense/Expense";
import { generalExpenseList } from "@/app/api/Types/module1/GeneralExpense";
import DropDownList from "@/app/ui/DropDown/DropDown";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useRef, useState } from "react";
interface EmployeeModifyProps {
  initalData: (data: generalExpenseList) => void;
  refresh: number;
  setgetExpenseDataForList: generalExpenseList[];
  setIsLoading: boolean;
  expenseData: ExpenseList[];
}
export default function GeneralExpenseGetList({
  initalData,
  refresh,
  expenseData,
  setgetExpenseDataForList,
  setIsLoading,
}: EmployeeModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<generalExpenseList[]>(
    [],
  );
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
  const header = [
    "#",
    "NAME",
    "DATE",
    "AMOUNT",
    "PAYMENT METHOD",
    "BANK NAME",
    "EXPENSE CATEGORY",
    "ACTIONS",
  ];

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.expenseID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return emp.expenseName?.toLowerCase()?.includes(GenderName.toLowerCase());
  });

  return (
    <>
      <div>
        <div className="w-1/2 flex gap-2">
          <div className="">
            <DropDownList
              label=""
              placeholder="Search by Expense Category"
              required={true}
              filedID={setGenderID}
              value={GenderName}
              onChange={setGenderName}
              options={expenseData
                .filter((item) => item.expenseType === "M1 - Recycling")
                .map((item) => ({
                  label: item.categoryName,
                  value: item.categoryName,
                  id: item.expID,
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
                    <tr key={employee.expenseID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.expenseName}</td>
                      <td className="px-4 py-3">
                        {new Date(employee.expenseDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{employee.expenseAmount}</td>
                      <td className="px-4 py-3">{employee.paymentMethod}</td>
                      <td className="px-4 py-3">{employee.bankName}</td>
                      <td className="px-4 py-3">{employee.expnseType}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.expenseID)}
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
