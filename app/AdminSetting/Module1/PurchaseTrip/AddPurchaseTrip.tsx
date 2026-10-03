import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import ExpenseGetApi from "@/app/api/Controller/Codes/Expense/GetExpense";
import SupplierGetApi from "@/app/api/Controller/Codes/Supplier/GetSupplier";
import GetVehicleApi from "@/app/api/Controller/Codes/Vehicle/GetVehicle";
import PurchaseTripAddApi from "@/app/api/Controller/Module1/purchaseTrip/AddPurchaseTrip";
import PurchaseTripModifyApi from "@/app/api/Controller/Module1/purchaseTrip/ModifyPurchaseTrip";
import { ToWords } from "to-words";
const toWords = new ToWords();
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
import { use, useEffect, useRef, useState } from "react";
import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import {
  CustomerList,
  responseCustomerListGet,
} from "@/app/api/Types/Codes/Customer/Customer";
import CustomerGetApi from "@/app/api/Controller/Codes/Customer/CustomerGet";
interface scraperPurchase {
  supplierID: string;
  supplierName: string;
  purchase: string;
  rate: string;
  amountPaid: string;
}
interface FuelExpense {
  expenseID: string;
  fuel: string;
  rate: string;
  paymentMode: string;
  pumpID: string;
}
interface TripExpense {
  expenseType: string;
  amount: string;
  payby: string;
  bankID: string;
  companyCash: boolean;
  paymentMode: string;
}
interface LabourList {
  employeeID: string;
  employeeName: string;
  rate: number;
}
interface SupplierPayment {
  supplierID: string;
  rate: string;
  paymentMode: string;
  bankID: string;
  paymentStatus: string;
}
interface CustomerRecovery {
  customerID: string;
  rate: string;
  paymentMode: string;
  bankID: string;
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
  const hasFetchedEmployees = useRef(false);
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

