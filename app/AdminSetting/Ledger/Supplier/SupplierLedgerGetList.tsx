import GetCustomerLedgerApi from "@/app/api/Controller/Ledger/Customer/GetCustomerLedger";
import GetSupplierLedgerApi from "@/app/api/Controller/Ledger/Supplier/GetSupplierLedger";
import { CustomerList } from "@/app/api/Types/Codes/Customer/Customer";
import { SupplierList } from "@/app/api/Types/Codes/Supplier/Supplier";

import {
  CustomerLedegrList,
  responseCustomerLedgerListGet,
} from "@/app/api/Types/Ledger/CustomerLedger";
import {
  responseSupplierLedgerListGet,
  SupplierLedegrList,
} from "@/app/api/Types/Ledger/SupplierLedger";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import StatsCard from "@/app/ui/StatCard/StatCard";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface EmployeeModifyProps {
  initalData: (data: SupplierLedegrList) => void;
  moduleList: SupplierList[];
  refresh: number;
  deleteID: (data: string) => void;
  deleteNow: (data: boolean) => void;
}
export default function SupplierLedgerGetList({
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
  const [getEmplyeeData, setgetEmplyeeData] = useState<SupplierLedegrList[]>(
    [],
  );
  const [openingBalance, setOpeningBalance] = useState(0);
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
        supplierID: GenderID,
      };
      const response = await GetSupplierLedgerApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as responseSupplierLedgerListGet;
        setgetEmplyeeData(data.dataList);
        setOpeningBalance(data.openingBalance);
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
  const cashin = getEmplyeeData
    .filter((item) => item.status !== "Opening Balance")
    .reduce((sum, item) => {
      return sum + item.debitAmount;
    }, 0);
  const cashOut = getEmplyeeData
    .filter((item) => item.status !== "Opening Balance")
    .reduce((sum, item) => {
      return sum + item.creditAmount;
    }, 0);
  const balance = getEmplyeeData.reduce((sum, item) => {
    return sum + item.debitAmount - item.creditAmount;
  }, 0);

  // ---------------- PDF EXPORT FUNCTION ----------------
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
    doc.setTextColor(0, 0, 0);
    doc.text("Supplier Ledger Report", pageWidth / 2, 40, { align: "center" });

    // ---- Line under heading ----
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1.2);
    doc.line(margin, 52, pageWidth - margin, 52);

    // ---- Date From / Date To ----
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Date From: ${DateFrom || "-"}`, margin, 75);
    doc.text(`Date To: ${DateTo || "-"}`, pageWidth - margin, 75, {
      align: "right",
    });

    // ---- Supplier Name ----
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Supplier: ${GenderName || "All Suppliers"}`, margin, 95);

    // ---- Stats Section (clean bordered strip) ----
    const statsY = 120;
    const statsHeight = 50;
    const statsWidth = pageWidth - margin * 2;
    const colWidth = statsWidth / 3;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.8);
    doc.rect(margin, statsY, statsWidth, statsHeight);

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

    const stats = [
      { label: "Cash In", value: String(cashin || 0) },
      { label: "Arrear / Balance", value: String(balance || 0) },
      { label: "Cash Out", value: String(cashOut || 0) },
    ];

    stats.forEach((stat, i) => {
      const centerX = margin + colWidth * i + colWidth / 2;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(stat.label.toUpperCase(), centerX, statsY + 20, {
        align: "center",
      });

      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(stat.value, centerX, statsY + 40, { align: "center" });
    });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(
      `Opening Balance: ${openingBalance.toLocaleString() || "0"}`,
      pageWidth - margin,
      statsY + statsHeight + 14,
      {
        align: "right",
      },
    );
    // ---- Table ----
    const tableColumn = [
      "#",
      "DATE",
      "DEBIT",
      "CREDIT",
      "RUNNING BALANCE",
      "STATUS",
      "PAYMENT MODE",
      "BANK NAME",
      "REMARKS",
    ];

    const tableRows = getEmplyeeData.map((item, index) => [
      index + 1,
      new Date(item.postingDate).toDateString(),
      item.debitAmount ?? "-",
      item.creditAmount ?? "-",
      item.runningBalance ?? "-",
      item.status ?? "-",
      item.paymentMode ?? "-",
      item.bankName ?? "N/A",
      item.remarks ?? "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: statsY + statsHeight + 20,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4,
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
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 28 },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      didDrawPage: () => {
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
      `Supplier_Ledger_${GenderName || "All"}_${DateFrom}_to_${DateTo}.pdf`,
    );
  };

  return (
    <>
      <div>
        <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Employee Dropdown - Takes full width on mobile */}
          <div className="w-full mt-2 md:w-1/3">
            <DropDownList
              label="Supplier (سپلائر)"
              placeholder="Select Supplier"
              required={true}
              filedID={setGenderID}
              value={GenderName}
              onChange={setGenderName}
              options={moduleList.map((item) => ({
                label: item.name,
                value: item.name,
                id: item.supplierID,
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
              value={String(cashin)}
              urduTitle="کیش اِن"
              icon=""
            />
            <StatsCard
              title="Arrear/Balance"
              value={String(balance)}
              urduTitle="بقایا جات / بیلنس"
              icon=""
            />
            <StatsCard
              title="Cash Out"
              value={String(cashOut)}
              urduTitle="کیش آؤٹ"
              icon=""
            />
          </div>
        )}
        <div className="w-full flex justify-end mt-2">
          <button
            title="Export Report"
            onClick={exportPDF}
            disabled={getEmplyeeData.length === 0}
            className="px-3 py-1 border rounded hover:border-green-400 hover:text-green-500 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <tr key={employee.ledgerID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        {new Date(employee.postingDate).toDateString()}
                      </td>
                      <td className="px-4 py-3">{employee.debitAmount}</td>
                      <td className="px-4 py-3">{employee.creditAmount}</td>
                      <td className="px-4 py-3">{employee.runningBalance}</td>
                      <td className="px-4 py-3">{employee.paymentMode}</td>
                      <td className="px-4 py-3">{employee.bankName}</td>
                      <td className="px-4 py-3">{employee.status}</td>
                      <td className="px-4 py-3">{employee.remarks}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => assignData(employee.ledgerID)}
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
