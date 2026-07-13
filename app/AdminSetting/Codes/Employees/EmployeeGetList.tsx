import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface EmployeeModifyProps {
  initalData: (data: employeeList) => void;
  callbackFunction: () => void;
}
export default function EmployeeGetList({
  initalData,
  callbackFunction,
}: EmployeeModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<employeeList[]>([]);
  const [isloading, setisLoading] = useState(false);

  const GenderList = [
    { ID: "1", label: "M1 - Recycling" },
    { ID: "2", label: "M2 - Preform" },
    { ID: "3", label: "M3 - Bottle" },
  ];
  const header = [
    "NAME",
    "DEPT",
    "Wages Types(اجرت کی اقسام)",
    "CNIC",
    "Phone(فون)",
    "SALARY (تنخواہ)",
    "STATUS",
    "ACTIONS",
  ];

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetEmployeeApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseEmployeeListGet;
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
    const data = getEmplyeeData.find((item) => item.empID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return (
      emp?.name.toLowerCase().includes(SearchEmployee.toLowerCase()) ||
      emp?.cnic.toLowerCase().includes(SearchEmployee.toLowerCase()) ||
      emp?.phoneNo.toLowerCase().includes(SearchEmployee.toLowerCase()) ||
      emp?.dept.toLowerCase().includes(GenderName.toLowerCase())
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
              placeholder="Enter Name/Phone/CNIC..."
              SateChange={SearchEmployee}
              setSateChange={setSearchEmployee}
              disabled={false}
            />
          </div>
          <div className="">
            <DropDownList
              label=""
              placeholder="Enter All Modules"
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
                  filterData.map((employee) => (
                    <tr key={employee.empID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{employee.name}</td>
                      <td className="px-4 py-3">{employee.dept}</td>
                      <td className="px-4 py-3">{employee.wagesType}</td>
                      <td className="px-4 py-3">{employee.cnic}</td>
                      <td className="px-4 py-3">{employee.phoneNo}</td>
                      <td className="px-4 py-3">{employee.salary}</td>
                      <td className="px-4 py-3">{employee.status}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.empID)}
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
