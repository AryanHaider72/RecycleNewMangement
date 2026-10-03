"use client";
import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import LabourGetApi from "@/app/api/Controller/Codes/Labour/GetLabout";
import AddLabourApi from "@/app/api/Controller/Module1/Labour/AddLabour";
import GetLabourApi from "@/app/api/Controller/Module1/Labour/GetLabourSalary";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import {
  labourList,
  responseLabourListGet,
} from "@/app/api/Types/Codes/Labour/labour";
import {
  AddRequestSalryLabour,
  responseGetSalaryLabour,
} from "@/app/api/Types/module1/LaboutSalary";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import Heading from "@/app/ui/Heading/Heading";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useEffect, useState } from "react";
interface LabourCashDetail {
  empID: string;
  listLabour: listLabour[];
}
interface listLabour {
  labourID: string;
  labourName: string;
  rate: string;
  rateKG: string;
}
export default function BankManagement() {
  const [ShowForm, setShowForm] = useState(false);

  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const [refresh, setRefresh] = useState(0);
  const [getLabourTitleData, setgetLabourTitleData] = useState<labourList[]>(
    [],
  );
  const [getEmplyeeData, setgetEmplyeeData] = useState<employeeList[]>([]);
  const [LabourData, setLabourData] = useState<LabourCashDetail[]>([]);
  const [PostingDate, setPostingDate] = useState("");

  const LabourGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await LabourGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseLabourListGet;
      setgetLabourTitleData(data.dataList);
      return data.dataList;
    } else {
      setgetLabourTitleData([]);
    }
  };
  const EmployeeGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetEmployeeApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseEmployeeListGet;
      setgetEmplyeeData(data.dataList);
      return data.dataList;
    } else {
      setgetEmplyeeData([]);
    }
  };
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;

    // ========== HEADER ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text("Labour Rate/Kg Report", pageWidth / 2, 16, { align: "center" });

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.4);
    doc.line(margin, 21, pageWidth - margin, 21);

    // ========== DATE ==========
    const infoY = 29;
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "bold");
    doc.text("Posting Date:", margin, infoY);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(PostingDate).toDateString(), margin + 21, infoY);

    // ========== HEADER + BODY ==========
    const labourTypes = getLabourTitleData.map(
      (l) => l.labourType + " - PKR:" + l.rateKG + "/Kg",
    );

    const filteredEmployees = getEmplyeeData.filter(
      (item) =>
        item.dept === "M1 - Recycling" &&
        item.wagesType === "By Weight (کلو)" &&
        item.status === "Active",
    );

    const body = filteredEmployees.map((emp, index) => {
      const empLabour = LabourData.find((x) => x.empID === emp.empID);

      const labourCells = getLabourTitleData.map((lt) => {
        const entry = empLabour?.listLabour.find(
          (l) => l.labourID === lt.labourID,
        );
        if (!entry || !entry.rate || Number(entry.rate) === 0) return "0";
        const amount = Number(entry.rate);
        return amount.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      });

      const rowTotal = empLabour
        ? empLabour.listLabour.reduce(
            (sum, l) => sum + Number(l.rate) * Number(l.rateKG),
            0,
          )
        : 0;

      return [
        index + 1,
        emp.name || "",
        ...labourCells,
        rowTotal.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
      ];
    });

    // ========== TOTALS ==========
    const labourTotals = getLabourTitleData.map((lt) =>
      LabourData.reduce((sum, emp) => {
        const entry = emp.listLabour.find((l) => l.labourID === lt.labourID);
        if (!entry) return sum;
        return sum + Number(entry.rate || 0) * Number(entry.rateKG || 0);
      }, 0),
    );

    const grandTotal = labourTotals.reduce((a, b) => a + b, 0);

    const footRow = [
      "",
      "TOTAL",
      ...labourTotals.map((v) =>
        v.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
      ),
      grandTotal.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    ];

    // ========== TABLE ==========
    autoTable(doc, {
      startY: 36,

      head: [["#", "Employee Name", ...labourTypes, "Total"]],

      body,

      foot: [footRow],

      theme: "grid",

      margin: {
        left: margin,
        right: margin,
        top: 5,
        bottom: 20,
      },

      styles: {
        font: "helvetica",
        fontSize: 8,
        textColor: [55, 65, 81],
        cellPadding: 2,
        lineColor: [220, 220, 220],
        lineWidth: 0.2,
        valign: "middle",
        overflow: "linebreak",
        halign: "center", // 👈 default: center everything
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

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      didDrawPage: (data) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("Labour Rate/Kg Report", margin, pageHeight - 8);
        doc.text(
          `Page ${data.pageNumber}`,
          pageWidth - margin,
          pageHeight - 8,
          { align: "right" },
        );
      },
    });

    doc.save("LabourKgRateReport.pdf");
  };
  // useEffect(() => {
  //   const initialData = getEmplyeeData.map((emp) => ({
  //     empID: emp.empID,
  //     listLabour: getLabourTitleData.map((item) => ({
  //       labourID: item.labourID,
  //       rate: "",
  //       rateKG: String(item.rateKG),
  //     })),
  //   }));
  //   setLabourData(initialData);
  // }, []);

  const handleInputChange = (
    empID: string,
    labourID: string,
    value: string,
    rateKg: string,
  ) => {
    setLabourData((prevData) =>
      prevData.map((emp) =>
        emp.empID === empID
          ? {
              ...emp,
              listLabour: emp.listLabour.map((labour) =>
                labour.labourID === labourID
                  ? { ...labour, rate: value, rateKg: rateKg }
                  : labour,
              ),
            }
          : emp,
      ),
    );
  };
  const getLabourValue = (empID: string, labourID: string) => {
    const emp = LabourData.find((e) => e.empID === empID);
    const labour = emp?.listLabour.find((l) => l.labourID === labourID);
    return labour?.rate;
  };
  const calculateEmployeeTotal = (empID: string) => {
    const emp = LabourData.find((e) => e.empID === empID);
    return (
      emp?.listLabour.reduce(
        (sum, labour) => sum + Number(labour.rate) * Number(labour.rateKG),
        0,
      ) || 0
    );
  };

  const functionCalling = async () => {
    const labour = await LabourGet();
    const emlpoyee = await EmployeeGet();
    GetRecord(PostingDate, labour || [], emlpoyee || []);
  };
  useEffect(() => {
    functionCalling();
  }, [PostingDate]);

  const data = LabourData.reduce((total, item) => {
    const employeeTotal = item.listLabour.reduce((sum, labour) => {
      return sum + Number(labour.rate) * Number(labour.rateKG);
    }, 0);
    return total + employeeTotal;
  }, 0);

  const AddRecord = async () => {
    try {
      setLoading(true);
      if (!PostingDate) return alert("Please Fill in Filed with *");
      else {
        const formData: AddRequestSalryLabour = {
          postingDate: PostingDate,
          labourList: LabourData.flatMap((employee) =>
            employee.listLabour
              .filter((item) => Number(item.rate) > 0)
              .map((labour) => ({
                empID: employee.empID,

                labourID: labour.labourID,
                qty: Number(labour.rate),
                amount: Number(labour.rate) * Number(labour.rateKG),
                remarks: `For ${labour.labourName} * ${labour.rate} KG`,
              })),
          ),
        };
        //console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await AddLabourApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);

          //resetFunction();
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
          // setMessageType("error");
          // setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const GetRecord = async (
    date: string,
    labour: labourList[],
    employee: employeeList[],
  ) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetLabourApi(date, String(token));

    // First create complete empty structure
    const initialData = employee.map((emp) => ({
      empID: emp.empID,
      listLabour: labour.map((item) => ({
        labourID: item.labourID,
        rate: "",
        rateKG: String(item.rateKG),
        labourName: item.labourType,
      })),
    }));

    if (response.status === 200) {
      const data = response.data as responseGetSalaryLabour;

      const mergedData = initialData.map((employeeItem) => {
        const apiEmployee = data.dataList.find(
          (x) => x.empID === employeeItem.empID,
        );

        return {
          empID: employeeItem.empID,

          listLabour: employeeItem.listLabour.map((labourItem) => {
            const apiLabour = apiEmployee?.labourList.find(
              (x) => x.labourID === labourItem.labourID,
            );

            return {
              labourID: labourItem.labourID,
              rate: apiLabour ? String(apiLabour.qty) : "",
              rateKG: apiLabour ? String(apiLabour.rateKG) : labourItem.rateKG,
              labourName: labourItem.labourName,
            };
          }),
        };
      });

      setLabourData(mergedData);
    } else {
      setLabourData(initialData);
    }
  };
  // useEffect(() => {
  //   console.log(LabourData);
  // }, [LabourData]);

  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}

      <div className="">
        <Heading
          heading="Labour KG Work Entry"
          subHeading="( مزدوری کلوگرام کے کام کا اندراج )"
          onClick={() => {}}
          disable={true}
        />
        <div className="w-full flex justify-end mt-2">
          <button
            title="Export Report"
            onClick={() => exportPDF()}
            className="px-3 py-1 border rounded hover:border-green-400 hover:text-green-500 hover:cursor-pointer"
          >
            Export
          </button>
        </div>
        <div className="w-full flex justify-center mt-2">
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg p-6 w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-200">
            <div className="w-full flex gap-2">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <InputFieldGeneric
                    label="Session Date (تاریخ)"
                    type="date"
                    required={false}
                    placeholder="Search by Name/Title/Number..."
                    SateChange={PostingDate}
                    setSateChange={setPostingDate}
                    disabled={false}
                  />
                </div>
                <div className="flex w-full mt-10">
                  <p>Grand Total(کل):</p>
                  <span className="font-bold">PKR:{data}</span>
                </div>
              </div>
            </div>
            <div className=" h-[60vh]  overflow-y-scroll border border-gray-100 shadow-md mb-2">
              <table className="w-full  bg-white border-collapse border border-gray-300  rounded-lg  mt-2">
                <thead className="bg-gray-100">
                  <tr className="sticky top-0 bg-white z-10 ">
                    <th className=" px-4 py-3 text-center text-sm font-semibold uppercase border-b border-gray-300">
                      Employee
                    </th>
                    {getLabourTitleData.map((heading) => (
                      <th
                        key={heading.labourID}
                        className=" px-4 py-3 text-center text-sm font-semibold uppercase border-b border-gray-300"
                      >
                        <div className="flex flex-col gap-1">
                          {heading.labourType}{" "}
                          <span className="font-normal">
                            PKR: {heading.rateKG}/KG
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className=" px-4 py-3 text-center text-sm font-semibold uppercase border-b border-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getEmplyeeData
                    .filter(
                      (item) =>
                        item.dept === "M1 - Recycling" &&
                        item.wagesType === "By Weight (کلو)" &&
                        item.status === "Active",
                    )
                    .map((emp) => (
                      <tr key={emp.empID} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{emp.name}</td>
                        {getLabourTitleData.map((item) => (
                          <td key={item.labourID} className="px-4 py-3">
                            <input
                              type="text"
                              value={getLabourValue(emp.empID, item.labourID)}
                              onChange={(e) =>
                                handleInputChange(
                                  emp.empID,
                                  item.labourID,
                                  e.target.value,
                                  String(item.rateKG),
                                )
                              }
                              placeholder="Cost (مزدوری )"
                              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          {calculateEmployeeTotal(emp.empID)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <ActionButton
                text={"Add Records (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={"Adding Records..."}
                onClick={() => AddRecord()}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
