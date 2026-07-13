import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import SupplierGetApi from "@/app/api/Controller/Codes/Supplier/GetSupplier";
import GetVehicleApi from "@/app/api/Controller/Codes/Vehicle/GetVehicle";
import PurchaseTripAddApi from "@/app/api/Controller/Module1/purchaseTrip/AddPurchaseTrip";
import PurchaseTripModifyApi from "@/app/api/Controller/Module1/purchaseTrip/ModifyPurchaseTrip";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import {
  ExpenseList,
  responseExpenseListGet,
} from "@/app/api/Types/Codes/Expense/Expense";
import {
  responseSupplierListGet,
  SupplierList,
} from "@/app/api/Types/Codes/Supplier/Supplier";
import {
  responseVehicleListGet,
  VehicleList,
} from "@/app/api/Types/Codes/Vehicle/Vehicle";
import { purchaseTripList } from "@/app/api/Types/module1/purchaseTrip";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import StatsCard from "@/app/ui/StatCard/StatCard";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import { Trash } from "lucide-react";
import { init } from "next/dist/compiled/webpack/webpack";
import { useEffect, useState } from "react";
interface scraperPurchase {
  supplierID: string;
  supplierName: string;
  purchase: string;
  rate: string;
  amountPaid: string;
}
interface FuelExpense {
  fuel: string;
  rate: string;
  paymentMode: string;
  pumpID: string;
}
interface TripExpense {
  expenseType: string;
  amount: string;
  payby: string;
  paymentMode: string;
}
interface PropsPurchaseTrip {
  update: boolean;
  modelClose: boolean;
  initalData?: purchaseTripList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddPurchaseTrip({
  update,
  modelClose,
  onShowMessage,
  initalData,
}: PropsPurchaseTrip) {
  const [PostingDate, setPostingDate] = useState("");
  const [VehicleID, setVehicleID] = useState("");
  const [VehicleName, setVehicleName] = useState("");
  const [EmployeeID, setEmployeeID] = useState("");
  const [EmployeeName, setEmployeeName] = useState("");
  const [AdvanceAmount, setAdvanceAmount] = useState("");
  const [WeightEmptyKg, setWeightEmptyKg] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [MeterEnd, setMeterEnd] = useState("");
  const [MeterStart, setMeterStart] = useState("");
  const [WeightLoadedKg, setWeightLoadedKg] = useState("");
  const [PaymentID, setPaymentID] = useState("");

  const [SupplierID, setSupplierID] = useState("");
  const [SupplierName, setSupplierName] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [scraperPurchase, setScraperPurchase] = useState<scraperPurchase[]>([
    {
      supplierID: "",
      supplierName: "",
      purchase: "",
      rate: "",
      amountPaid: "",
    },
  ]);

  const [FuelExpense, setFuelExpense] = useState<FuelExpense[]>([
    {
      fuel: "",
      rate: "",
      paymentMode: "",
      pumpID: "",
    },
  ]);
  const [TripExpense, setTripExpense] = useState<TripExpense[]>([
    {
      expenseType: "",
      amount: "",
      payby: "",
      paymentMode: "",
    },
  ]);

  const [Notes, setNotes] = useState("");

  const [getVehicleData, setgetVehicleData] = useState<VehicleList[]>([]);
  const [getEmplyeeData, setgetEmplyeeData] = useState<employeeList[]>([]);
  const [getSupplierData, setgetSupplierData] = useState<SupplierList[]>([]);
  const [getExpenseData, setgetExpenseData] = useState<ExpenseList[]>([]);

  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const resetFunction = () => {
    setPostingDate("");
    setVehicleID("");
    setVehicleName("");
    setEmployeeID("");
    setEmployeeName("");
    setAdvanceAmount("");
    setWeightEmptyKg("");
    setWeightLoadedKg("");
    setMeterEnd("");
    setMeterStart("");
    setScraperPurchase([]);
    setFuelExpense([]);
    setTripExpense([]);
    setNotes("");
    setID("");
    setNotes("");
  };

  useEffect(() => {
    if (modelClose) {
      resetFunction();
    }
  }, [modelClose]);
  const payment = [
    { ID: "1", method: "Cash" },
    { ID: "2", method: "Bank" },
  ];

  const VehicleGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetVehicleApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseVehicleListGet;
      setgetVehicleData(data.dataList);
    } else {
      setgetVehicleData([]);
    }
  };

  const EmployeeGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetEmployeeApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseEmployeeListGet;
      setgetEmplyeeData(data.dataList);
    } else {
      setgetEmplyeeData([]);
    }
  };
  const SupplierGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await SupplierGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseSupplierListGet;
      setgetSupplierData(data.dataList);
    } else {
      setgetSupplierData([]);
    }
  };
  const ExpenseGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await ExpenseGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseExpenseListGet;
      setgetExpenseData(data.dataList);
    } else {
      setgetExpenseData([]);
    }
  };
  useEffect(() => {
    VehicleGet();
    EmployeeGet();
    SupplierGet();
    ExpenseGet();
  }, []);

  const addRow = () => {
    setScraperPurchase((prev) => [
      ...prev,
      {
        supplierID: "",
        supplierName: "",
        purchase: "",
        rate: "",
        amountPaid: "",
      },
    ]);
  };
  const addRowFuel = () => {
    setFuelExpense((prev) => [
      ...prev,
      {
        fuel: "",
        rate: "",
        paymentMode: "",
        pumpID: "",
      },
    ]);
  };
  const addRowTrip = () => {
    setTripExpense((prev) => [
      ...prev,
      {
        expenseType: "",
        amount: "",
        payby: "",
        paymentMode: "",
      },
    ]);
  };
  const updateData = (
    index: number,
    field: keyof scraperPurchase,
    value: string | number,
  ) => {
    setScraperPurchase((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const deleteRow = (index: number) => {
    setScraperPurchase((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDataFuelExpense = (
    index: number,
    field: keyof FuelExpense,
    value: string | number,
  ) => {
    setFuelExpense((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const deleteRowFuelExpense = (index: number) => {
    setFuelExpense((prev) => prev.filter((_, i) => i !== index));
  };
  const updateDataTripExpense = (
    index: number,
    field: keyof TripExpense,
    value: string | number,
  ) => {
    setTripExpense((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const deleteRowTripExpense = (index: number) => {
    setTripExpense((prev) => prev.filter((_, i) => i !== index));
  };

  const PurchaseAdd = async () => {
    try {
      setLoading(true);
      if (
        !PostingDate ||
        !VehicleID ||
        !EmployeeID ||
        !AdvanceAmount ||
        !WeightEmptyKg ||
        !WeightLoadedKg ||
        !MeterStart ||
        !MeterEnd
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          postingDate: PostingDate,
          vehicleID: VehicleID,
          empID: EmployeeID,
          advanceAmount: Number(AdvanceAmount),
          paymentMode: PaymentMethod,
          weightEmptyKG: Number(WeightEmptyKg),
          weightLoadedKG: Number(WeightLoadedKg),
          meterstartKG: Number(MeterStart),
          meterEndKG: Number(MeterEnd),
          description: Notes,
          scrapPurchase: scraperPurchase.map((item) => ({
            supplierID: item.supplierID,
            purchaseKg: Number(item.purchase),
            purchasedRate: Number(item.rate),
            amountPaid: Number(item.amountPaid),
          })),
          fuelExpense: FuelExpense.map((item) => ({
            liter: Number(item.fuel),
            rate: Number(item.rate),
            paymentMode: item.paymentMode,
            supplierID: item.paymentMode === "Cash" ? "" : item.pumpID,
          })),
          tripExpense: TripExpense.map((item) => ({
            expenseID: item.expenseType,
            amount: Number(item.amount),
            paidBy: item.payby,
            paymentMode: item.paymentMode,
          })),
        };
        const token = localStorage.getItem("adminToken");
        const response = await PurchaseTripAddApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");

          resetFunction();
        } else {
          onShowMessage(response.data.message, "success");
          // setMessageType("error");
          // setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const PurchaseModify = async () => {
    try {
      setLoading(true);
      if (
        !PostingDate ||
        !VehicleID ||
        !EmployeeID ||
        !AdvanceAmount ||
        !WeightEmptyKg ||
        !WeightLoadedKg ||
        !MeterStart ||
        !MeterEnd
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          tripID: ID,
          postingDate: PostingDate,
          vehicleID: VehicleID,
          empID: EmployeeID,
          advanceAmount: Number(AdvanceAmount),
          paymentMode: PaymentMethod,
          weightEmptyKG: Number(WeightEmptyKg),
          weightLoadedKG: Number(WeightLoadedKg),
          meterstartKG: Number(MeterStart),
          meterEndKG: Number(MeterEnd),
          description: Notes,
          scrapPurchase: scraperPurchase.map((item) => ({
            supplierID: item.supplierID,
            purchaseKg: Number(item.purchase),
            purchasedRate: Number(item.rate),
            amountPaid: Number(item.amountPaid),
          })),
          fuelExpense: FuelExpense.map((item) => ({
            liter: Number(item.fuel),
            rate: Number(item.rate),
            paymentMode: item.paymentMode,
            supplierID: item.paymentMode === "Cash" ? "" : item.pumpID,
          })),
          tripExpense: TripExpense.map((item) => ({
            expenseID: item.expenseType,
            amount: Number(item.amount),
            paidBy: item.payby,
            paymentMode: item.paymentMode,
          })),
        };
        const token = localStorage.getItem("adminToken");
        const response = await PurchaseTripModifyApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");

          resetFunction();
        } else {
          onShowMessage(response.data.message, "success");
          // setMessageType("error");
          // setShowMessage(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const data = scraperPurchase.reduce((accumulator, current) => {
    return accumulator + Number(current.amountPaid);
  }, 0);
  const scrapCarry = scraperPurchase.reduce((acc, item) => {
    return (
      acc + Number(item.purchase)
      //-(Number(form.weightLoaded) - Number(form.weightEmpty))
    );
  }, 0);

  const totalExpense2 = FuelExpense.filter(
    (item) => item.paymentMode === "Cash",
  ).reduce((acc, item) => {
    return acc + Number(item.fuel) * Number(item.rate);
  }, 0);
  const totalTrip = TripExpense.filter(
    (item) => item.paymentMode === "Cash",
  ).reduce((acc, item) => {
    return acc + Number(item.amount);
  }, 0);
  const totalExpense = totalExpense2 + totalTrip;
  useEffect(() => {
    if (update && initalData) {
      setPostingDate(
        new Date(initalData.postingDate).toISOString().split("T")[0],
      );
      setVehicleID(initalData.vehicleID);
      setVehicleName(initalData.vehicleNo);
      setEmployeeID(initalData.empID);
      setEmployeeName(initalData.empName);
      setAdvanceAmount(String(initalData.advanceAmount));
      setWeightEmptyKg(String(initalData.weightEmptyKG));
      setWeightLoadedKg(String(initalData.weightLoadedKG));
      setMeterEnd(String(initalData.meterEndKG));
      setMeterStart(String(initalData.meterstartKG));
      setNotes(initalData.description);
      setID(initalData.tripID);
      setScraperPurchase(
        initalData.scrapPurchase.map((item) => ({
          supplierID: item.supplierID,
          supplierName: item.supplierName || "",
          purchase: String(item.purchaseKg),
          rate: String(item.purchasedRate),
          amountPaid: String(item.amountPaid),
        })),
      );
      setFuelExpense(
        initalData.fuelExpense.map((item) => ({
          fuel: String(item.liter),
          rate: String(item.rate),
          paymentMode: item.paymentMode,
          pumpID: item.supplierID,
        })),
      );
      setTripExpense(
        initalData.tripExpense.map((item) => ({
          expenseType: item.expenseID,
          amount: String(item.amount),
          payby: item.paidBy,
          paymentMode: item.paymentMode,
        })),
      );
    } else {
      resetFunction();
    }
  }, [initalData, update]);

  return (
    <>
      <div>
        <div className="flex gap-2">
          <StatsCard
            title="Total Purchase "
            value={data.toLocaleString()}
            urduTitle="(کل خریداری)"
            icon=""
          />
          <StatsCard
            title="Weight Difference"
            value={scrapCarry.toLocaleString() + " kg"}
            urduTitle="(وزن کا فرق)"
            icon=""
          />
          <StatsCard
            title="Total Expense "
            value={totalExpense.toLocaleString()}
            urduTitle="(کل اخراجات)"
            icon=""
          />
        </div>
        <div className="">
          {/*Trip Info */}
          <div>
            <div className="mt-4 mb-2">
              <h1 className="text-gray-600 font-medium">
                Trip Info (ٹرپ معلومات)
              </h1>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 ">
              <div>
                <InputFieldGeneric
                  label="Trip Date (ٹرپ  کی تاریخ )"
                  type="date"
                  required={true}
                  placeholder="Enter Trip Date"
                  SateChange={PostingDate}
                  setSateChange={setPostingDate}
                  disabled={false}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Vehicle (گاڑی)"
                  required={true}
                  placeholder="Enter Vehicle"
                  filedID={setVehicleID}
                  options={getVehicleData.map((item) => ({
                    id: item.vehicleID,
                    label: item.vehicleNo,
                    value: item.vehicleNo,
                  }))}
                  value={VehicleName}
                  onChange={setVehicleName}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Employee (ملازم)"
                  required={true}
                  placeholder="Enter Employee"
                  filedID={setEmployeeID}
                  options={getEmplyeeData.map((item) => ({
                    id: item.empID,
                    label: item.name,
                    value: item.name,
                  }))}
                  value={EmployeeName}
                  onChange={setEmployeeName}
                />
              </div>
            </div>
          </div>
          {/*Advance to Driver */}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <h1 className="text-gray-600 font-medium">
                Advance to Driver (ڈرائیور کو پیشگی رقم)
              </h1>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 ">
              <div>
                <InputFieldGeneric
                  label="Advance Amount (پیشگی رقم)"
                  type="number"
                  required={true}
                  placeholder="Enter Advance Amount"
                  SateChange={AdvanceAmount}
                  setSateChange={setAdvanceAmount}
                  disabled={false}
                />
              </div>
              <div className="mt-2">
                <DropDownList
                  label="Payment Mode (ادائیگی کا طریقہ)"
                  required={true}
                  placeholder="Enter Payment Mode"
                  filedID={setPaymentID}
                  options={payment.map((item) => ({
                    id: item.ID,
                    label: item.method,
                    value: item.method,
                  }))}
                  value={PaymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Weight Empty (KG) (خالی وزن)"
                  type="number"
                  required={true}
                  placeholder="Enter Weight Empty"
                  SateChange={WeightEmptyKg}
                  setSateChange={setWeightEmptyKg}
                  disabled={false}
                />
              </div>
            </div>
          </div>
          {/*Meter Reading*/}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <h1 className="text-gray-600 font-medium">
                Meter Reading (میٹر ریڈنگ)
              </h1>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 ">
              <div>
                <InputFieldGeneric
                  label="Meter Start (شروع میٹر)"
                  type="number"
                  required={true}
                  placeholder="Enter Meter Start"
                  SateChange={MeterStart}
                  setSateChange={setMeterStart}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Meter End (اختتام میٹر)"
                  type="number"
                  required={true}
                  placeholder="Enter Meter End"
                  SateChange={MeterEnd}
                  setSateChange={setMeterEnd}
                  disabled={false}
                />
              </div>
              <div>
                <InputFieldGeneric
                  label="Loaded Weight (KG) (بھرا وزن)"
                  type="number"
                  required={true}
                  placeholder="Enter Loaded Weight"
                  SateChange={WeightLoadedKg}
                  setSateChange={setWeightLoadedKg}
                  disabled={false}
                />
              </div>
            </div>
          </div>
          {/*Scrap Purchase*/}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <div className="w-full flex justify-between">
                <h1 className="text-gray-600 font-medium">
                  Scrap Dealer Purchases (اسکریپ ڈیلر خریداری)
                </h1>
                <button
                  title="Add Scraper Purchase"
                  className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                  onClick={addRow}
                >
                  +Add Row (قطار شامل کریں)
                </button>
              </div>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            {scraperPurchase.length > 0 && (
              <div className="space-y-2">
                {scraperPurchase.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.supplierID}
                      onChange={(e) => {
                        const selectedSupplier = getSupplierData.find(
                          (s) => s.supplierID === e.target.value,
                        );

                        if (!selectedSupplier) return;

                        setScraperPurchase((prev) =>
                          prev.map((row, i) =>
                            i === index
                              ? {
                                  ...row,
                                  supplierID: selectedSupplier.supplierID,
                                  supplierName: selectedSupplier.name,
                                }
                              : row,
                          ),
                        );
                      }}
                    >
                      <option value="">Select Supplier</option>

                      {getSupplierData.map((supplier) => (
                        <option
                          key={supplier.supplierID}
                          value={supplier.supplierID}
                        >
                          {supplier.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={item.purchase}
                      placeholder="KG"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                      onChange={(e) =>
                        updateData(index, "purchase", Number(e.target.value))
                      }
                    />

                    <input
                      type="number"
                      value={item.rate}
                      placeholder="Rate"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                      onChange={(e) =>
                        updateData(index, "rate", Number(e.target.value))
                      }
                    />

                    <input
                      type="number"
                      value={item.amountPaid}
                      placeholder="Amount Paid"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                      onChange={(e) =>
                        updateData(index, "amountPaid", Number(e.target.value))
                      }
                    />
                    <div>
                      <button
                        onClick={() => deleteRow(index)}
                        className="h-10 w-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/*Fuel Expense*/}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <div className="w-full flex justify-between">
                <h1 className="text-gray-600 font-medium">Fuel (ایندھن)</h1>
                <button
                  title="Add Scraper Purchase"
                  className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                  onClick={addRowFuel}
                >
                  +Add Row (قطار شامل کریں)
                </button>
              </div>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            {FuelExpense.length > 0 && (
              <div className="space-y-2">
                {FuelExpense.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="number"
                      value={item.fuel}
                      placeholder="Liters (لیٹر)"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                      onChange={(e) =>
                        updateDataFuelExpense(
                          index,
                          "fuel",
                          Number(e.target.value),
                        )
                      }
                    />

                    <input
                      type="number"
                      value={item.rate}
                      placeholder="Rate/L (قیمت)"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                      onChange={(e) =>
                        updateDataFuelExpense(
                          index,
                          "rate",
                          Number(e.target.value),
                        )
                      }
                    />
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.paymentMode}
                      onChange={(e) => {
                        updateDataFuelExpense(
                          index,
                          "paymentMode",
                          e.target.value,
                        );
                      }}
                    >
                      <option value={"Cash"}>Cash</option>
                      <option value={"PumpAccount"}>Pump Account</option>
                    </select>
                    {item.paymentMode === "PumpAccount" && (
                      <>
                        <select
                          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                          value={item.pumpID}
                          onChange={(e) => {
                            updateDataFuelExpense(
                              index,
                              "pumpID",
                              e.target.value,
                            );
                          }}
                        >
                          <option value="">Select Pump</option>

                          {getSupplierData.map((supplier) => (
                            <option
                              key={supplier.supplierID}
                              value={supplier.supplierID}
                            >
                              {supplier.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    <div>
                      <button
                        onClick={() => deleteRowFuelExpense(index)}
                        className="h-10 w-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/*Trip Expenses */}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <div className="w-full flex justify-between">
                <h1 className="text-gray-600 font-medium">
                  Trip Expenses (ٹرپ خرچ)
                </h1>
                <button
                  title="Add Scraper Purchase"
                  className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                  onClick={addRowTrip}
                >
                  +Add Row (قطار شامل کریں)
                </button>
              </div>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            {TripExpense.length > 0 && (
              <div className="space-y-2">
                {TripExpense.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.expenseType}
                      onChange={(e) => {
                        updateDataTripExpense(
                          index,
                          "expenseType",
                          e.target.value,
                        );
                      }}
                    >
                      <option>{"Select Expense Type"}</option>
                      {getExpenseData.map((item) => (
                        <option value={item.expID}>{item.categoryName}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={item.amount}
                      placeholder="Amount (قیمت)"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                      onChange={(e) =>
                        updateDataTripExpense(
                          index,
                          "amount",
                          Number(e.target.value),
                        )
                      }
                    />
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.payby}
                      onChange={(e) => {
                        updateDataTripExpense(index, "payby", e.target.value);
                      }}
                    >
                      <option value={"Company"}>Company (کمپنی)</option>
                      <option value={"Employee"}>Employee (ملازم)</option>
                    </select>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.paymentMode}
                      onChange={(e) => {
                        updateDataTripExpense(
                          index,
                          "paymentMode",
                          e.target.value,
                        );
                      }}
                    >
                      <option value={"Cash"}>Cash</option>
                      <option value={"Bank"}>Bank</option>
                    </select>
                    <div>
                      <button
                        onClick={() => deleteRowTripExpense(index)}
                        className="h-10 w-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2">
            <TextAreaFieldGeneric
              label="Notes"
              required={false}
              placeholder="Enter Notes"
              SateChange={Notes}
              setSateChange={setNotes}
              disabled={false}
            />
          </div>

          <div className="flex justify-end mt-2">
            <ActionButton
              text={update ? "Update (اپ ڈیٹ)" : "Add Trip (شامل کریں)"}
              update={loading}
              loading={loading}
              size={"w-full"}
              loadingtext={update ? "Updating..." : "Adding Trip..."}
              onClick={() => (update ? PurchaseModify() : PurchaseAdd())}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
