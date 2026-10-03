import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
import GetTotalExpenseReportApi from "@/app/api/Controller/Report/TotalExpenseReportDate";

interface Expoertresponse {
  message: string;
  error: string;
  dataList: ExpenseReport[];
  openingBalance: number;
  cashIn: number;
}
interface ExpenseReport {
  tripDate: string;
  amount: number;
  remarks: string;
  expenseType: string;
  status: string;
  runningBalance: number;
}

export default function TotalExpenseReportDetail() {
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");
  const [ExpenseReportData, setExpenseReportData] = useState<ExpenseReport[]>(
    [],
  );
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [CashIn, setCashIn] = useState<number>(0);
  const [isloading, setisLoading] = useState(false);

  const header = [
    "#",
    "Date (تاریخ)",
    "Expense Type (اخراجات کی قسم)",
    "Status ",
    "Remarks  (تفصیل)",
    "Amount  (قیمت)",
    "Running Balance",
  ];

  const GetPurchaseTripReport = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetTotalExpenseReportApi(
        dateFrom,
        dateTo,
        String(token),
      );
      if (response.status == 200) {
        const data = response.data as Expoertresponse;
        setExpenseReportData(data.dataList);
        setOpeningBalance(data.openingBalance);
        setCashIn(data.cashIn);
      } else {
        setExpenseReportData([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Expense Report", pageWidth / 2, 20, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(margin, 25, pageWidth - margin, 25);

    // ========== DATE RANGE (justified) ==========
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date From: ${new Date(dateFrom).toLocaleDateString()}`, 10, 32);
    doc.text(
      `Date To: ${new Date(dateTo).toLocaleDateString()}`,
      pageWidth - 10,
      32,
      { align: "right" },
    );

    const tableStartY = 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      `Opening Balance: ${openingBalance.toLocaleString()}`,
      pageWidth - 10,
      tableStartY + 1,
      { align: "right" },
    );

    doc.text(
      `Total Cash In: ${CashIn.toLocaleString()}`,
      pageWidth - 10,
      tableStartY + 5,
      { align: "right" },
    );

    const scrapRows = ExpenseReportData.map((item, index) => [
      index + 1,
      new Date(item.tripDate).toISOString().split("T")[0] || "",
      item.expenseType,
      item.status,
      item.remarks,
      item.amount.toLocaleString(),
      item.runningBalance.toLocaleString(),
    ]);

    autoTable(doc, {
      startY: tableStartY + 7,
      head: [
        [
          "#",
          "Date ",
          "Expense Type",
          "Status ",
          "Remarks  ",
          "Amount",
          "Running Balance",
        ],
      ],
      body: scrapRows,
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [55, 65, 81],
        fontStyle: "bold",
      },
    });
    const CashOut = ExpenseReportData.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const SixthTableEndY = (doc as any).lastAutoTable.finalY;

    const closingBalance = openingBalance + CashIn - CashOut;

    doc.text(
      `Cash Remaining: ${closingBalance.toLocaleString()}`,
      155,
      SixthTableEndY + 10,
    );

    // ========== SAVE PDF ==========
    doc.save("ExpenseReport.pdf");
  };

  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();

    lastYear.setMonth(date.getMonth() - 1);

    setdateFrom(lastYear.toISOString().split("T")[0]);
    setdateTo(date.toISOString().split("T")[0]);
  }, []);
  useEffect(() => {
    if (!dateFrom || !dateTo) return;
    else {
      setOpeningBalance(0);
      setCashIn(0);
      GetPurchaseTripReport();
    }
  }, [dateFrom, dateTo]);
  return (
    <>
      <div className="mt-2">
        <div className="w-full flex gap-2">
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
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        {
                          new Date(employee.tripDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-3">{employee.expenseType}</td>
                      <td className="px-4 py-3">{employee.status}</td>
                      <td className="px-4 py-3">{employee.remarks}</td>
                      <td className="px-4 py-3">
                        {employee.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.runningBalance.toLocaleString()}
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
