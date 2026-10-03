import ProductGetApi from "@/app/api/Controller/Codes/Product/GetProduct";

import {
  ProductList,
  responseProductListGet,
} from "@/app/api/Types/Codes/Product/Product";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface BankModifyProps {
  initalData: (data: ProductList) => void;
  setGetProductDateList: ProductList[];
  setIsLoading: boolean;
}
export default function ProductGetList({
  initalData,
  setGetProductDateList,
  setIsLoading,
}: BankModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<ProductList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (setGetProductDateList || setIsLoading) {
      setisLoading(setIsLoading);
      setgetEmplyeeData(setGetProductDateList);
    }
  }, [setGetProductDateList, setIsLoading]);

  const header = ["#", "PRODUCT NAME", "SHORT CODE", "THRESHOLD", "ACTION"];

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.productID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return (
      emp?.productName.toLowerCase().includes(SearchEmployee.toLowerCase()) &&
      emp?.shortCode.toLowerCase().includes(GenderName.toLowerCase())
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
                    <tr key={employee.productID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.productName}</td>
                      <td className="px-4 py-3">{employee.shortCode}</td>
                      <td className="px-4 py-3">
                        {employee.threshold.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.productID)}
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
