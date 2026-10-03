import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import GetExpenseReportApi from "@/app/api/Controller/Report/ExpenseReport";
import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ExpenseReport,
  ExpenseReportReposne,
} from "@/app/api/Types/Report/ExpenseReport";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";

export default function ExpenseReportDetail() {
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");
  const [getExpenseData, setgetExpenseData] = useState<ExpenseList[]>([]);
  const [ExpenseReportData, setExpenseReportData] = useState<ExpenseReport[]>(
    [],
  );
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [isloading, setisLoading] = useState(false);

  const header = [
    "#",
    "Date (تاریخ)",
    "Amount  (قیمت)",
    "Payment Mode (ادائیگی کا طریقہ)",
    "Bank Name (بینک کا نام)",
    "Status",
    "Remarks  (تفصیل)",
  ];
  const ExpenseGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await ExpenseGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseExpenseListGet;
      setgetExpenseData(data.dataList);
    } else {
      setgetExpenseData([]);
    }
  };

  const GetPurchaseTripReport = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetExpenseReportApi(
        CategoryID,
        dateFrom,
        dateTo,
        String(token),
      );
      if (response.status == 200) {
        const data = response.data as ExpenseReportReposne;
        setExpenseReportData(data.dataList);
      } else {
        setExpenseReportData([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // ========== HEADER ==========
    doc.setFontSize(16);
    doc.text("Expense Report", 105, 20, { align: "center" });
    doc.line(10, 25, 200, 25);

    doc.setFontSize(10);
    doc.text(`Expense Category: ${CategoryName}`, 10, 35);
    doc.text(`Date From: ${new Date(dateFrom).toLocaleDateString()}`, 10, 40);
    doc.text(`Date To: ${new Date(dateTo).toLocaleDateString()}`, 10, 45);

    const scrapRows = ExpenseReportData.map((item, index) => [
      index + 1,
      new Date(item.expenseDate).toISOString().split("T")[0] || "",
      item.amount.toLocaleString(),
      item.paymentMode,
      item.accountTitle,
      item.status,
      item.remakrs,
    ]);
    const total = ExpenseReportData.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Expense Detail", 15, 52);
    autoTable(doc, {
      startY: 53,
      head: [
        [
          "#",
          "Expense Date",
          "Amount",
          "Payment Mode",
          "Bank Name",
          "Status",
          "Remarks",
        ],
      ],
      body: scrapRows,
      foot: [["Total", "", total, "", "", ""]],
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [55, 65, 81],
        fontStyle: "bold",
      },
    });

    // ========== SAVE PDF ==========
    doc.save("ExpenseReport.pdf");
  };

  useEffect(() => {
    ExpenseGet();
  }, []);
  useEffect(() => {
    if (!CategoryID || !dateFrom || !dateTo) return;
    else GetPurchaseTripReport();
  }, [dateFrom, dateTo, CategoryID]);
  return (
    <>
      <div className="mt-2">
        <div className="w-full flex gap-2">
          <div className="w-full">
            <DropDownList
              label="Expense Category (اخراجات کا زمرہ)"
              required={false}
              placeholder="Enter Expense Category"
              filedID={setCategoryID}
              options={getExpenseData.map((item) => ({
                id: item.expID,
                label: item.categoryName,
                value: item.categoryName,
              }))}
              value={CategoryName}
              onChange={setCategoryName}
            />
          </div>
          <div className="w-full">
            <InputFieldGeneric
              label="Date From (تاریخِ آغاز)"
              type="date"
              required={false}
              placeholder="Enter Date From"
              SateChange={dateFrom}
              setSateChange={setdateFrom}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputFieldGeneric
              label="Date To (تاریخِ اختتام)"
              type="date"
              required={false}
              placeholder="Enter Date To"
              SateChange={dateTo}
              setSateChange={setdateTo}
              disabled={false}
            />
          </div>
        </div>
        <div className="w-full flex justify-end mt-2">
          <button
            title="Export Report"
            onClick={() => exportPDF()}
            className="px-3 py-1 border rounded hover:border-green-400 hover:text-green-500 hover:cursor-pointer"
          >
            Export
          </button>
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
                <td colSpan={9} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {ExpenseReportData.length === 0 ? (
                  <>
                    <tr>
                      <td colSpan={9} className="py-10 text-center">
                        <span className="text-lg font-semibold text-gray-500">
                          No Record Found
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  ExpenseReportData.map((employee, index) => (
                    <tr key={employee.expenseID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        {
                          new Date(employee.expenseDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-3">{employee.amount}</td>
                      <td className="px-4 py-3">{employee.paymentMode}</td>
                      <td className="px-4 py-3">{employee.accountTitle}</td>
                      <td className="px-4 py-3">{employee.status}</td>
                      <td className="px-4 py-3">{employee.remakrs}</td>
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
