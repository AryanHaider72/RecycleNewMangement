import SaleGetApi from "@/app/api/Controller/Module1/SaleModule/GetSale";
import {
  responseSaleListGet,
  SaleList,
} from "@/app/api/Types/module1/SaleModuel";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface SaleDetailProps {
  initalData: (data: SaleList) => void;
  showDetail: (data: boolean) => void;
  setGetEmployeeDataForList: SaleList[];
  setIsLoading: boolean;
}

export default function SaleGetForm({
  initalData,
  showDetail,
  setGetEmployeeDataForList,
  setIsLoading,
}: SaleDetailProps) {
  const [getEmplyeeData, setgetEmplyeeData] = useState<SaleList[]>([]);
  const [isloading, setisLoading] = useState(false);
  const [SearchEmployee, setSearchEmployee] = useState("");
  useEffect(() => {
    if (setGetEmployeeDataForList || setIsLoading) {
      setisLoading(setIsLoading);
      setgetEmplyeeData(setGetEmployeeDataForList);
    }
  }, [setGetEmployeeDataForList, setIsLoading]);
  const header = [
    "Date (تاریخ)",
    "Invoice No (گاہک)",
    "Customer (گاڑی)",
    "Phone No (گاڑی)",
    "Total Bill (کل بل)",
    "Amount Paid (ادا کردہ رقم)",
    "Payment Method (ادائیگی کا طریقہ)",
    "Bank Name (بینک کا نام)",
    "ACTION",
  ];

  const filterData = getEmplyeeData.filter((emp) => {
    return (
      emp?.customerName.toLowerCase().includes(SearchEmployee.toLowerCase()) &&
      emp?.invoiceNo.includes(SearchEmployee.toLowerCase())
    );
  });
  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.saleID === ID);
    if (data) {
      initalData(data);
      showDetail(true);
    }
  };
  return (
    <>
      <div>
        <div className="w-1/2 flex gap-2">
          <div>
            <InputFieldGeneric
              label=""
              type="text"
              required={false}
              placeholder="Search by Customer/Invoice"
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
                    <tr key={employee.saleID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {
                          new Date(employee.postingDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-3">{employee.invoiceNo}</td>
                      <td className="px-4 py-3">{employee.customerName}</td>
                      <td className="px-4 py-3">{employee.phoneNo}</td>
                      <td className="px-4 py-3">{employee.totalBill}</td>
                      <td className="px-4 py-3">{employee.amountPaid}</td>
                      <td className="px-4 py-3">{employee.paymentMode}</td>
                      <td className="px-4 py-3">{employee.bankName}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.saleID)}
                          className="px-3 py-1 border rounded"
                        >
                          Detail
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
