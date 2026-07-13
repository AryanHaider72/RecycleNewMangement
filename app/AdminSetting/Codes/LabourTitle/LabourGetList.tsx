import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import LabourGetApi from "@/app/api/Controller/Codes/Labour/GetLabout";

import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import {
  labourList,
  responseLabourListGet,
} from "@/app/api/Types/Codes/Labour/labour";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface EmployeeModifyProps {
  initalData: (data: labourList) => void;
  callbackFunction: () => void;
}
export default function LabourGetList({
  initalData,
  callbackFunction,
}: EmployeeModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<labourList[]>([]);
  const [isloading, setisLoading] = useState(false);

  const GenderList = [
    { ID: "1", label: "M1 - Recycling" },
    { ID: "2", label: "M2 - Preform" },
    { ID: "3", label: "M3 - Bottle" },
  ];
  const header = ["#", "LABOUR TYPE", "RATE/KG", "ACTIONS"];

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await LabourGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseLabourListGet;
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
    const data = getEmplyeeData.find((item) => item.labourID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return emp?.labourType.toLowerCase().includes(SearchEmployee.toLowerCase());
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
              placeholder="Search by Expense Name..."
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
                    <tr key={employee.labourID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.labourType}</td>
                      <td className="px-4 py-3">{employee.labourType}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.labourID)}
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
