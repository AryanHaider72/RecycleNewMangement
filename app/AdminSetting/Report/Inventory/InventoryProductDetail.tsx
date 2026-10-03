import InventoryBetweenDatesReportApiGet from "@/app/api/Controller/Report/SecondINventoryReroport";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";

interface responseInventoryGet {
  message: string;
  error: string;
  dataList: productList[];
}
interface productList {
  productID: string;
  productName: string;
  avaliableQty: number;
  soldQty: number;
  purchaseQty: number;
}
export default function InventorySecondReportDetail() {
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [isloading, setisLoading] = useState(false);
  const [InventoryList, setInventoryList] = useState<productList[]>([]);
  const header = [
    "#",
    "Product Name ( پروڈکٹ کا نام )",
    "Purchase Qty  (خرید کی مقدار)",
    "Sold Qty (فروخت شدہ مقدار)",
    "Available Qty (دستیاب مقدار)",
  ];

  const ExpenseGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await InventoryBetweenDatesReportApiGet(
        DateFrom,
        DateTo,
        String(token),
      );
      if (response.status == 200) {
        const data = response.data as responseInventoryGet;
        setInventoryList(data.dataList);
      } else {
        setInventoryList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (!DateFrom || !DateTo) return;
    ExpenseGet();
  }, [DateFrom, DateTo]);
  useEffect(() => {
    const date = new Date();
    const lastYear = new Date();

    lastYear.setFullYear(date.getFullYear() - 1);

    setDateFrom(lastYear.toISOString().split("T")[0]);
    setDateTo(date.toISOString().split("T")[0]);
  }, []);
  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    // ========== HEADER ==========
    doc.setFontSize(16);
    doc.text("Inventory Report", pageWidth / 2, 20, { align: "center" });
    doc.line(10, 25, 200, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Date From: ${DateFrom}`, 15, 30);

    doc.text(`Date To: ${DateTo}`, pageWidth - 15, 30, {
      align: "right",
    });

    let startY = 35;
    const scrapRows = InventoryList.map((item, index) => [
      index + 1,
      item.productName,
      item.purchaseQty.toLocaleString(),
      item.soldQty.toLocaleString(),
      item.avaliableQty.toLocaleString(),
    ]);
    autoTable(doc, {
      startY: startY,
      head: [
        ["#", "Product Name", "Purchase Qty", "Sold Qty", "Available Qty"],
      ],
      body: scrapRows,
    });

    // ========== SAVE PDF ==========
    doc.save("InventoryReport.pdf");
  };
  return (
    <>
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
      <div className="mt-2">
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
                {InventoryList.length === 0 ? (
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
                  InventoryList.map((employee, index) => (
                    <tr key={employee.productID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.productName}</td>
                      <td className="px-4 py-3">{employee.purchaseQty}</td>
                      <td className="px-4 py-3">{employee.soldQty}</td>
                      <td className="px-4 py-3">{employee.avaliableQty}</td>
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
