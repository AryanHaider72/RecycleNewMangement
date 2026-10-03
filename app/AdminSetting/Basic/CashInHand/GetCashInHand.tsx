import GetCashInHandApi from "@/app/api/Controller/CashInHand/GetCashInHand";
import {
  cashInList,
  ResposneCashInHand,
} from "@/app/api/Types/CashinHand/CashInHand";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useMemo, useRef, useState } from "react";

interface BankModifyProps {
  initalData: (data: cashInList) => void;
  refresh: number;
}

export default function CashinGetList({
  initalData,
  refresh,
}: BankModifyProps) {
  const hasFetchedEmployees = useRef(false);
  const [isloading, setisLoading] = useState(false);
  const [moduleList, setModuleList] = useState<cashInList[]>([]);

  const header = ["#", "POSTING DATE", "AMOUNT", "REMARKS", "ACTION"];

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await GetCashInHandApi(String(token));
      if (response.status === 200) {
        const data = response.data as ResposneCashInHand;
        setModuleList(data.dataList || []);
      } else {
        setModuleList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    EmployeeGet();
  }, [refresh]);
  const assignData = (ID: string) => {
    const data = moduleList.find((item) => item.cashID === ID);
    if (data) {
      initalData(data);
    }
  };
  return (
    <div>
      {/* ---------- TABLE ---------- */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full bg-white border-collapse border border-gray-300 rounded-lg shadow-lg">
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

          <tbody className="divide-y divide-gray-200">
            {isloading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : moduleList.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <span className="text-lg font-semibold text-gray-500">
                    No Record Found
                  </span>
                </td>
              </tr>
            ) : (
              moduleList.map((row, index) => (
                <tr key={row.cashID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap sticky left-0 bg-white">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap sticky left-0 bg-white">
                    {new Date(row.postingDate).toDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap sticky left-0 bg-white">
                    {row.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap sticky left-0 bg-white">
                    {row.remarks}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => assignData(row.cashID)}
                      className="px-3 py-1 border rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
