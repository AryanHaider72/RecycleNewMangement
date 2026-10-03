import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import GetEmployeeLedgerApi from "@/app/api/Controller/Ledger/Employee/GetEmployeeLedger";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import {
  employeeLedegrList,
  EmployeeLedgerAddRequest,
  responseEmployeeLedgerListGet,
} from "@/app/api/Types/Ledger/EmoployeeLedger";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import StatsCard from "@/app/ui/StatCard/StatCard";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
interface EmployeeModifyProps {
  initalData: (data: employeeLedegrList) => void;
  moduleList: employeeList[];
  refresh: number;
  deleteID: (data: string) => void;
  deleteNow: (data: boolean) => void;
}

export default function EmployeeLedgerGetList({
  initalData,
  moduleList,
  refresh,
  deleteID,
  deleteNow,
}: EmployeeModifyProps) {
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState("");
  const [getEmplyeeData, setgetEmplyeeData] = useState<employeeLedegrList[]>(
    [],
  );
  const [isloading, setisLoading] = useState(false);

  const header = [
    "#",
    "DATE",
    "DEBIT AMOUNT",
    "CREDIT AMOUNT",
    "RUNNING BALANCE",
    "STATUS",
    "PAYMENT MODE",
    "BANK NAME",
    "REMARKS",
    "ACTIONS",
  ];

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        dateFrom: DateFrom,
        dateTo: DateTo,
        empID: GenderID,
      };
      const response = await GetEmployeeLedgerApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as responseEmployeeLedgerListGet;
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
  }, [refresh, DateFrom, DateTo, GenderID]);

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.ledgerID === ID);
    if (data) {
      initalData(data);
    }
  };

  useEffect(() => {
    EmployeeGet();
  }, [DateFrom, DateTo, GenderID]);
  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(date.getFullYear() - 1);

    setDateFrom(lastYear.toISOString().split("T")[0]);
    setDateTo(date.toISOString().split("T")[0]);
  }, []);

  const balance = getEmplyeeData
    .filter((item) => item.status !== "Salary")
    .reduce((sum, item) => {
      return sum + item.debitAmount - item.creditAmount;
    }, 0);

  const cashIN = getEmplyeeData
    .filter((item) => item.status !== "Salary" && item.status !== "Salary(KG)")

    .reduce((sum, item) => {
      return sum + item.debitAmount;
    }, 0);
  const cashOut = getEmplyeeData
    .filter((item) => item.status !== "Salary" && item.status !== "Salary(KG)")
    .reduce((sum, item) => {
      return sum + item.creditAmount;
    }, 0);
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // ---- Report Heading ----
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Employee Ledger Report", pageWidth / 2, 40, { align: "center" });

    // ---- Line under heading ----
    doc.setDrawColor(41, 128, 185); // blue line
    doc.setLineWidth(1.2);
    doc.line(margin, 52, pageWidth - margin, 52);

    // ---- Date From / Date To (flex justify-between) ----
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Date From: ${DateFrom || "-"}`, margin, 75);
    doc.text(`Date To: ${DateTo || "-"}`, pageWidth - margin, 75, {
      align: "right",
    });

    // ---- Employee Name ----
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Employee: ${GenderName || "All Employees"}`, margin, 95);

    // ---- Stats Section (clean, minimal design) ----
    const statsY = 120;
    const statsHeight = 50;
    const statsWidth = pageWidth - margin * 2;
    const colWidth = statsWidth / 3;

    // Outer border box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.8);
    doc.rect(margin, statsY, statsWidth, statsHeight);

    // Vertical divider lines between the 3 stats
    doc.setDrawColor(220, 220, 220);
    doc.line(
      margin + colWidth,
      statsY,
      margin + colWidth,
      statsY + statsHeight,
    );
    doc.line(
      margin + colWidth * 2,
      statsY,
      margin + colWidth * 2,
      statsY + statsHeight,
    );

    // Stats content
    const stats = [
      { label: "Cash In", value: String(cashIN.toLocaleString() || 0) },
      {
        label: "Arrear / Balance",
        value: String(balance.toLocaleString() || 0),
      },
      { label: "Cash Out", value: String(cashOut.toLocaleString() || 0) },
    ];

    stats.forEach((stat, i) => {
      const centerX = margin + colWidth * i + colWidth / 2;

      // Label (small, gray, uppercase)
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(stat.label.toUpperCase(), centerX, statsY + 20, {
        align: "center",
      });

      // Value (bold, larger, black)
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(stat.value, centerX, statsY + 40, { align: "center" });
    });

    // ---- Table ----
    const tableColumn = [
      "#",
      "DATE",
      "DEBIT AMOUNT",
      "CREDIT AMOUNT",
      "RUNNING BALANCE",
      "STATUS",
      "PAYMENT MODE",
      "BANK NAME",
      "REMARKS",
    ];

    const tableRows = getEmplyeeData.map((employee, index) => [
      index + 1,
      new Date(employee.postingDate).toLocaleDateString(),
      employee.debitAmount.toLocaleString() ?? "-",
      employee.creditAmount.toLocaleString() ?? "-",
      employee.runningBalance.toLocaleString() ?? "-",
      employee.status ?? "-",
      employee.paymentMode ?? "-",
      employee.bankName ?? "-",
      employee.remarks ?? "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: statsY + statsHeight + 20,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 5,
        overflow: "linebreak",
        textColor: [40, 40, 40],
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 30 },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const pageNumber = doc.getCurrentPageInfo().pageNumber;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(
          `Page ${pageNumber} of ${pageCount}`,
          pageWidth - margin,
          doc.internal.pageSize.getHeight() - 20,
          { align: "right" },
        );
      },
    });

    doc.save(
      `Employee_Ledger_${GenderName || "All"}_${DateFrom}_to_${DateTo}.pdf`,
    );
  };
  return (
    <>
      <div>
        <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Employee Dropdown - Takes full width on mobile */}
          <div className="w-full mt-2 md:w-1/3">
            <DropDownList
              label="Employee (ملازمین)"
              placeholder="Select Employee"
              required={true}
              filedID={setGenderID}
              value={GenderName}
              onChange={setGenderName}
              options={moduleList.map((item) => ({
                label: item.name,
                value: item.name,
                id: item.empID,
              }))}
            />
          </div>

          {/* Date From */}
          <div className="w-full md:w-1/3">
            <InputFieldGeneric
              label="Date From (تاریخِ آغاز)"
              type="date"
              required={true}
              placeholder="Enter Name/Phone/CNIC..."
              SateChange={DateFrom}
              setSateChange={setDateFrom}
              disabled={false}
            />
          </div>

          {/* Date To */}
          <div className="w-full md:w-1/3">
            <InputFieldGeneric
              label="Date To (تاریخِ اختتام)"
              type="date"
              required={true}
              placeholder="Enter Name/Phone/CNIC..."
              SateChange={DateTo}
              setSateChange={setDateTo}
              disabled={false}
            />
          </div>
        </div>
        {getEmplyeeData.length > 0 && (
          <div className="flex gap-2 mt-4 mb-4">
            <StatsCard
              title="Cash In"
              value={String(cashIN) || "0"}
              urduTitle="کیش اِن"
              icon=""
            />
            <StatsCard
              title="Arrear/Balance"
              value={String(balance) || "0"}
              urduTitle="بقایا جات / بیلنس"
              icon=""
            />
            <StatsCard
              title="Cash Out"
              value={String(cashOut) || "0"}
              urduTitle="کیش آؤٹ"
              icon=""
            />
          </div>
        )}
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
                <td colSpan={8} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {getEmplyeeData.length === 0 ? (
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
                  getEmplyeeData.map((employee, index) => (
                    <tr key={employee.empID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        {new Date(employee.postingDate).toDateString()}
                      </td>
                      <td className="px-4 py-3 ">
                        {employee.debitAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.creditAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.runningBalance.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-3 ${
                          [
                            "Bonus",
                            "Labour Paid",
                            "Trip Remaining",
                            "Trip Expense",
                            "Driver Amount",
                            "Trip-Salary",
                            "Labour Due",
                            "Labour Charges",
                            "Loan",
                            "Company Payment",
                            "Salary",
                            "Salary(KG)",
                            "Labour Payment",
                          ].includes(employee.status)
                            ? "text-red-500 font-bold"
                            : "text-green-500 font-bold"
                        }`}
                      >
                        {employee.status}
                      </td>
                      <td className="px-4 py-3">{employee.paymentMode}</td>
                      <td className="px-4 py-3">{employee.bankName}</td>
                      <td className="px-4 py-3">{employee.remarks}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => assignData(employee.empID)}
                          className="px-3 py-1 border rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteID(employee.ledgerID);
                            deleteNow(true);
                          }}
                          className="px-3 py-1 text-red-500 border border-red-500 rounded"
                        >
                          Delete
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
