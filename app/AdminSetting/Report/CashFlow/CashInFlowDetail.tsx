import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
import GetCashFlowReportApi from "@/app/api/Controller/Report/GetCashFlowReport";
import GetCashInFlowReportApi from "@/app/api/Controller/Report/CashInFlowReport";

interface response {
  message: string;
  error: string;
  openingBalance: number;
  cashOut: number;
  dataList: dataList[];
}
interface dataList {
  postingDate: string;
  cashout: number;
  cashin: number;
  runningBalance: number;
  myStatus: string;
  systemStatus: string;
  remarks: string;
}
interface propsDates {
  dateFrom: string;
  dateTo: string;
}
export default function CashInFlowDetailReport({
  dateFrom,
  dateTo,
}: propsDates) {
  const [ExpenseReportData, setExpenseReportData] = useState<dataList[]>([]);
  const [isloading, setisLoading] = useState(false);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [CashOut, setCashOut] = useState<number>(0);
  const header = [
    "#",
    "Date (تاریخ)",
    "Cash In  (نقد رقم )",
    "Running Balance (جاری بیلنس)",
    "Transaction By (لین دین) ",
    "Status",
    "Remarks",
  ];

  const GetPurchaseTripReport = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetCashInFlowReportApi(
        dateFrom,
        dateTo,
        String(token),
      );
      if (response.status == 200) {
        const data = response.data as response;
        setExpenseReportData(data.dataList);
        setCashOut(data.cashOut);
        setOpeningBalance(data.openingBalance ?? 0);
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

    // ========== HEADER ==========
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Cash Flow Report", pageWidth / 2, 18, { align: "center" });

    // Line under the heading
    doc.setLineWidth(0.5);
    doc.line(10, 23, pageWidth - 10, 23);

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

    // ========== OPENING BALANCE (top-right of table) ==========
    const tableStartY = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      `Opening Balance: ${openingBalance.toLocaleString()}`,
      pageWidth - 10,
      tableStartY - 2,
      { align: "right" },
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      `Total Cash Out: ${CashOut.toLocaleString()}`,
      pageWidth - 10,
      tableStartY + 4,
      { align: "right" },
    );

    // ========== TABLE DATA ==========
    const scrapRows = ExpenseReportData.map((item, index) => [
      index + 1,
      new Date(item.postingDate).toISOString().split("T")[0] || "",
      item.cashin.toLocaleString(),
      item.myStatus,
      item.systemStatus,
      item.remarks.replace("~", ". "),
    ]);

    const cashIn = ExpenseReportData.reduce(
      (sum, item) => sum + item.cashin,
      0,
    );

    // Closing balance = opening + net movement
    const closingBalance = openingBalance + cashIn - CashOut;

    autoTable(doc, {
      startY: tableStartY + 7,
      head: [
        ["#", "Date ", "Cash In ", "Transaction By ", "Status", "Remarks"],
      ],
      body: scrapRows,
      foot: [["Total", "", cashIn.toLocaleString(), "", ""]],
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [55, 65, 81],
        fontStyle: "bold",
      },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
    });
    const SixthTableEndY = (doc as any).lastAutoTable.finalY;
    doc.text(
      `Cash Remaining: ${closingBalance.toLocaleString()}`,
      155,
      SixthTableEndY + 10,
    );

    // ========== SAVE PDF ==========
    doc.save("CashInFlowReport.pdf");
  };

  useEffect(() => {
    if (!dateFrom || !dateTo) return;
    else {
      setCashOut(0);
      setOpeningBalance(0);
      GetPurchaseTripReport();
    }
  }, [dateFrom, dateTo]);

  return (
    <>
      <div className="mt-2">
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
                          new Date(employee.postingDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-3">{employee.cashin}</td>
                      <td className="px-4 py-3">{employee.runningBalance}</td>
                      <td className="px-4 py-3">{employee.myStatus}</td>
                      <td className="px-4 py-3">{employee.systemStatus}</td>
                      <td className="px-4 py-3">
                        {employee.remarks.split("~")[0]}
                        <br />
                        {employee.remarks.split("~")[1]}
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
