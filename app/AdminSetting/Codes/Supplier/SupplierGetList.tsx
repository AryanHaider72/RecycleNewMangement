import SupplierGetApi from "@/app/api/Controller/Codes/Supplier/GetSupplier";

import {
  responseSupplierListGet,
  SupplierList,
} from "@/app/api/Types/Codes/Supplier/Supplier";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface BankModifyProps {
  initalData: (data: SupplierList) => void;
  setgetSupplierData: SupplierList[];
  setIsLoading: boolean;
}
export default function SupplierGetList({
  initalData,
  setgetSupplierData,
  setIsLoading,
}: BankModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<SupplierList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (setgetSupplierData || setIsLoading) {
      setisLoading(setIsLoading);
      setgetEmplyeeData(setgetSupplierData);
    }
  }, [setgetSupplierData, setIsLoading]);

  const header = [
    "#",
    "NAME",
    "PHONE NO",
    "ACCOUNT TYPE",
    "OPENING BALANCE",
    "ACTION",
  ];

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.supplierID === ID);
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
                <td colSpan={5} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {filterData.length === 0 ? (
                  <>
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <span className="text-lg font-semibold text-gray-500">
                          No Record Found
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  filterData.map((employee, index) => (
                    <tr key={employee.supplierID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.name}</td>
                      <td className="px-4 py-3">{employee.phoneNo}</td>
                      <td className="px-4 py-3">{employee.accountType}</td>
                      <td className="px-4 py-3">{employee.openingBalance}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.supplierID)}
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
