"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useRef, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

import LabourAddApi from "@/app/api/Controller/Codes/Labour/AddLabour";
import LabourModifyApi from "@/app/api/Controller/Codes/Labour/ModifyLabour";
import LabourGetList from "./LabourGetList";
import {
  labourList,
  responseLabourListGet,
} from "@/app/api/Types/Codes/Labour/labour";
import LabourGetApi from "@/app/api/Controller/Codes/Labour/GetLabout";

export default function CategoryManagement() {
  const hasFetchedEmployees = useRef(false);
  const [refresh, setRefresh] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const [CategoryName, setCategoryName] = useState("");
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [getEmplyeeData, setgetEmplyeeData] = useState<labourList>();
  const [getLabourData, setgetLabourData] = useState<labourList[]>([]);
  const [isloading, setisLoading] = useState(false);
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
      const response = await LabourGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseLabourListGet;
        setgetLabourData(data.dataList);
      } else {
        setgetLabourData([]);
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
      if (!CategoryName || !Notes) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          labourType: CategoryName,
          rateKG: Number(Notes),
        };
        const token = localStorage.getItem("adminToken");
        const response = await LabourAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setShowMessage(response.data.message);
          setRefresh((prev) => prev + 1);
          resetFunction();
          EmployeeGet();
          setShowForm(false);
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
      if (!CategoryName || !Notes || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          labourID: ID,
          qty: 0,
          labourType: CategoryName,
          rateKG: Number(Notes),
        };
        const token = localStorage.getItem("adminToken");
        const response = await LabourModifyApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          setRefresh((prev) => prev + 1);
          setShowMessage(response.data.message);
          resetFunction();
          EmployeeGet();
          setShowForm(false);
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
      setCategoryName(getEmplyeeData.labourType);
      setID(getEmplyeeData.labourID);
      setNotes(String(getEmplyeeData.rateKG));
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
          title={update ? "Edit Expense (ترمیم)" : "New Labour (نئی اخراجات)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Labour Title (لیبر ٹائٹل)"
                  type="text"
                  required={true}
                  placeholder="Enter Labour Title"
                  SateChange={CategoryName}
                  setSateChange={setCategoryName}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Rate/KG (ریٹ)"
                  type="number"
                  required={true}
                  placeholder="Enter Rate/KG"
                  SateChange={Notes}
                  setSateChange={setNotes}
                  disabled={false}
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <ActionButton
                text={update ? "Update (اپ ڈیٹ)" : "Add Labour (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Labour..."}
                onClick={() => (update ? ExpenseModify() : ExpenseAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Labour (مزدوری)"
          subHeading="(تمام مزدور)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <LabourGetList
            initalData={setgetEmplyeeData}
            setgetLabourData={getLabourData}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
