"use client";
import Heading from "@/app/ui/Heading/Heading";
import EmployeeGetList from "./EmployeeGetList";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useRef, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import EmployeeAddApi from "@/app/api/Controller/Codes/Employee/AddEmployee";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import EmployeeModifyApi from "@/app/api/Controller/Codes/Employee/ModifyEmployee";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";

export default function EmployeeManagement() {
  const hasFetchedEmployees = useRef(false);
  const [refresh, setRefresh] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const [EmployeeName, setEmployeeName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [CNIC, setCNIC] = useState("");
  const [Address, setAddress] = useState("");
  const [IsActive, setIsActive] = useState(true);
  const [Salary, setSalary] = useState("");
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
  const [WagesID, setWagesID] = useState("");
  const [Wages, setWages] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [getEmplyeeDataForList, setgetEmplyeeDataForList] = useState<
    employeeList[]
  >([]);
  const [isloading, setisLoading] = useState(false);
  const [getEmplyeeData, setgetEmplyeeData] = useState<employeeList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const moduleList = [
    { ID: "1", moduleName: "M1 - Recycling" },
    { ID: "2", moduleName: "M2 - Preform" },
    { ID: "3", moduleName: "M3 - Bottle" },
  ];
  const wagesType = [
    { ID: "1", moduleName: "Daily (روزانہ)" },
    { ID: "2", moduleName: "By Weight (کلو)" },
    { ID: "3", moduleName: "Permanent (مستقل)" },
    { ID: "3", moduleName: "Monthly (ماہانہ)" },
  ];
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };
  const resetFunction = () => {
    setEmployeeName("");
    setPhoneNo("");
    setWages("");
    setWagesID("");
    setCNIC("");
    setAddress("");
    setIsActive(true);
    setModule("");
    setUpdate(false);
    setSalary("");
  };
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetEmployeeApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseEmployeeListGet;
        setgetEmplyeeDataForList(data.dataList);
      } else {
        setgetEmplyeeDataForList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    if (hasFetchedEmployees.current) return;

    hasFetchedEmployees.current = true;
    EmployeeGet();
  }, []);
  const EmployeeAdd = async () => {
    try {
      setLoading(true);
      if (
        Module !== "M2 - Preform" &&
        Module !== "M3 - Bottle" &&
        Module !== "M1 - Recycling"
      ) {
        return alert("Please Select From Module List");
      }
      if (
        Wages !== "Daily (روزانہ)" &&
        Wages !== "By Weight (کلو)" &&
        Wages !== "Permanent (مستقل)" &&
        Wages !== "Monthly (ماہانہ)"
      ) {
        return alert("Please Select From Wages List");
      }

      if (!EmployeeName || !PhoneNo || !CNIC || !Salary || !Module || !Wages)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          name: EmployeeName,
          phoneNo: PhoneNo,
          dept: Module,
          address: Address,
          cnic: CNIC,
          wagesType: Wages,
          salary: Number(Salary),
          description: Notes,
          status: IsActive ? "Active" : "InActive",
        };
        const token = localStorage.getItem("adminToken");
        const response = await EmployeeAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          EmployeeGet();
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
  const EmployeeModify = async () => {
    try {
      setLoading(true);
      if (
        Module !== "M2 - Preform" &&
        Module !== "M3 - Bottle" &&
        Module !== "M1 - Recycling"
      ) {
        return alert("Please Select From Module List");
      }
      if (
        Wages !== "Daily (روزانہ)" &&
        Wages !== "By Weight (کلو)" &&
        Wages !== "Permanent (مستقل)" &&
        Wages !== "Monthly (ماہانہ)"
      ) {
        return alert("Please Select From Wages List");
      }
      if (!EmployeeName || !PhoneNo || !CNIC || !Salary || !Module)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          empID: ID,
          name: EmployeeName,
          phoneNo: PhoneNo,
          address: Address,
          dept: Module,
          wagesType: Wages,
          cnic: CNIC,
          salary: Number(Salary),
          description: Notes,
          status: IsActive ? "Active" : "InActive",
        };
        const token = localStorage.getItem("adminToken");
        const response = await EmployeeModifyApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          EmployeeGet();
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
  useEffect(() => {
    if (getEmplyeeData) {
      setUpdate(true);
      setShowForm(true);
      setID(getEmplyeeData.empID);
      setEmployeeName(getEmplyeeData.name);
      setPhoneNo(getEmplyeeData.phoneNo);
      setNotes(getEmplyeeData.description);
      setCNIC(getEmplyeeData.cnic);
      setWages(getEmplyeeData.wagesType);
      setAddress(getEmplyeeData.address);
      setIsActive(getEmplyeeData.status === "Active" ? true : false);
      setModule(getEmplyeeData.dept);
      setSalary(String(getEmplyeeData.salary));
    } else {
      resetFunction();
    }
  }, [getEmplyeeData]);
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
          title={update ? "Edit Employee (ترمیم)" : "New Employee (نیا ملازم)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Name (نام)"
                  type="text"
                  required={true}
                  placeholder="Enter Name"
                  SateChange={EmployeeName}
                  setSateChange={setEmployeeName}
                  disabled={false}
                />
              </div>

              {/* Department - Column 2 */}
              <div className="mt-2">
                <DropDownList
                  label="Dept (شعبہ)"
                  required={true}
                  placeholder="Enter Dept"
                  filedID={setModuleID}
                  options={moduleList.map((item) => ({
                    id: item.ID,
                    label: item.moduleName,
                    value: item.moduleName,
                  }))}
                  value={Module}
                  onChange={setModule}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Wages Type (اجرت کا طریقہ))"
                  required={true}
                  placeholder="Enter Wages"
                  filedID={setWagesID}
                  options={wagesType.map((item) => ({
                    id: item.ID,
                    label: item.moduleName,
                    value: item.moduleName,
                  }))}
                  value={Wages}
                  onChange={setWages}
                />
              </div>

              {/* Phone No - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Phone No (فون نمبر)"
                  type="text"
                  required={true}
                  placeholder="Enter Phone No"
                  SateChange={PhoneNo}
                  setSateChange={setPhoneNo}
                  disabled={false}
                />
              </div>

              {/* CNIC - Column 2 */}
              <div>
                <InputFieldGeneric
                  label="CNIC"
                  type="text"
                  required={true}
                  placeholder="Enter CNIC"
                  SateChange={CNIC}
                  setSateChange={setCNIC}
                  disabled={false}
                />
              </div>

              {/* Address - Full Width (both columns) */}
              <div className="mt-2">
                <InputFieldGeneric
                  label="Address (پتہ)"
                  type="text"
                  required={false}
                  placeholder="Enter Address"
                  SateChange={Address}
                  setSateChange={setAddress}
                  disabled={false}
                />
              </div>

              {/* Salary - Full Width (both columns) */}
              <div className="md:col-span-2">
                <InputFieldGeneric
                  label="Salary (تنخواہ)"
                  type="number"
                  required={true}
                  placeholder="Enter Salary"
                  SateChange={Salary}
                  setSateChange={setSalary}
                  disabled={false}
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
              <div className="">
                {" "}
                <GenericCheckbox
                  label="Active"
                  checked={IsActive}
                  onChange={setIsActive}
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <ActionButton
                text={update ? "Update (اپ ڈیٹ)" : "Add Employee (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Employee..."}
                onClick={() => (update ? EmployeeModify() : EmployeeAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Employees (ملازمین)"
          subHeading="(تمام ملازمین)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <EmployeeGetList
            initalData={setgetEmplyeeData}
            setgetEmplyeeDataForList={getEmplyeeDataForList}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
