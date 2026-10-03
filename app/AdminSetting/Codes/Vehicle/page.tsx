"use client";
import Heading from "@/app/ui/Heading/Heading";
import PopupComponent from "@/app/ui/PopupComponent/PopupComponent";
import { useEffect, useRef, useState } from "react";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import DropDownList from "@/app/ui/DropDown/DropDown";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import VehicleAddApi from "@/app/api/Controller/Codes/Vehicle/AddVehicle";
import VehicleGetList from "./VehicleListGet";
import VehicleModifyApi from "@/app/api/Controller/Codes/Vehicle/ModifyVehicle";
import {
  responseVehicleListGet,
  VehicleList,
} from "@/app/api/Types/Codes/Vehicle/Vehicle";
import GetVehicleApi from "@/app/api/Controller/Codes/Vehicle/GetVehicle";

export default function VehicleManagement() {
  const hasFetchedEmployees = useRef(false);
  const [refresh, setRefresh] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const [VehicleName, setVehicleName] = useState("");
  const [MaxWeightCarry, setMaxWeightCarry] = useState("");
  const [PositiveWeightThreshold, setPositiveWeightThreshold] = useState("");
  const [OpeningMeterReadiung, setOpeningMeterReadiung] = useState("");
  const [OpeningInvestment, setOpeningInvestment] = useState("");
  const [ScrapratePerKg, setScrapratePerKg] = useState("");
  const [BottleRatePerPiece, setBottleRatePerPiece] = useState("");
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [getEmplyeeData, setgetEmplyeeData] = useState<VehicleList>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [getVehicleDataForList, setgetVehicleDataForList] = useState<
    VehicleList[]
  >([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [isloading, setisLoading] = useState(false);
  const moduleList = [
    { ID: "1", moduleName: "Own" },
    { ID: "2", moduleName: "OutSource" },
  ];
  const eventTrigger = () => {
    setShowForm(!ShowForm);
    resetFunction();
  };
  const resetFunction = () => {
    setVehicleName("");
    setMaxWeightCarry("");
    setPositiveWeightThreshold("");
    setOpeningMeterReadiung("");
    setOpeningInvestment("");
    setBottleRatePerPiece("");
    setModule("");
    setUpdate(false);
    setScrapratePerKg("");
  };
  const EmployeeGet = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetVehicleApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseVehicleListGet;
        setgetVehicleDataForList(data.dataList);
      } else {
        setgetVehicleDataForList([]);
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
  const VehicleAdd = async () => {
    try {
      setLoading(true);
      if (Module !== "Own" && Module !== "OutSource") {
        return alert("Please Select From OwnerShip List");
      }
      if (
        !VehicleName ||
        !MaxWeightCarry ||
        !PositiveWeightThreshold ||
        !ScrapratePerKg ||
        !BottleRatePerPiece ||
        !Module
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          vehicleNo: VehicleName,
          openingMeterReading: Number(OpeningMeterReadiung),
          positiveThreshold: Number(PositiveWeightThreshold),
          scrapCarryThreshold: Number(MaxWeightCarry),
          scrapRatePerKG: Number(ScrapratePerKg),
          bottleRatePerPcs: Number(BottleRatePerPiece),
          openingInvestment: Number(OpeningInvestment),
          ownerShip: Module,
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await VehicleAddApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          EmployeeGet();
          setShowMessage(response.data.message);
          setRefresh((prev) => prev + 1);
          resetFunction();
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
  const VehicleModify = async () => {
    try {
      setLoading(true);
      if (Module !== "Own" && Module !== "OutSource") {
        return alert("Please Select From OwnerShip List");
      }
      if (
        !VehicleName ||
        !MaxWeightCarry ||
        !PositiveWeightThreshold ||
        !ScrapratePerKg ||
        !BottleRatePerPiece ||
        !Module ||
        !ID
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          vehicleID: ID,
          vehicleNo: VehicleName,
          openingMeterReading: Number(OpeningMeterReadiung),
          positiveThreshold: Number(PositiveWeightThreshold),
          scrapCarryThreshold: Number(MaxWeightCarry),
          scrapRatePerKG: Number(ScrapratePerKg),
          bottleRatePerPcs: Number(BottleRatePerPiece),
          openingInvestment: Number(OpeningInvestment),
          ownerShip: Module,
          description: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await VehicleModifyApi(formData, String(token));
        if (response.status == 200) {
          setMessageType("success");
          EmployeeGet();
          setShowMessage(response.data.message);
          setRefresh((prev) => prev + 1);
          resetFunction();
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
      setID(getEmplyeeData.vehicleID);
      setVehicleName(getEmplyeeData.vehicleNo);
      setMaxWeightCarry(String(getEmplyeeData.scrapCarryThreshold));
      setPositiveWeightThreshold(String(getEmplyeeData.positiveThreshold));
      setOpeningMeterReadiung(String(getEmplyeeData.openingMeterReading));
      setOpeningInvestment(String(getEmplyeeData.openingInvestment));
      setModule(getEmplyeeData.ownerShip);
      setScrapratePerKg(String(getEmplyeeData.scrapRatePerKG));
      setBottleRatePerPiece(String(getEmplyeeData.bottleRatePerPcs));
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
          title={update ? "Edit Vehicle (ترمیم)" : "New Vehicle (نئی گاڑی)"}
        >
          <div className="">
            {/* Two Column Grid with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Vehicle No (گاڑی کا نمبر)"
                  type="text"
                  required={true}
                  placeholder="Enter Vehicle No"
                  SateChange={VehicleName}
                  setSateChange={setVehicleName}
                  disabled={false}
                />
              </div>

              {/* Department - Column 2 */}
              <div className="mt-2">
                <DropDownList
                  label="OwnerShip (ملکیت)"
                  required={true}
                  placeholder="Enter OwnerShip"
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

              {/* Phone No - Column 1 */}
              <div>
                <InputFieldGeneric
                  label="Max Weight Carry (وزن اٹھانے  کی حد)"
                  type="number"
                  required={true}
                  placeholder="Enter Max Weight Carry"
                  SateChange={MaxWeightCarry}
                  setSateChange={setMaxWeightCarry}
                  disabled={false}
                />
              </div>

              {/* PositiveWeightThreshold - Column 2 */}
              <div>
                <InputFieldGeneric
                  label="+ve Positive Weight Threshold (+ve وزن کی حد)"
                  type="number"
                  required={true}
                  placeholder="Enter PositiveWeightThreshold"
                  SateChange={PositiveWeightThreshold}
                  setSateChange={setPositiveWeightThreshold}
                  disabled={false}
                />
              </div>

              {/* OpeningMeterReadiung - Full Width (both columns) */}
              <div>
                <InputFieldGeneric
                  label="Opening Meter Reading (میٹر ریڈنگ)"
                  type="text"
                  required={false}
                  placeholder="Enter OpeningMeterReadiung"
                  SateChange={OpeningMeterReadiung}
                  setSateChange={setOpeningMeterReadiung}
                  disabled={false}
                />
              </div>

              {/* ScrapratePerKg - Full Width (both columns) */}
              <div>
                <InputFieldGeneric
                  label="Crush Rate / KG (کرش کی قیمت)"
                  type="number"
                  required={true}
                  placeholder="Enter Scrap Rate / KG"
                  SateChange={ScrapratePerKg}
                  setSateChange={setScrapratePerKg}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Bottle Rate / Pcs (بوتل کی قیمت)"
                  type="number"
                  required={true}
                  placeholder="Enter Bottle Rate / Pcs"
                  SateChange={BottleRatePerPiece}
                  setSateChange={setBottleRatePerPiece}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Opening Investment (ابتدائی سرمایہ)"
                  type="number"
                  required={true}
                  placeholder="Enter Opening Investment"
                  SateChange={OpeningInvestment}
                  setSateChange={setOpeningInvestment}
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
            </div>

            <div className="flex justify-end mt-2">
              <ActionButton
                text={update ? "Update (اپ ڈیٹ)" : "Add Vehicle (شامل کریں)"}
                update={loading}
                loading={loading}
                size={"w-full"}
                loadingtext={update ? "Updating..." : "Adding Vehicle..."}
                onClick={() => (update ? VehicleModify() : VehicleAdd())}
                disabled={false}
              />
            </div>
          </div>
        </PopupComponent>
      )}
      <div className="">
        <Heading
          heading="Vehicle (گاڑی)"
          subHeading="(تمام گاڑیاں)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <VehicleGetList
            initalData={setgetEmplyeeData}
            setgetVehicleDataForList={getVehicleDataForList}
            setIsLoading={isloading}
          />
        </div>
      </div>
    </>
  );
}
