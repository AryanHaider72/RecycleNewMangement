"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import VehicleAddApi from "@/app/api/Controller/Codes/Vehicle/AddVehicle";
import VehicleModifyApi from "@/app/api/Controller/Codes/Vehicle/ModifyVehicle";
import { VehicleList } from "@/app/api/Types/Codes/Vehicle/Vehicle";
import ExpenseAddApi from "@/app/api/Controller/Codes/Expense/AddExpense";
import ExpenseModifyApi from "@/app/api/Controller/Codes/Expense/ModifyExpense";
import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import ExpenseGetList from "./ExpenseGetList";
import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";

export default function CategoryManagement() {
  const hasFetchedEmployees = useRef(false);
  const [ShowForm, setShowForm] = useState(false);
  const [CategoryName, setCategoryName] = useState("");
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [getEmplyeeData, setgetEmplyeeData] = useState<ExpenseList>();
  const [getExpenseDataForList, setgetExpenseDataForList] = useState<
    ExpenseList[]
  >([]);
  const [isloading, setisLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const moduleList = [
    { ID: "1", label: "M1 - Recycling" },
    { ID: "2", label: "M2 - Preform" },
    { ID: "3", label: "M3 - Bottle" },
  ];
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };
  const resetFunction = () => {
    setCategoryName("");
    setModule("");
    setID("");
    setNotes("");
    setUpdate(false);
  };

  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await ExpenseGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseExpenseListGet;
        setgetExpenseDataForList(data.dataList);
      } else {
        setgetExpenseDataForList([]);
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
  const ExpenseAdd = async () => {
    try {
      setLoading(true);
      if (
        Module !== "M2 - Preform" &&
        Module !== "M3 - Bottle" &&
        Module !== "M1 - Recycling"
      ) {
        return alert("Please Select From Module List");
      }
      if (!CategoryName || !Module) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          categoryName: CategoryName,
          expenseType: Module,
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ExpenseAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          EmployeeGet();
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
  const ExpenseModify = async () => {
    try {
      setLoading(true);
      if (
        Module !== "M2 - Preform" &&
        Module !== "M3 - Bottle" &&
        Module !== "M1 - Recycling"
      ) {
        return alert("Please Select From Module List");
      }
      if (!CategoryName || !Module || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          expID: ID,
          categoryName: CategoryName,
          expenseType: Module,
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ExpenseModifyApi(formData, String(token));
        if (response.status == 200) {
          setRefresh((prev) => prev + 1);

          setMessageType("success");
          setShowMessage(response.data.message);
          resetFunction();
          setShowForm(false);
          EmployeeGet();
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
      setCategoryName(getEmplyeeData.categoryName);
      setID(getEmplyeeData.expID);
      setModule(getEmplyeeData.expenseType);
      setNotes(getEmplyeeData.description);
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
          title={update ? "Edit Expense (ترمیم)" : "New Expense (نئی اخراجات)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Category Name (زمرے کا نام)"
                  type="text"
                  required={true}
                  placeholder="Enter Category Name"
                  SateChange={CategoryName}
                  setSateChange={setCategoryName}
                  disabled={false}
                />
              </div>

              {/* Department - Column 2 */}
              <div className="mt-2">
                <DropDownList
                  label="Module (ماڈیول)"
                  required={true}
                  placeholder="Enter Module"
                  filedID={setModuleID}
                  options={moduleList.map((item) => ({
                    id: item.ID,
                    label: item.label,
                    value: item.label,
                  }))}
                  value={Module}
                  onChange={setModule}
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

            <div className="flex justify-end mt-2">
              <ActionButton
                text={update ? "Update (اپ ڈیٹ)" : "Add Expense (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Expense..."}
                onClick={() => (update ? ExpenseModify() : ExpenseAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Expense (اخراجات)"
          subHeading="(تمام اخراجات)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <ExpenseGetList
            initalData={setgetEmplyeeData}
            setgetExpenseDataForList={getExpenseDataForList}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
