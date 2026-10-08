"use client";
import AttendenceAddApi from "@/app/api/Controller/Attendence/AddAttendence";
import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDown/DropDown";
import Heading from "@/app/ui/Heading/Heading";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useRef, useState } from "react";
import AttendeceGetList from "./GetAttendeceList";

export default function AttendenceManagement() {
  const hasFetchedEmployees = useRef(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [refresh, setRefresh] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [Notes, setNotes] = useState("");
  const [PostingDate, setPostingDate] = useState("");
  const [EmployeeName, setEmployeeName] = useState("");
  const [EmployeeID, setEmployeeID] = useState("");
  const [Status, setStatus] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moduleList, setModuleList] = useState<employeeList[]>([]);
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };

  const EmployeeGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetEmployeeApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseEmployeeListGet;
      setModuleList(data.dataList);
    } else {
      setModuleList([]);
    }
  };
  useEffect(() => {
    if (hasFetchedEmployees.current) return;

    hasFetchedEmployees.current = true;
    EmployeeGet();
  }, []);

  const stats = [
    { ID: "1", label: "Check In" },
    { ID: "2", label: "Check Out" }
  ];
  const resetFunction = () => {
    setPostingDate("");
    setEmployeeName("");
    setEmployeeID("");
    setUpdate(false);
    setNotes("");
    setStatus("");
  };
  const AddAttendece = async () => {
    try {
      setLoading(true);
      if (!PostingDate || !EmployeeID || !Status)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          postingDate: PostingDate,
          employeeID: EmployeeID,
          status: Status,
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        console.log(formData);
        const response = await AttendenceAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          setRefresh((prev) => prev + 1);
        } else {
          setMessageType("error");
          setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
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
      {ShowForm && (
        <PopupComponent
          onClick={eventTrigger}
          title={update ? "Edit Bank (ترمیم)" : "New Bank (نیا بینک)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}

              <div className="">
                <DropDownList
                  label="Employee (ملازم)"
                  required={true}
                  placeholder="Enter Employee"
                  filedID={setEmployeeID}
                  options={moduleList.map((item) => ({
                    id: item.empID,
                    label: item.name,
                    value: item.name,
                  }))}
                  value={EmployeeName}
                  onChange={setEmployeeName}
                />
              </div>
              <div className="">
                <InputFieldGeneric
                  label="Posting Date (تاریخ)"
                  type="datetime-local"
                  required={false}
                  placeholder="Enter Address"
                  SateChange={PostingDate}
                  setSateChange={setPostingDate}
                  disabled={false}
                />
              </div>
              <div className="">
                <DropDownList
                  label="Status ( حیثیت)"
                  required={true}
                  placeholder="Enter Status"
                  filedID={() => {}}
                  options={stats.map((item) => ({
                    id: item.ID,
                    label: item.label,
                    value: item.label,
                  }))}
                  value={Status}
                  onChange={setStatus}
                />
              </div>
              <div className="md:col-span-2">
                <TextAreaFieldGeneric
                  label="Notes"
                  required={false}
                  placeholder="Enter Notes"
                  SateChange={Notes}
                  setSateChange={setNotes}
                  disabled={false}
                />
              </div>
            </div>
            <div className="w-full">
              <ActionButton
                text={update ? "Update (اپ ڈیٹ)" : "Add Attendance (شامل کریں)"}
                update={loading}
                loading={loading}
                loadingtext={update ? "Updating..." : "Adding Attendance..."}
                onClick={() => AddAttendece()}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Attendence (حاضری)"
          subHeading="(تمام حاضریاں)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <AttendeceGetList initalData={moduleList} refresh={refresh} />
        </div>
      </div>
    </>
  );
}
