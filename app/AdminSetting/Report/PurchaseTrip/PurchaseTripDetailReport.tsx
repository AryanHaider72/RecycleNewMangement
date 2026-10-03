import GetPurchaseTripReportApi from "@/app/api/Controller/Report/PurhcaseTripReport";
import {
  PurcahseTripReport,
  PurcahseTripReportReposne,
} from "@/app/api/Types/Report/PurchaseTrip";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";

export default function PurchaseTripDetailReport() {
  const [getTripData, setgetTripData] = useState<PurcahseTripReport[]>([]);
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [isloading, setisLoading] = useState(false);
  const exportPDF = () => {
    if (getTripData.length === 0) {
      return;
    }

    // =========================
    // A4 PORTRAIT
    // =========================
    const doc = new jsPDF("portrait", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // =========================
    // TITLE
    // =========================
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);

    doc.text("Purchase Trip Detail Report", pageWidth / 2, 15, {
      align: "center",
    });

    // =========================
    // LINE UNDER TITLE
    // =========================
    doc.setDrawColor(31, 41, 55);
    doc.setLineWidth(0.5);

    doc.line(15, 20, pageWidth - 15, 20);

    // =========================
    // DATE RANGE
    // =========================
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Date From: ${DateFrom}`, 15, 28);

    doc.text(`Date To: ${DateTo}`, pageWidth - 15, 28, {
      align: "right",
    });

    let startY = 35;

    // =========================
    // TABLE HEADERS
    // =========================
    const tableHead = [
      [
        "Vehicle",
        "Supplier",
        "Phone No",
        "Rate/KG",
        "Purchase KG",
        "Amount Paid",
        "Total Bill",
      ],
    ];

    // =========================
    // TABLE BODY
    // =========================
    const tableBody: any[] = [];

    getTripData.forEach((trip) => {
      // =========================
      // TRIP DATE ROW
      // =========================
      tableBody.push([
        {
          content: `Trip Date: ${formatDate(trip.tripDate)}`,
          colSpan: 7,
          styles: {
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
            fillColor: [219, 234, 254],
            textColor: [31, 41, 55],
          },
        },
      ]);

      let tripQty = 0;
      let tripAmount = 0;
      let totalBill2 = 0;

      // =========================
      // SUPPLIER ROWS
      // =========================
      trip.supplierList?.forEach((supplier) => {
        tripQty += supplier.qty;
        tripAmount += supplier.amountPaid;
        totalBill2 += supplier.qty * supplier.rate;
        tableBody.push([
          supplier.vehicleNo || "-",
          supplier.supplierName || "-",
          supplier.phoneNo || "-",
          formatNumber(supplier.rate),
          formatNumber(supplier.qty),
          formatNumber(supplier.amountPaid),
          formatNumber(supplier.qty * supplier.rate),
        ]);
      });

      // =========================
      // TRIP TOTAL
      // =========================
      tableBody.push([
        {
          content: "Trip Total",
          colSpan: 4,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [243, 244, 246],
          },
        },
        {
          content: formatNumber(tripQty),
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [243, 244, 246],
          },
        },
        {
          content: formatNumber(tripAmount),
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [243, 244, 246],
          },
        },
        {
          content: formatNumber(totalBill2),
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [243, 244, 246],
          },
        },
      ]);
    });

    // =========================
    // PDF TABLE
    // =========================
    autoTable(doc, {
      startY,
      head: tableHead,
      body: tableBody,

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        halign: "center",
        valign: "middle",
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
        textColor: [31, 41, 55],
      },

      headStyles: {
        fillColor: [229, 231, 235],
        textColor: [31, 41, 55],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        fontSize: 8,
      },

      columnStyles: {
        0: {
          cellWidth: 25,
          halign: "center",
        },
        1: {
          cellWidth: 32,
          halign: "center",
        },
        2: {
          cellWidth: 27,
          halign: "center",
        },
        3: {
          cellWidth: 25,
          halign: "center",
        },
        4: {
          cellWidth: 28,
          halign: "center",
        },
        5: {
          cellWidth: 27,
          halign: "center",
        },
        6: {
          cellWidth: 27,
          halign: "center",
        },
      },

      margin: {
        left: 15,
        right: 15,
      },

      didDrawPage: () => {
        // =========================
        // FOOTER
        // =========================
        const pageNumber = doc.getNumberOfPages();

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);

        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 8, {
          align: "center",
        });
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.save(`PurchaseTripReport_${DateFrom}_to_${DateTo}.pdf`);
  };

  const header = [
    "Vehicle (گاڑی)",
    "Supplier (سپلائر)",
    "Phone No (فون نمبر)",
    "Rate/KG (قیمت/کلوگرام)",
    "Purchase KG (خرید کلوگرام)",
    "Amount Paid (ادا کردہ رقم)",
    "Total Bill (کل بل)",
  ];

  const GetPurchaseTripReport = async () => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("adminToken");

      const response = await GetPurchaseTripReportApi(
        DateFrom,
        DateTo,
        String(token),
      );

      if (response.status === 200) {
        const data = response.data as PurcahseTripReportReposne;
        setgetTripData(data.dataList || []);
      } else {
        setgetTripData([]);
      }
    } catch (error) {
      console.error("Error fetching purchase trip report:", error);
      setgetTripData([]);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();

    lastYear.setFullYear(date.getFullYear() - 1);

    setDateFrom(lastYear.toISOString().split("T")[0]);
    setDateTo(date.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!DateFrom || !DateTo) return;

    GetPurchaseTripReport();
  }, [DateFrom, DateTo]);

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
  };

  const formatNumber = (value: number | string) => {
    const number = Number(value || 0);

    return number.toLocaleString();
  };

  return (
    <div className="mt-2 w-full">
      {/* ================= FILTERS ================= */}
      <div className="flex w-full gap-4 mb-4">
        <div className="w-64">
          <InputFieldGeneric
            label="Date From (تاریخِ آغاز)"
            type="date"
            required={false}
            placeholder="Enter Date From"
            SateChange={DateFrom}
            setSateChange={setDateFrom}
            disabled={false}
          />
        </div>

        <div className="w-64">
          <InputFieldGeneric
            label="Date To (تاریخِ اختتام)"
            type="date"
            required={false}
            placeholder="Enter Date To"
            SateChange={DateTo}
            setSateChange={setDateTo}
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
      {/* ================= TABLE ================= */}
      <div className="w-full overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-lg">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              {header.map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {/* ================= LOADING ================= */}
            {isloading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center align-middle">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : getTripData.length === 0 ? (
              /* ================= NO RECORD ================= */
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-lg font-semibold text-gray-500"
                >
                  No Record Found
                </td>
              </tr>
            ) : (
              /* ================= DATA ================= */
              getTripData.map((trip, tripIndex) => (
                <>
                  {/* Trip Date Header */}
                  <tr
                    key={`date-${tripIndex}`}
                    className="bg-blue-50 border-y border-blue-100"
                  >
                    <td
                      colSpan={7}
                      className="px-4 py-3 font-bold text-gray-700"
                    >
                      Trip Date: {formatDate(trip.tripDate)}
                    </td>
                  </tr>

                  {/* Supplier Rows */}
                  {trip.supplierList?.map((supplier, index) => {
                    const totalBill =
                      Number(supplier.qty || 0) * Number(supplier.rate || 0);

                    return (
                      <tr
                        key={`${tripIndex}-${index}`}
                        className="hover:bg-gray-50 text-center"
                      >
                        {/* Vehicle */}
                        <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">
                          {supplier.vehicleNo || "-"}
                        </td>

                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                          {supplier.supplierName || "-"}
                        </td>

                        <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">
                          {supplier.phoneNo || "-"}
                        </td>

                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                          {formatNumber(supplier.rate)}
                        </td>

                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                          {formatNumber(supplier.qty)}
                        </td>

                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                          {formatNumber(totalBill)}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold text-center text-gray-800">
                          {formatNumber(totalBill)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Trip Total */}
                  {trip.supplierList?.length > 0 && (
                    <tr className="bg-gray-100 border-t border-gray-300">
                      <td
                        colSpan={4}
                        className="px-4 py-3 text-right font-bold text-gray-700"
                      >
                        Trip Total
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-gray-700">
                        {formatNumber(
                          trip.supplierList.reduce(
                            (sum, supplier) => sum + Number(supplier.qty || 0),
                            0,
                          ),
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-gray-700">
                        {formatNumber(
                          trip.supplierList.reduce(
                            (sum, supplier) =>
                              sum +
                              Number(supplier.qty || 0) *
                                Number(supplier.rate || 0),
                            0,
                          ),
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-gray-800">
                        {formatNumber(
                          trip.supplierList.reduce(
                            (sum, supplier) =>
                              sum +
                              Number(supplier.qty || 0) *
                                Number(supplier.rate || 0),
                            0,
                          ),
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
