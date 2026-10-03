import { EndProductList } from "@/app/api/Types/module1/EndProductList";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface EmployeeModifyProps {
  isLoading: boolean;
  searchDateFrom: (data: string) => void;
  searchDateTo: (data: string) => void;
  EndProductListMain: EndProductList[];
  setID: (data: string) => void;
}
export default function EndProductGetList({
  isLoading,
  searchDateFrom,
  searchDateTo,
  EndProductListMain,
  setID,
}: EmployeeModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [EndProductList, setEndProductList] = useState<EndProductList[]>([]);
  useEffect(() => {
    if (EndProductListMain) {
      setEndProductList(EndProductListMain);
    }
  }, [EndProductListMain]);

  const header = [
    "#",
    "DATE",
    "NAME",
    "Qty",
    "Cost Price",
    "Sale Price",
    "Scrap Kg",
    "ACTIONS",
  ];
  const filterData = EndProductList.filter((emp) => {
    return emp?.productName
      .toLowerCase()
      .includes(SearchEmployee.toLowerCase());
  });
  useEffect(() => {
    if (DateFrom) {
      searchDateFrom(DateFrom);
    }
    if (DateTo) {
      searchDateTo(DateTo);
    }
  }, [DateFrom, DateTo]);

  return (
    <>
      <div>
        <div className="flex gap-2">
          <div className="w-full mt-2">
            <InputFieldGeneric
              label="Search By"
              type="text"
              required={false}
              placeholder="Search by Product Name..."
              SateChange={SearchEmployee}
              setSateChange={setSearchEmployee}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputFieldGeneric
              label="Date From (تاریخِ آغاز)"
              type="date"
              required={true}
              placeholder="Enter Date From"
              SateChange={DateFrom}
              setSateChange={setDateFrom}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputFieldGeneric
              label="Date To (تاریخِ اختتام)"
              type="date"
              required={true}
              placeholder="Enter Date To"
              SateChange={DateTo}
              setSateChange={setDateTo}
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
            {isLoading ? (
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
                    <tr key={employee.endID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        {new Date(employee.postingDate).toDateString()}
                      </td>
                      <td className="px-4 py-3">{employee.productName}</td>
                      <td className="px-4 py-3">{employee.qty}</td>
                      <td className="px-4 py-3">
                        {employee.costPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.salePrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.scrapKG.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setID(employee.endID)}
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
