import { purchaseTripList } from "@/app/api/Types/module1/purchaseTrip";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import StatsCard from "@/app/ui/StatCard/StatCard";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
interface BankModifyProps {
  initalData: (data: purchaseTripList) => void;
  setIsLoading: boolean;
  DateFrom: string;
  DateTo: string;
  getEmplyeeDataList: purchaseTripList[];
  showDetail: (data: boolean) => void;
}
export default function PurchaseTripDetail({
  initalData,
  setIsLoading,
  DateFrom,
  DateTo,
  getEmplyeeDataList,
  showDetail,
}: BankModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getEmplyeeData, setgetEmplyeeData] = useState<purchaseTripList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (getEmplyeeDataList || setIsLoading)
      setgetEmplyeeData(getEmplyeeDataList);
    setisLoading(setIsLoading);
  }, [getEmplyeeDataList, setIsLoading]);

  const header = [
    "Date (تاریخ)",
    "Driver  (ڈرائیور)",
    "Vehicle  (گاڑی)",
    "Advance (پیشگی)",
    "Truck Empty Wt (ٹرک خالی وزن)",
    "Truck Loaded Wt  (ٹرک لوڈ وزن)",
    "Average Rate (اوسط شرح)",
    "Difference  (فرق)",
    "Status  (حالت)",
    "ACTION",
  ];

  const assignData = (ID: string) => {
    const data = getEmplyeeData.find((item) => item.tripID === ID);
    if (data) {
      initalData(data);
      showDetail(true);
    }
  };

  const filterData = getEmplyeeData.filter((emp) => {
    return emp?.vehicleNo.toLowerCase().includes(SearchEmployee.toLowerCase());
  });

  const exportPDF = () => {
    // ========== INITIALIZE PDF ==========
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const scrapPurchase = getEmplyeeData.reduce((sum, item) => {
      return sum + (item.weightLoadedKG - item.weightEmptyKG);
    }, 0);

    const totalPurchaseCost = getEmplyeeData.reduce((sum, item) => {
      const netWeight = item.weightLoadedKG - item.weightEmptyKG;
      return sum + item.averageRate * netWeight;
    }, 0);

    const AverageRate =
      scrapPurchase > 0 ? totalPurchaseCost / scrapPurchase : 0;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;

    // ========== HEADER ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);

    doc.text("Purchase Trip Report", pageWidth / 2, 16, {
      align: "center",
    });

    // Header line
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.4);
    doc.line(margin, 21, pageWidth - margin, 21);

    // ========== DATE INFORMATION ==========
    // Keep both dates closer together
    const infoY = 29;

    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);

    // Date From
    doc.setFont("helvetica", "bold");
    doc.text("Date From:", margin, infoY);

    doc.setFont("helvetica", "normal");
    doc.text(new Date(DateFrom).toDateString(), margin + 21, infoY);

    // Date To
    // Position it closer to Date From
    const dateToX = 135;

    doc.setFont("helvetica", "bold");
    doc.text("Date To:", dateToX, infoY);

    doc.setFont("helvetica", "normal");
    doc.text(new Date(DateFrom).toDateString(), dateToX + 17, infoY);

    // ========== TABLE DATA ==========
    const scrapRows = getEmplyeeData.map((item, index) => [
      index + 1,
      item.postingDate ? new Date(item.postingDate).toLocaleDateString() : "",
      item.vehicleNo || "",
      Number(item.advanceAmount || 0).toLocaleString(),
      Number(item.averageRate || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      (
        (Number(item.weightLoadedKG) || 0) - (Number(item.weightEmptyKG) || 0)
      ).toLocaleString(),
    ]);

    // ========== TOTALS ==========
    const totalAdvanceAmount = getEmplyeeData.reduce(
      (sum, item) => sum + (Number(item.advanceAmount) || 0),
      0,
    );

    const totalDifference = getEmplyeeData.reduce(
      (sum, item) =>
        sum +
        ((Number(item.weightLoadedKG) || 0) -
          (Number(item.weightEmptyKG) || 0)),
      0,
    );

    // ========== TABLE ==========
    autoTable(doc, {
      startY: 36,

      head: [
        [
          "#",
          "Trip Date",
          "Vehicle No",
          "Advance Amount",
          "AVG Rate",
          "Difference",
        ],
      ],

      body: scrapRows,

      // Total row
      foot: [
        [
          "",
          "",
          "TOTAL",
          totalAdvanceAmount.toLocaleString(),
          "",
          totalDifference.toLocaleString(),
        ],
      ],

      theme: "grid",

      margin: {
        left: margin,
        right: margin,
        top: 5,
        bottom: 20,
      },

      styles: {
        font: "helvetica",
        fontSize: 8.5,
        textColor: [55, 65, 81],
        cellPadding: 2.5,
        lineColor: [220, 220, 220],
        lineWidth: 0.2,
        valign: "middle",
      },

      headStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        cellPadding: 3,
      },

      footStyles: {
        fillColor: [229, 231, 235],
        textColor: [31, 41, 55],
        fontStyle: "bold",
        halign: "right",
        cellPadding: 3,
      },

      columnStyles: {
        // #
        0: {
          cellWidth: 10,
          halign: "center",
        },

        // Trip Date
        1: {
          cellWidth: 32,
          halign: "center",
        },

        // Vehicle No
        2: {
          cellWidth: 34,
          halign: "center",
        },

        // Advance Amount
        3: {
          cellWidth: 42,
          halign: "right",
        },

        // AVG Rate
        4: {
          cellWidth: 30,
          halign: "right",
        },

        // Difference
        5: {
          cellWidth: 38,
          halign: "right",
        },
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      didDrawPage: (data) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);

        doc.text("Purchase Trip Report", margin, pageHeight - 8);

        doc.text(
          `Page ${data.pageNumber}`,
          pageWidth - margin,
          pageHeight - 8,
          {
            align: "right",
          },
        );
      },
    });

    // ========== SAVE PDF ==========
    doc.save("PurchaseTripReport.pdf");
  };
  const exportPDFTrip = (ID: string) => {
    // Find trip data by ID
    const data = getEmplyeeData.find((item) => item.tripID === ID);
    if (!data) return;

    // ========== CALCULATE AGGREGATES ==========
    const totalQty = data.scrapPurchase
      .filter((item2) => item2.purchaseKg > 0 && item2.phoneNo !== "")
      .reduce((sum, item) => sum + item.purchaseKg, 0);

    const totalAmountPaid = data.scrapPurchase
      .filter((item2) => item2.purchaseKg > 0)
      .reduce((sum, item) => sum + item.amountPaid, 0);
    const scrapPurchase = getEmplyeeData
      .filter((item) => item.tripID === ID)
      .reduce((sum, item) => {
        return sum + (item.weightLoadedKG - item.weightEmptyKG);
      }, 0);

    const totalPurchaseCost = getEmplyeeData
      .filter((item) => item.tripID === ID)
      .reduce((sum, item) => {
        const netWeight = item.weightLoadedKG - item.weightEmptyKG;
        return sum + item.averageRate * netWeight;
      }, 0);

    const avgRate = scrapPurchase > 0 ? totalPurchaseCost / scrapPurchase : 0;

    const difference = data.weightLoadedKG - data.weightEmptyKG - totalQty;

    // ========== INITIALIZE PDF ==========
    const doc = new jsPDF();

    // ========== HEADER ==========
    doc.setFontSize(16);
    doc.text("Purchase Trip Report", 105, 20, { align: "center" });
    doc.line(10, 25, 200, 25);

    doc.setFontSize(10);
    doc.text(
      `Trip Date: ${new Date(data.postingDate).toLocaleDateString()}`,
      10,
      30,
    );
    doc.text(`Vehicle No: ${data.vehicleNo}`, 200, 30, { align: "right" });
    doc.text(`Driver Name: ${data.empName}`, 200, 36, { align: "right" });

    // ========== SUMMARY BOX ==========
    const boxX = 10;
    const boxY = 40;
    const boxWidth = 190;
    const boxHeight = 25;

    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3);
    doc.setFontSize(10);

    // Left column
    doc.text(`Advance Cash: ${data.advanceAmount || 0}`, 15, boxY + 10);
    doc.text(
      `Company Loaded Weight: ${data.weightLoadedKG || 0} KG`,
      15,
      boxY + 20,
    );

    // Right column
    doc.text(`Empty Weight: ${data.weightEmptyKG || 0} KG`, 90, boxY + 10);
    doc.text(`Difference: ${difference} KG`, 90, boxY + 20);

    doc.text(
      `Factory Weight: ${data.weightLoadedKG - data.weightEmptyKG || 0} `,
      110 + 40,
      boxY + 10,
    );
    doc.text(`Average Rate: ${avgRate.toFixed(3) || 0} `, 110 + 40, boxY + 20);
    if (data.scrapPurchase.length > 0) {
      // ========== TABLE 1: SCRAP PURCHASE ==========
      const scrapRows = data.scrapPurchase.map((item, index) => [
        index + 1,
        item.supplierName || "",
        item.phoneNo,
        item.purchaseKg.toLocaleString(),
        item.purchasedRate.toLocaleString(),
        item.amountPaid.toLocaleString(),
      ]);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Scrap Purchase", 15, boxY - 5 + boxHeight + 12);

      autoTable(doc, {
        startY: boxY - 8 + boxHeight + 17,
        head: [["#", "Supplier", "Phone No", "Qty", "Rate/KG", "Amount Paid"]],
        body: scrapRows,
        foot: [
          [
            "",
            "Total",
            "",
            totalQty.toLocaleString(),
            "",
            totalAmountPaid.toLocaleString(),
          ],
        ],
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [55, 65, 81],
          fontStyle: "bold",
        },
      });
    }
    const firstTableEndY = (doc as any).lastAutoTable.finalY;
    if (data.tripExpense.length > 0) {
      // ========== TABLE 2: TRIP EXPENSES ==========
      const expenseRows = data.tripExpense.map((item, index) => [
        index + 1,
        item.expenseName || "",
        item.paymentMode,
        "N/A",
        item.paidBy,
        item.amount,
      ]);

      const totalTripExpense = data.tripExpense.reduce(
        (sum, item) => sum + item.amount,
        0,
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Trip Expense Detail", 15, firstTableEndY + 10);

      autoTable(doc, {
        startY: firstTableEndY + 12,
        head: [
          [
            "#",
            "Expense Name",
            "Payment Method",
            "Bank",
            "Expense On",
            "Amount",
          ],
        ],
        body: expenseRows,
        foot: [["", "", "Total", "", "", totalTripExpense.toLocaleString()]],
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [55, 65, 81],
          fontStyle: "bold",
        },
      });
    }
    const secondTableEndY = (doc as any).lastAutoTable.finalY;
    if (data.fuelExpense.length > 0) {
      // ========== TABLE 3: FUEL EXPENSES ==========
      const fuelRows = data.fuelExpense.map((item, index) => [
        index + 1,
        item.liter || "",
        item.rate,
        item.paymentMode,
      ]);

      const totalRate = data.fuelExpense.reduce(
        (sum, item) => sum + Number(item.rate),
        0,
      );
      const totalLiter = data.fuelExpense.reduce(
        (sum, item) => sum + Number(item.liter),
        0,
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Fuel Expense", 15, secondTableEndY + 10);

      autoTable(doc, {
        startY: secondTableEndY + 12,
        head: [["#", "Liter", "Rate/ltr", "Payment Method"]],
        body: fuelRows,
        foot: [
          [
            "Total",
            totalLiter.toLocaleString(),
            totalRate.toLocaleString(),
            "",
            "",
          ],
        ],
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [55, 65, 81],
          fontStyle: "bold",
        },
      });
    }
    const thirdTableEndY = (doc as any).lastAutoTable.finalY;
    // ========== TABLE 4: Labour EXPENSES ==========
    if (data.labourList.length > 0) {
      const labour = data.labourList.map((item, index) => [
        index + 1,
        item.labourName || "",
        item.labourPaid,
        item.labourDue,
      ]);

      const totalLabour = data.labourList.reduce(
        (sum, item) => sum + Number(item.labourPaid),
        0,
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Labour ", 15, thirdTableEndY + 10);

      autoTable(doc, {
        startY: thirdTableEndY + 12,
        head: [["#", "Labour Name", "labour Paid", "labour Due"]],
        body: labour,
        foot: [["Total", "", totalLabour.toLocaleString()]],
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [55, 65, 81],
          fontStyle: "bold",
        },
      });
    }
    const FourthTableEndY = (doc as any).lastAutoTable.finalY;
    // ========== TABLE 5: Supplier Payments ==========
    if (data.supplierPayments.length > 0) {
      const labour = data.supplierPayments.map((item, index) => [
        index + 1,
        item.supplierName || "",
        item.amountCredit.toLocaleString(),
        item.amountDebit.toLocaleString(),
        item.remarks,
      ]);

      const totalSupplier = data.supplierPayments.reduce(
        (sum, item) => sum + Number(item.amountCredit),
        0,
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Supplier Payments ", 15, FourthTableEndY + 10);

      autoTable(doc, {
        startY: FourthTableEndY + 12,
        head: [["#", "Supplier Name", "Cash Paid", "Cash Received", "Remarks"]],
        body: labour,
        foot: [["Total", "", totalSupplier.toLocaleString()]],
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [55, 65, 81],
          fontStyle: "bold",
        },
      });
    }
    const FifthTableEndY = (doc as any).lastAutoTable.finalY;
    if (data.customerRecovery.length > 0) {
      const labour = data.customerRecovery.map((item, index) => [
        index + 1,
        item.customerName || "",
        item.amount.toLocaleString(),
        item.remarks,
      ]);

      const totalCustomer = data.customerRecovery.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Recoveries ", 15, FifthTableEndY + 10);

      autoTable(doc, {
        startY: FifthTableEndY + 12,
        head: [["#", "Customer Name", "Rate", "Remarks"]],
        body: labour,
        foot: [["Total", "", totalCustomer.toLocaleString()]],
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: [55, 65, 81],
          fontStyle: "bold",
        },
      });
    }
    const SixthTableEndY = (doc as any).lastAutoTable.finalY;

    // ========== CASH REMAINING CALCULATION ==========
    const totalPurchase = data.scrapPurchase
      .filter((item2) => item2.purchaseKg > 0)
      .reduce((sum, item) => sum + item.amountPaid, 0);
    const labourRate = data.labourList.reduce(
      (sum, item) => sum + Number(item.labourPaid),
      0,
    );

    const totalFuelCost = data.fuelExpense
      .filter((item) => item.paymentMode === "Cash")
      .reduce((sum, item) => sum + Number(item.liter) * Number(item.rate), 0);

    const totalCashExpense = data.tripExpense
      .filter((item) => item.paymentMode === "Cash")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalSupplierPayments = data.supplierPayments.reduce(
      (sum, item) => sum + Number(item.amountCredit) - Number(item.amountDebit),
      0,
    );
    const totalCustomerRecovry = data.customerRecovery.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    const totalCashUsed =
      totalPurchase +
      totalFuelCost +
      totalCashExpense +
      labourRate +
      totalSupplierPayments;
    const cashRemaining =
      data.advanceAmount + totalCustomerRecovry - totalCashUsed;

    // ========== FOOTER ==========
    doc.text(
      `Cash Remaining: ${cashRemaining.toLocaleString()}`,
      155,
      SixthTableEndY + 10,
    );

    // ========== SAVE PDF ==========
    doc.save("PurchaseTripReport.pdf");
  };
  const scrapPurchase = getEmplyeeData.reduce((sum, item) => {
    return sum + (item.weightLoadedKG - item.weightEmptyKG);
  }, 0);

  const totalPurchaseCost = getEmplyeeData.reduce((sum, item) => {
    const netWeight = item.weightLoadedKG - item.weightEmptyKG;
    return sum + item.averageRate * netWeight;
  }, 0);

  const AverageRate = scrapPurchase > 0 ? totalPurchaseCost / scrapPurchase : 0;

  return (
    <>
      <div>
        <div className="w-1/2 flex gap-2">
          <div>
            <InputFieldGeneric
              label=""
              type="text"
              required={false}
              placeholder="Search by Vehicle No..."
              SateChange={SearchEmployee}
              setSateChange={setSearchEmployee}
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
        {getEmplyeeData.length > 0 && (
          <div className="flex gap-2 mt-4 mb-4">
            <StatsCard
              title="Total Scrap Purchase"
              value={String(scrapPurchase) || "0"}
              urduTitle="کل سکریپ کی خریداری"
              icon=""
            />
            <StatsCard
              title="Average Rate"
              value={String(AverageRate.toFixed(2)) || "0"}
              urduTitle="اوسط شرح"
              icon=""
            />
          </div>
        )}
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
                {filterData.length === 0 ? (
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
                  filterData.map((employee, index) => (
                    <tr key={employee.tripID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {
                          new Date(employee.postingDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-3">{employee.empName}</td>
                      <td className="px-4 py-3">{employee.vehicleNo}</td>
                      <td className="px-4 py-3">
                        {employee.advanceAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.weightEmptyKG.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.weightLoadedKG.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.averageRate.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {(
                          employee.weightLoadedKG - employee.weightEmptyKG
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">{employee.paymentMode}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => assignData(employee.tripID)}
                          title="تفصیل"
                          className="px-3 py-1 border rounded cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => exportPDFTrip(employee.tripID)}
                          title="تفصیل"
                          className="px-3 py-1 border rounded cursor-pointer"
                        >
                          Export
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
