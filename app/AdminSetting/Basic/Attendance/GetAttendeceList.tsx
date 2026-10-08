import AttendenceGetApi from "@/app/api/Controller/Attendence/GetAttendece";
import { employeeList } from "@/app/api/Types/Codes/Employee/Employee";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useMemo, useState } from "react";

interface BankModifyProps {
  initalData: employeeList[];
  refresh: number;
}

interface GetAttendeceResposne {
  message: string;
  error: string;
  dataList: attendeceList[];
}

interface attendeceList {
  attID: string;
  empID: string;
  employeeName: string;
  postingDate: string;
  status: string;
  description: string;
  dateReport: string;
}

interface DailyAttendance {
  status: string;
  dateReport: string;
}
// Pivoted row (one per employee)
interface PivotedRow {
  empID: string;
  employeeName: string;
  dailyStatus: Record<string, DailyAttendance>; // key = yyyy-MM-dd
}

export default function AttendeceGetList({
  initalData,
  refresh,
}: BankModifyProps) {
  const [rawData, setRawData] = useState<attendeceList[]>([]);
  const [isloading, setisLoading] = useState(false);
  const [EmployeeName, setEmployeeName] = useState("");
  const [EmployeeID, setEmployeeID] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [moduleList, setModuleList] = useState<employeeList[]>([]);

  useEffect(() => {
    if (initalData) setModuleList(initalData);
  }, [initalData]);

  // ---------- API CALL ----------
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        employeeID: EmployeeID,
        dateFrom: DateFrom,
        dateTo: DateTo,
      };
      const response = await AttendenceGetApi(formData, String(token));
      if (response.status === 200) {
        const data = response.data as GetAttendeceResposne;
        setRawData(data.dataList || []);
      } else {
        setRawData([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (DateFrom || DateTo) EmployeeGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, DateFrom, DateTo]);

  // ---------- PIVOT IN MEMORY ----------
  const { dates, rows } = useMemo(() => {
    const dateList: string[] = [];

    // Create all dates between DateFrom and DateTo
    if (DateFrom && DateTo) {
      const start = new Date(`${DateFrom}T00:00:00`);
      const end = new Date(`${DateTo}T00:00:00`);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        dateList.push(`${year}-${month}-${day}`);
      }
    }

    // Create rows for ALL employees
    const grouped = new Map<string, PivotedRow>();

    moduleList.forEach((employee) => {
      const dailyStatus: Record<string, DailyAttendance> = {};

      // Initially mark every date as Absent
      dateList.forEach((date) => {
        dailyStatus[date] = {
          status: "Absent",
          dateReport: "",
        };
      });

      grouped.set(employee.empID, {
        empID: employee.empID,
        employeeName: employee.name,
        dailyStatus,
      });
    });

    // Add actual attendance
    for (const item of rawData) {
      if (!item.empID || !item.postingDate) {
        continue;
      }

      const postingDate = new Date(item.postingDate);

      const year = postingDate.getFullYear();
      const month = String(postingDate.getMonth() + 1).padStart(2, "0");
      const day = String(postingDate.getDate()).padStart(2, "0");

      const dateKey = `${year}-${month}-${day}`;

      const employee = grouped.get(item.empID);

      if (employee) {
        employee.dailyStatus[dateKey] = {
          status: item.status,
          dateReport: item.dateReport || "",
        };
      }
    }

    return {
      dates: dateList,
      rows: Array.from(grouped.values()).sort((a, b) =>
        a.employeeName.localeCompare(b.employeeName),
      ),
    };
  }, [rawData, DateFrom, DateTo, moduleList]);

  const filteredRows = useMemo(() => {
    if (!EmployeeName || EmployeeName === "All") {
      return rows;
    }

    return rows.filter((row) => row.employeeName === EmployeeName);
  }, [rows, EmployeeName]);

  // ---------- STATUS COLOR ----------
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Present":
        return "text-green-600 font-semibold";
      case "Absent":
        return "text-red-600 font-semibold";
      case "Leave":
        return "text-blue-600 font-semibold";
      case "Late":
        return "text-yellow-600 font-semibold";
      case "HalfDay":
        return "text-orange-600 font-semibold";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div>
      {/* ---------- FILTERS ---------- */}
      <div className="w-full flex flex-wrap gap-2">
        <div className="w-full md:w-1/3">
          <DropDownList
            label="Employee (ملازم)"
            required={true}
            placeholder="Enter Employee"
            filedID={setEmployeeID}
            options={[
              {
                id: "1",
                label: "All",
                value: "All",
              },
              ...moduleList.map((item) => ({
                id: item.empID,
                label: item.name,
                value: item.name,
              })),
            ]}
            value={EmployeeName}
            onChange={setEmployeeName}
          />
        </div>

        <div className="w-full md:w-1/4">
          <InputFieldGeneric
            label="Date From (تاریخِ آغاز)"
            type="date"
            required={true}
            placeholder=""
            SateChange={DateFrom}
            setSateChange={setDateFrom}
            disabled={false}
          />
        </div>

        <div className="w-full md:w-1/4">
          <InputFieldGeneric
            label="Date To (تاریخِ اختتام)"
            type="date"
            required={true}
            placeholder=""
            SateChange={DateTo}
            setSateChange={setDateTo}
            disabled={false}
          />
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full bg-white border-collapse border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr className="sticky top-0 bg-white z-10">
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase border-b border-gray-300 sticky left-0 bg-gray-100">
                Employee
              </th>
              {dates.map((date) => (
                <th
                  key={date}
                  className="px-4 py-3 text-center text-sm font-semibold border-b border-gray-300 whitespace-nowrap"
                >
                  {date}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {isloading ? (
              <tr>
                <td colSpan={dates.length + 1} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={dates.length + 1} className="py-10 text-center">
                  <span className="text-lg font-semibold text-gray-500">
                    No Record Found
                  </span>
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.empID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap sticky left-0 bg-white">
                    {row.employeeName}
                  </td>
                  {dates.map((date) => {
                    const attendance = row.dailyStatus[date];

                    return (
                      <td
                        key={date}
                        className="px-4 py-3 text-center whitespace-nowrap"
                      >
                        {attendance?.status === "Present" ? (
                          <div className="flex flex-col items-center">
                            <span className="text-green-600 font-semibold">
                              Present
                            </span>

                            {attendance.dateReport && (
                              <span className="text-xs text-gray-500 mt-1">
                                Check In:{" "}
                                {new Date(
                                  attendance.dateReport.split("~")[0],
                                ).toLocaleTimeString()}{" "}
                                <br />
                                Check Out:{" "}
                                {new Date(
                                  attendance.dateReport.split("~")[1],
                                ).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span
                            className={getStatusClass(
                              attendance?.status || "Absent",
                            )}
                          >
                            {attendance?.status || "Absent"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