  const [CustomerRecovery, setCustomerRecovery] = useState<CustomerRecovery[]>([
    {
      customerID: "",
      rate: "",
      paymentMode: "",
      bankID: "",
    },
  ]);
  const [SupplierPayment, setSupplierPayment] = useState<SupplierPayment[]>([
    {
      supplierID: "",
      rate: "",
      paymentMode: "",
      bankID: "",
      paymentStatus: "",
    },
  ]);
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
      expenseID: "",
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
      bankID: "",
      companyCash: false,
      paymentMode: "",
    },
  ]);
  const [LabourList, setLabourList] = useState<LabourList[]>([
    {
      employeeID: "",
      employeeName: "",
      rate: 0,
    },
  ]);

  const [Notes, setNotes] = useState("");
  const [RatePerKg, setRatePerKg] = useState("");
  const [TruckThreshold, setTruckThreshold] = useState("");

  const [getVehicleData, setgetVehicleData] = useState<VehicleList[]>([]);
  const [getEmplyeeData, setgetEmplyeeData] = useState<employeeList[]>([]);
  const [getSupplierData, setgetSupplierData] = useState<SupplierList[]>([]);
  const [GetCustomerData, setGetCustomerData] = useState<CustomerList[]>([]);
  const [getExpenseData, setgetExpenseData] = useState<ExpenseList[]>([]);
  const [getBankData, setgetBankData] = useState<BankList[]>([]);
  const [IsActive, setIsActive] = useState(true);
  const [BankID, setBankID] = useState("");
  const [BankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [AmountReceived, setAmountReceived] = useState("");
  const [Salary, setSalary] = useState(0);
  const [isRemaningAmount, setisRemaningAmount] = useState(false);
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
    setisRemaningAmount(false);
    setAmountReceived("");
    setScraperPurchase([]);
    setFuelExpense([]);
    setTripExpense([]);
    setLabourList([]);
    setCustomerRecovery([]);
    setSupplierPayment([]);
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
  const BankGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await BankGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseBankListGet;
      setgetBankData(data.dataList);
    } else {
      setgetBankData([]);
    }
  };

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
  const CustomerGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await CustomerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as responseCustomerListGet;
      setGetCustomerData(data.dataList);
    } else {
      setGetCustomerData([]);
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
    if (hasFetchedEmployees.current) return;
    hasFetchedEmployees.current = true;
    VehicleGet();
    EmployeeGet();
    SupplierGet();
    CustomerGet();
    ExpenseGet();
    BankGet();
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
        expenseID: "",
        fuel: "",
        rate: "",
        paymentMode: "",
        pumpID: "",
      },
    ]);
  };
  const addSupplierPayment = () => {
    setSupplierPayment((prev) => [
      ...prev,
      {
        supplierID: "",
        rate: "",
        paymentStatus: "",
        paymentMode: "",
        bankID: "",
      },
    ]);
  };
  const addCustomerRecovery = () => {
    setCustomerRecovery((prev) => [
      ...prev,
      {
        customerID: "",
        rate: "",
        paymentMode: "",
        bankID: "",
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
        bankID: "",
        companyCash: false,
        paymentMode: "",
      },
    ]);
  };
  const addLabourList = () => {
    setLabourList((prev) => [
      ...prev,
      {
        employeeID: "",
        employeeName: "",
        rate: 0,
      },
    ]);
  };
  // const updateData = (
  //   index: number,
  //   field: keyof scraperPurchase,
  //   value: string | number,
  // ) => {
  //   setScraperPurchase((prev) =>
  //     prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
  //   );
  // };
  const updateData = (
    index: number,
    field: keyof scraperPurchase,
    value: string | number,
  ) => {
    setScraperPurchase((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const updatedItem = {
          ...item,
          [field]: value,
        };

        if (field === "rate" || field === "purchase") {
          updatedItem.amountPaid = String(
            Number(field === "rate" ? value : updatedItem.rate) *
              Number(field === "purchase" ? value : updatedItem.purchase),
          );
        }

        return updatedItem;
      }),
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
    value: string | number | boolean,
  ) => {
    setTripExpense((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const deleteRowTripExpense = (index: number) => {
    setTripExpense((prev) => prev.filter((_, i) => i !== index));
  };

  const PurchaseAdd = async () => {
    const threshold = getVehicleData.find(
      (item) => item.vehicleID === VehicleID,
    );

    //Amunt Paid
    const scrapCarryPurchase = scraperPurchase.reduce((acc, item) => {
      return acc + Number(item.purchase);
    }, 0);
    //Weight of Truck
    const lowestRateItem =
      scraperPurchase.length > 0
        ? scraperPurchase.reduce((lowest, current) =>
            Number(current.rate) < Number(lowest.rate) ? current : lowest,
          )
        : null;
    const totalScrapCarryLoaded =
      Number(WeightLoadedKg) - Number(WeightEmptyKg);
    var poriftLoss = 0;
    if (totalScrapCarryLoaded < 0) {
      poriftLoss =
        (Number(totalScrapCarryLoaded) - Number(scrapCarryPurchase)) *
        Number(lowestRateItem?.rate ?? 0);
    } else if (totalScrapCarryLoaded > 0) {
      if (
        Number(totalScrapCarryLoaded) -
          Number(scrapCarryPurchase) -
          Number(threshold?.positiveThreshold) >
        0
      ) {
        poriftLoss =
          (Number(totalScrapCarryLoaded) -
            Number(scrapCarryPurchase) -
            (Number(totalScrapCarryLoaded) -
              Number(scrapCarryPurchase) -
              Number(threshold?.positiveThreshold))) *
          Number(lowestRateItem?.rate ?? 0);
      } else if (
        Number(totalScrapCarryLoaded) -
          Number(scrapCarryPurchase) -
          Number(threshold?.positiveThreshold) <
        0
      ) {
        poriftLoss =
          (Number(totalScrapCarryLoaded) - Number(scrapCarryPurchase)) *
          Number(lowestRateItem?.rate ?? 0);
      }
    }
    const scrapCarryDifference =
      Number(totalScrapCarryLoaded) - Number(scrapCarryPurchase);

    const positiveThreshold = Number(threshold?.positiveThreshold ?? 0);

    const profitedScrapKg =
      scrapCarryDifference > positiveThreshold
        ? scrapCarryDifference - positiveThreshold
        : 0;
    /////////////////////////////////////////Advance Cash Manage|||||||||||||||||||||||||||||||||||

    const totalExpense2 = FuelExpense.filter(
      (item) => item.paymentMode === "Cash",
    ).reduce((acc, item) => {
      return acc + Number(item.fuel) * Number(item.rate);
    }, 0);
    const totalTrip = TripExpense.filter(
      (item) =>
        (item.payby === "Company" && item.paymentMode === "Cash") ||
        (item.payby === "Employee" &&
          item.companyCash === true &&
          item.paymentMode === "Cash"),
    ).reduce((acc, item) => {
      return acc + Number(item.amount);
    }, 0);
    const AmountPaid = scraperPurchase.reduce((acc, item) => {
      return acc + Number(item.amountPaid);
    }, 0);
    const LabourPaid = LabourList.reduce((acc, item) => {
      return acc + Number(item.rate);
    }, 0);
    const CustomerRecorveryAmount = CustomerRecovery.filter(
      (item2) => item2.paymentMode === "Cash",
    ).reduce((sum, item) => {
      return sum + Number(item.rate);
    }, 0);
    const SupplierPaidAmount = SupplierPayment.filter(
      (item2) => item2.paymentMode === "Cash",
    ).reduce((sum, item) => {
      return (
        sum +
        (item.paymentStatus === "Cash Paid"
          ? -Number(item.rate)
          : Number(item.rate))
      );
    }, 0);
    const salry = getEmplyeeData.find((item) => item.empID === EmployeeID);
    const remanignCash =
      Number(AdvanceAmount) +
      Number(CustomerRecorveryAmount) -
      (totalExpense2 + totalTrip + AmountPaid + LabourPaid);

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
          salary: Number(salry?.salary),
          profitLoss: poriftLoss,
          remainingCash:
            isRemaningAmount === true
              ? remanignCash + SupplierPaidAmount - Number(AmountReceived)
              : 0,
          ratePerKg: Number(RatePerKg),

          advanceAmount: Number(AdvanceAmount),
          paymentMode: PaymentMethod,
          weightEmptyKG: Number(WeightEmptyKg),
          weightLoadedKG: Number(WeightLoadedKg),
          meterstartKG: Number(MeterStart),
          meterEndKG: Number(MeterEnd),
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          description: Notes,

          scrapPurchaseProfitLoss: {
            supplierID: "00000000-0000-0000-0000-000000000000",
            phoneNo: "",
            purchaseKg:
              Number(WeightLoadedKg) -
                Number(WeightEmptyKg) -
                Number(scrapCarryPurchase) -
                Number(threshold?.positiveThreshold) <
              0
                ? 0
                : Number(WeightLoadedKg) -
                  Number(WeightEmptyKg) -
                  Number(scrapCarryPurchase) -
                  Number(threshold?.positiveThreshold),
            purchasedRate: 0,
            amountPaid: 0,
          },
          // scrapPurchase: scraperPurchase
          //   .filter((item) => item.supplierID.trim())
          //   .map((item) => ({
          //     supplierID: item.supplierID,
          //     phoneNo: "",
          //     purchaseKg: Number(item.purchase),
          //     purchasedRate: Number(item.rate),
          //     amountPaid: Number(item.amountPaid),
          //   })),
          scrapPurchase: [
            ...scraperPurchase
              .filter((item) => item.supplierID.trim())
              .map((item) => ({
                supplierID: item.supplierID,
                phoneNo: "",
                purchaseKg: Number(item.purchase),
                purchasedRate: Number(item.rate),
                amountPaid: Number(item.amountPaid),
              })),

            ...(profitedScrapKg > 0
              ? [
                  {
                    supplierID: "00000000-0000-0000-0000-000000000000",
                    phoneNo: "",
                    purchaseKg: Number(threshold?.positiveThreshold),
                    purchasedRate: Number(lowestRateItem?.rate ?? 0),
                    amountPaid:
                      Number(threshold?.positiveThreshold) *
                      Number(lowestRateItem?.rate ?? 0),
                  },
                ]
              : profitedScrapKg < 0
                ? [
                    {
                      supplierID: "00000000-0000-0000-0000-000000000000",
                      phoneNo: "",
                      purchaseKg:
                        Number(totalScrapCarryLoaded) -
                        Number(scrapCarryPurchase),
                      purchasedRate: Number(lowestRateItem?.rate ?? 0),
                      amountPaid:
                        (Number(totalScrapCarryLoaded) -
                          Number(scrapCarryPurchase)) *
                        Number(lowestRateItem?.rate ?? 0),
                    },
                  ]
                : []),
          ],

          fuelExpense: FuelExpense.map((item) => ({
            expenseID: "00000000-0000-0000-0000-000000000000",
            liter: Number(item.fuel),
            rate: Number(item.rate),
            paymentMode: item.paymentMode,
            supplierID:
              item.paymentMode === "Cash"
                ? "00000000-0000-0000-0000-000000000000"
                : item.pumpID,
          })),
          tripExpense: TripExpense.filter((item) =>
            item.expenseType.trim(),
          ).map((item) => ({
            expenseID: item.expenseType,
            amount: Number(item.amount),
            paidBy: item.payby,
            bankID:
              item.paymentMode === "Cash"
                ? "00000000-0000-0000-0000-000000000000"
                : item.bankID,
            companyCash: item.companyCash,
            paymentMode: item.paymentMode,
          })),
          labourList: LabourList.filter((item) => item.employeeID.trim()).map(
            (item) => ({
              isPaid: IsActive,
              employeeID: item.employeeID,
              employeeName: item.employeeName,
              rate: item.rate,
            }),
          ),
          supplierPayment: SupplierPayment.filter((item) =>
            item.supplierID.trim(),
          ).map((item) => ({
            supplierID: item.supplierID,
            paymentStatus: item.paymentStatus,
            rate: Number(item.rate),
            paymentMode: item.paymentMode,
            bankID:
              item.paymentMode === "Cash"
                ? "00000000-0000-0000-0000-000000000000"
                : item.bankID,
          })),
          customerRecovery: CustomerRecovery.filter((item) =>
            item.customerID.trim(),
          ).map((item) => ({
            customerID: item.customerID,
            rate: Number(item.rate),
            paymentMode: item.paymentMode,
            bankID:
              item.paymentMode === "Cash"
                ? "00000000-0000-0000-0000-000000000000"
                : item.bankID,
          })),
        };
        //console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await PurchaseTripAddApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");

          resetFunction();
        } else {
          onShowMessage(response.data.message, "error");
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
          ratePerKg: Number(RatePerKg),
          advanceAmount: Number(AdvanceAmount),
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          paymentMode: PaymentMethod,
          weightEmptyKG: Number(WeightEmptyKg),
          weightLoadedKG: Number(WeightLoadedKg),
          meterstartKG: Number(MeterStart),
          meterEndKG: Number(MeterEnd),
          description: Notes,
          scrapPurchase: scraperPurchase.map((item) => ({
            supplierID: item.supplierID,
            phoneNo: "",
            purchaseKg: Number(item.purchase),
            purchasedRate: Number(item.rate),
            amountPaid: Number(item.amountPaid),
          })),
          fuelExpense: FuelExpense.map((item) => ({
            expenseID: item.expenseID,
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
          labourList: LabourList.map((item) => ({
            isPaid: IsActive,
            employeeID: item.employeeID,
            rate: item.rate,
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
  useEffect(() => {
    const find = getEmplyeeData.find((item) => item.empID === EmployeeID);
    if (find) {
      setSalary(find?.salary);
    }
  }, [EmployeeID]);
  const threshold = getVehicleData.find((item) => item.vehicleID === VehicleID);
  const data = scraperPurchase.reduce((accumulator, current) => {
    return accumulator + Number(current.amountPaid);
  }, 0);

  const scrapPurchaseKg = scraperPurchase.reduce((accumulator, current) => {
    return accumulator + Number(current.purchase);
  }, 0);

  const scrapCarry = scraperPurchase.reduce((acc, item) => {
    return acc + Number(item.purchase);
  }, 0);
  const totalScrapCarry = Number(WeightLoadedKg) - Number(WeightEmptyKg);
  const lowestRateItem =
    scraperPurchase.length > 0
      ? scraperPurchase.reduce((lowest, current) =>
          Number(current.rate) < Number(lowest.rate) ? current : lowest,
        )
      : null;
  // Calculate Profit/Loss
  var poriftLoss = 0;
  if (totalScrapCarry < 0) {
    poriftLoss =
      (Number(totalScrapCarry) - Number(scrapCarry)) *
      Number(lowestRateItem?.rate ?? 0);
  } else if (totalScrapCarry > 0) {
    if (
      Number(totalScrapCarry) -
        Number(scrapCarry) -
        Number(threshold?.positiveThreshold) >
      0
    ) {
      poriftLoss =
        (Number(totalScrapCarry) -
          Number(scrapCarry) -
          (Number(totalScrapCarry) -
            Number(scrapCarry) -
            Number(threshold?.positiveThreshold))) *
        Number(lowestRateItem?.rate ?? 0);
    } else if (
      Number(totalScrapCarry) -
        Number(scrapCarry) -
        Number(threshold?.positiveThreshold) <
      0
    ) {
      poriftLoss =
        (Number(totalScrapCarry) - Number(scrapCarry)) *
        Number(lowestRateItem?.rate ?? 0);
    }
  }
  const total = Number(totalScrapCarry) - Number(scrapCarry);
  const totalExpense2 = FuelExpense.filter(
    (item) => item.paymentMode === "Cash",
  ).reduce((acc, item) => {
    return acc + Number(item.fuel) * Number(item.rate);
  }, 0);
  const totalTrip = TripExpense.filter(
    (item) =>
      (item.payby === "Company" && item.paymentMode === "Cash") ||
      (item.payby === "Employee" &&
        item.companyCash === true &&
        item.paymentMode === "Cash"),
  ).reduce((acc, item) => {
    return acc + Number(item.amount);
  }, 0);

  const fuelExpense = FuelExpense.filter(
    (item) => item.paymentMode === "Cash",
  ).reduce((sum, item) => {
    return sum + Number(item.rate) * Number(item.fuel);
  }, 0);
  const tripExpense = TripExpense.filter(
    (item) =>
      (item.payby === "Company" && item.paymentMode === "Cash") ||
      (item.payby == "Employee" &&
        item.paymentMode === "Cash" &&
        item.companyCash == true),
  ).reduce((sum, item) => {
    return sum + Number(item.amount);
  }, 0);
  var labourList = 0;
  if (IsActive) {
    labourList = LabourList.reduce((sum, item) => {
      return sum + Number(item.rate);
    }, 0);
  }
  const CustomerRecorveryAmount = CustomerRecovery.filter(
    (item2) => item2.paymentMode === "Cash",
  ).reduce((sum, item) => {
    return sum + Number(item.rate);
  }, 0);
  const SupplierPaidAmount = SupplierPayment.filter(
    (item2) => item2.paymentMode === "Cash",
  ).reduce((sum, item) => {
    return (
      sum +
      (item.paymentStatus === "Cash Paid"
        ? -Number(item.rate)
        : Number(item.rate))
    );
  }, 0);
  const totalExpense = totalExpense2 + totalTrip;

  const remanignCash =
    Number(AdvanceAmount) -
    Number(data) -
    Number(fuelExpense) -
    Number(labourList) -
    Number(tripExpense);
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
      setBankID(initalData.bankID);
      setBankName(initalData.bankName);
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
          expenseID: item.expenseID,
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
          companyCash: true,
          bankID: item.bankID || "0000",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Scrap / Amount Paid "
            value={scrapPurchaseKg + " kg / " + data.toLocaleString() + " PKR"}
            urduTitle="(کل سکریپ / ادا کردہ رقم)"
            icon=""
          />
          <StatsCard
            title="Weight Difference / Bonus-Loss"
            value={total.toLocaleString() + " kg" + " / " + poriftLoss + " PKR"}
            urduTitle="(بونس-نقصان / وزن کا فرق)"
            icon=""
          />
          <StatsCard
            title="Total Expense "
            value={totalExpense.toLocaleString()}
            urduTitle="(کل اخراجات)"
            icon=""
          />
          <StatsCard
            title="Remaining Cash"
            value={(isRemaningAmount
              ? remanignCash - Number(AmountReceived) + CustomerRecorveryAmount
              : remanignCash +
                CustomerRecorveryAmount +
                Number(SupplierPaidAmount)
            ).toLocaleString()}
            urduTitle="(بقیہ نقد رقم)"
            icon=""
          />
          <StatsCard
            title="Customer / Supplier Payments"
            value={
              CustomerRecorveryAmount.toLocaleString() +
              " PKR" +
              " / " +
              SupplierPaidAmount.toLocaleString() +
              " PKR"
            }
            urduTitle="(سپلائر / گاہک ادائیگیاں)"
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
                  label={`Employee (ملازم) - ${Salary.toLocaleString()}`}
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
              <div>
                <InputFieldGeneric
                  label="Rate / Kg ( قیمت / کلوگرام)"
                  type="number"
                  required={true}
                  placeholder="Enter Rate / Kg"
                  SateChange={RatePerKg}
                  setSateChange={setRatePerKg}
                  disabled={false}
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
              {PaymentMethod === "Bank" && (
                <div className="mt-2">
                  <DropDownList
                    label="Bank (بینک)"
                    required={true}
                    placeholder="Enter Bank"
                    filedID={setBankID}
                    options={getBankData.map((item) => ({
                      id: item.bankID,
                      label: item.accountTitle,
                      value: item.accountTitle,
                    }))}
                    value={BankName}
                    onChange={setBankName}
                  />
                </div>
              )}
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
                      {getSupplierData
                        .filter((item) => item.accountType === "Scrap Dealer")
                        .map((item) => (
                          <option key={item.supplierID} value={item.supplierID}>
                            {item.name}
                          </option>
                        ))}
                      {/* {getSupplierData.map((supplier) => (
                        <option
                          key={supplier.supplierID}
                          value={supplier.supplierID}
                        >
                          {supplier.name}
                        </option>
                      ))} */}
                    </select>
                    <div className="w-full">
                      <input
                        type="number"
                        value={item.purchase}
                        placeholder="KG"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                        onChange={(e) =>
                          updateData(index, "purchase", Number(e.target.value))
                        }
                      />
                      <p className="text-xs text-blue-400">
                        {toWords.convert(Number(item.purchase))}
                      </p>
                    </div>
                    <div className="w-full">
                      <input
                        type="number"
                        value={item.rate}
                        placeholder="Rate"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                        onChange={(e) =>
                          updateData(index, "rate", Number(e.target.value))
                        }
                      />
                      <p className="text-xs text-blue-400">
                        {toWords.convert(Number(item.rate))}
                      </p>
                    </div>
                    <div className="w-full">
                      <input
                        type="number"
                        value={item.amountPaid}
                        placeholder="Amount Paid"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                        onChange={(e) =>
                          updateData(
                            index,
                            "amountPaid",
                            Number(e.target.value),
                          )
                        }
                      />
                      <p className="text-xs text-blue-400">
                        {toWords.convert(Number(item.amountPaid) || 0)}
                      </p>
                    </div>
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
                      onChange={(e) => {
                        updateDataFuelExpense(
                          index,
                          "fuel",
                          Number(e.target.value),
                        );
                        const data = getExpenseData.find(
                          (item) => item.categoryName === "Fuel",
                        );
                        if (data) {
                          updateDataFuelExpense(index, "expenseID", data.expID);
                        }
                      }}
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
                      <option value="">Select Payment Mode</option>
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

                          {getSupplierData
                            .filter(
                              (item) => item.accountType !== "Scrap Dealer",
                            )
                            .map((supplier) => (
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
                      {getExpenseData
                        .filter(
                          (item) =>
                            item.expenseType === "M1 - Recycling" &&
                            item.categoryName !== "Fuel",
                        )
                        .map((item) => (
                          <option value={item.expID}>
                            {item.categoryName}
                          </option>
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
                      <option value={""}>Select Option</option>
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
                      <option value={""}>Select Payment</option>
                      <option value={"Cash"}>Cash</option>
                      <option value={"Bank"}>Bank</option>
                    </select>
                    {item.paymentMode === "Bank" && (
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                        value={item.bankID}
                        onChange={(e) => {
                          updateDataTripExpense(
                            index,
                            "bankID",
                            e.target.value,
                          );
                        }}
                      >
                        <option value={""}>Select Bank</option>
                        {getBankData.map((item) => (
                          <option value={item.bankID}>
                            {item.accountTitle}
                          </option>
                        ))}
                      </select>
                    )}
                    {item.payby === "Employee" && (
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.companyCash}
                            onChange={(e) => {
                              updateDataTripExpense(
                                index,
                                "companyCash",
                                e.target.checked,
                              );
                            }}
                            className="w-4 h-4 accent-neutral-900"
                          />

                          <span className="text-xs font-medium text-neutral-700">
                            Company Cash
                          </span>
                        </label>
                      </div>
                    )}
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
          {/*Labour List */}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <div className="w-full flex justify-between">
                <h1 className="text-gray-600 font-medium">Labour (مزدور)</h1>
                <button
                  title="Add Scraper Purchase"
                  className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                  onClick={addLabourList}
                >
                  +Add Row (قطار شامل کریں)
                </button>
              </div>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            {LabourList.length > 0 && (
              <div className="space-y-2">
                <div className="">
                  {" "}
                  <GenericCheckbox
                    label="Is Paid (نقد ادائیگی )"
                    checked={IsActive}
                    onChange={setIsActive}
                  />
                </div>
                {LabourList.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.employeeID}
                      onChange={(e) => {
                        const selectedSupplier = getEmplyeeData.find(
                          (s) => s.empID === e.target.value,
                        );

                        if (!selectedSupplier) return;

                        setLabourList((prev) =>
                          prev.map((row, i) =>
                            i === index
                              ? {
                                  ...row,
                                  employeeID: selectedSupplier.empID,
                                  employeeName: selectedSupplier.name,
                                }
                              : row,
                          ),
                        );
                      }}
                    >
                      <option value="">Select Employee</option>
                      {getEmplyeeData.map((item) => (
                        <option key={item.empID} value={item.empID}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <div className="w-full ">
                      <input
                        type="number"
                        value={item.rate}
                        placeholder="Rate"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                        onChange={(e) => {
                          setLabourList((prev) =>
                            prev.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    rate: Number(e.target.value),
                                  }
                                : row,
                            ),
                          );
                        }}
                      />
                      <p className="text-xs text-blue-400">
                        {toWords.convert(Number(item.rate))}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setLabourList((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
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
          {/*Supplier Payment*/}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <div className="w-full flex justify-between">
                <h1 className="text-gray-600 font-medium">
                  Supplier Payment (سپلائر کی ادائیگی)
                </h1>
                <button
                  title="Add Scraper Purchase"
                  className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                  onClick={addSupplierPayment}
                >
                  +Add Row (قطار شامل کریں)
                </button>
              </div>
              <hr className="border-gray-300 mt-1 w-full" />
              {SupplierPayment.length > 0 && (
                <div className="mt-2">
                  {SupplierPayment.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                        value={item.supplierID}
                        onChange={(e) => {
                          const selectedSupplier = getSupplierData.find(
                            (s) => s.supplierID === e.target.value,
                          );

                          if (!selectedSupplier) return;

                          setSupplierPayment((prev) =>
                            prev.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    supplierID: selectedSupplier.supplierID,
                                  }
                                : row,
                            ),
                          );
                        }}
                      >
                        <option value="">Select Supplier</option>
                        {getSupplierData.map((item) => (
                          <option key={item.supplierID} value={item.supplierID}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                        value={item.paymentMode}
                        onChange={(e) => {
                          setSupplierPayment((prev) =>
                            prev.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    paymentMode: e.target.value,
                                  }
                                : row,
                            ),
                          );
                        }}
                      >
                        <option value={""}>Select Payment</option>
                        <option value={"Cash"}>Cash</option>
                        <option value={"Bank"}>Bank</option>
                      </select>
                      {item.paymentMode === "Bank" && (
                        <select
                          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                          value={item.bankID}
                          onChange={(e) => {
                            setSupplierPayment((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? {
                                      ...row,
                                      bankID: e.target.value,
                                    }
                                  : row,
                              ),
                            );
                          }}
                        >
                          <option value={""}>Select Bank</option>
                          {getBankData.map((item) => (
                            <option value={item.bankID}>
                              {item.accountTitle}
                            </option>
                          ))}
                        </select>
                      )}
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                        value={item.paymentStatus}
                        onChange={(e) => {
                          setSupplierPayment((prev) =>
                            prev.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    paymentStatus: e.target.value,
                                  }
                                : row,
                            ),
                          );
                        }}
                      >
                        <option value="">Select Payment</option>
                        <option value="Cash Recieved">Cash Recieved</option>
                        <option value="Cash Paid">Cash Paid</option>
                      </select>
                      <div className="w-full ">
                        <input
                          type="number"
                          value={item.rate}
                          placeholder={`${item.paymentStatus === "Cash Paid" ? "Paid " : "Recieved "}Amount`}
                          className="w-full px-4 py-2 mt-3 rounded-lg border border-neutral-200 shadow-sm"
                          onChange={(e) => {
                            setSupplierPayment((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? {
                                      ...row,
                                      rate: e.target.value,
                                    }
                                  : row,
                              ),
                            );
                          }}
                        />
                        <p className="text-xs text-blue-400">
                          {toWords.convert(Number(item.rate))}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setSupplierPayment((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
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
          </div>
          {/*Customer Recovery*/}
          <div className="mt-8">
            <div className="mt-4 mb-2">
              <div className="w-full flex justify-between">
                <h1 className="text-gray-600 font-medium">
                  Customer Recovery (گاہک کی بحالی)
                </h1>
                <button
                  title="Add Scraper Purchase"
                  className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                  onClick={addCustomerRecovery}
                >
                  +Add Row (قطار شامل کریں)
                </button>
              </div>
              <hr className="border-gray-300 mt-1 w-full" />
            </div>
            {CustomerRecovery.length > 0 && (
              <div className="mt-2">
                {CustomerRecovery.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.customerID}
                      onChange={(e) => {
                        const selectedSupplier = GetCustomerData.find(
                          (s) => s.customerID === e.target.value,
                        );

                        if (!selectedSupplier) return;

                        setCustomerRecovery((prev) =>
                          prev.map((row, i) =>
                            i === index
                              ? {
                                  ...row,
                                  customerID: selectedSupplier.customerID,
                                }
                              : row,
                          ),
                        );
                      }}
                    >
                      <option value="">Select Customer</option>
                      {GetCustomerData.map((item) => (
                        <option key={item.customerID} value={item.customerID}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                      value={item.paymentMode}
                      onChange={(e) => {
                        setCustomerRecovery((prev) =>
                          prev.map((row, i) =>
                            i === index
                              ? {
                                  ...row,
                                  paymentMode: e.target.value,
                                }
                              : row,
                          ),
                        );
                      }}
                    >
                      <option value={""}>Select Payment</option>
                      <option value={"Cash"}>Cash</option>
                      <option value={"Bank"}>Bank</option>
                    </select>
                    {item.paymentMode === "Bank" && (
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                        value={item.bankID}
                        onChange={(e) => {
                          setCustomerRecovery((prev) =>
                            prev.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    bankID: e.target.value,
                                  }
                                : row,
                            ),
                          );
                        }}
                      >
                        <option value={""}>Select Bank</option>
                        {getBankData.map((item) => (
                          <option value={item.bankID}>
                            {item.accountTitle}
                          </option>
                        ))}
                      </select>
                    )}
                    <div className="w-full ">
                      <input
                        type="number"
                        value={item.rate}
                        placeholder="Rate"
                        className="w-full px-4 py-2 mt-3 rounded-lg border border-neutral-200 shadow-sm"
                        onChange={(e) => {
                          setCustomerRecovery((prev) =>
                            prev.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    rate: e.target.value,
                                  }
                                : row,
                            ),
                          );
                        }}
                      />
                      <p className="text-xs text-blue-400">
                        {toWords.convert(Number(item.rate))}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setCustomerRecovery((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
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
          <div className="space-y-2">
            <div className="">
              {" "}
              <GenericCheckbox
                label="Is Remaning (بقیہ رقم)"
                checked={isRemaningAmount}
                onChange={setisRemaningAmount}
              />
            </div>
            {isRemaningAmount && (
              <div>
                <InputFieldGeneric
                  label="Amount Received (موصول شدہ رقم)"
                  type="number"
                  required={true}
                  placeholder="Enter Amount Received"
                  SateChange={AmountReceived}
                  setSateChange={setAmountReceived}
                  disabled={false}
                />
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
