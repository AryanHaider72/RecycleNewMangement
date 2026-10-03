import BankGetApi from "@/app/api/Controller/Codes/Bank/GetBank";
import GetEmployeeApi from "@/app/api/Controller/Codes/Employee/GetEmployeeApi";
import AddEmployeeLedgerApi from "@/app/api/Controller/Ledger/Employee/AddEmployeeLedger";
import { BankList, responseBankListGet } from "@/app/api/Types/Codes/Bank/Bank";
import {
  employeeList,
  responseEmployeeListGet,
} from "@/app/api/Types/Codes/Employee/Employee";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import { useEffect, useRef, useState } from "react";
interface props {
  setValue: (data: boolean) => void;
}
export default function EmployeeLoanComonent({ setValue }: props) {
  const hasFetchedEmployees = useRef(false);
  const [postingDate, setpostingDate] = useState("");
  const [Amount, setAmount] = useState("");
  const [moduleID, setModuleID] = useState("");
  const [Module, setModule] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [PaymentTypeID, setPaymentTypeID] = useState("");
  const [PaymentType, setPaymentType] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [BankID, setBankID] = useState("");
  const [BankName, setBankName] = useState("");
  const [getBankData, setgetBankData] = useState<BankList[]>([]);
  const [moduleList, setModuleList] = useState<employeeList[]>([]);

  const paymentType = [
    // { ID: "1", label: "Bonus" },
    // { ID: "2", label: "Loss" },
    // { ID: "3", label: "Salary" },
    { ID: "4", label: "Loan" },
    // { ID: "5", label: "Loan Return" },
    // { ID: "6", label: "Salary(KG)" },
    // { ID: "7", label: "Trip Return" },
    // { ID: "8", label: "Driver Payment" },
    // { ID: "9", label: "Company Payment" },
    // { ID: "10", label: "Labour Payment" },
  ];

  const paymentMethodList = [
    { ID: "1", label: "Cash" },
    { ID: "2", label: "Bank" },
  ];
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

  useEffect(() => {
    if (hasFetchedEmployees.current) return;

    hasFetchedEmployees.current = true;
    EmployeeGet();
    BankGet();
  }, []);
  const EmployeeAdd = async () => {
    try {
      setLoading(true);
      if (!moduleID || !postingDate || !Amount)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          empID: moduleID,
          postingDate: postingDate,
          amount: Number(Amount),
          paymentMode: PaymentMethod,
          paymentType: PaymentType,
          bankID:
            PaymentMethod === "Cash"
              ? "00000000-0000-0000-0000-000000000000"
              : BankID,
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await AddEmployeeLedgerApi(formData, String(token));
        if (response.status == 200) {
          setValue(false);
        } else {
          console.log(response);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="">
        {/* Two Column Grid with proper spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Name - Column 1 */}

          {/* Department - Column 2 */}
          <div className="">
            <DropDownList
              label="Employee (ملازم)"
              required={true}
              placeholder="Enter Employee"
              filedID={setModuleID}
              options={moduleList.map((item) => ({
                id: item.empID,
                label: item.name,
                value: item.name,
              }))}
              value={Module}
              onChange={setModule}
            />
          </div>

          {/* Address - Full Width (both columns) */}
          <div className="">
            <InputFieldGeneric
              label="Posting Date (تاریخ)"
              type="date"
              required={false}
              placeholder="Enter Address"
              SateChange={postingDate}
              setSateChange={setpostingDate}
              disabled={false}
            />
          </div>
          <div className="">
            <DropDownList
              label="Payment Type (ادائیگی کی قسم)"
              required={true}
              placeholder="Enter Payment Type"
              filedID={setPaymentTypeID}
              options={paymentType.map((item) => ({
                id: item.ID,
                label: item.label,
                value: item.label,
              }))}
              value={PaymentType}
              onChange={setPaymentType}
            />
          </div>
          <div className="">
            <DropDownList
              label="Payment Method (ادائیگی کا طریقہ)"
              required={true}
              placeholder="Enter Payment Method"
              filedID={setPaymentTypeID}
              options={paymentMethodList.map((item) => ({
                id: item.ID,
                label: item.label,
                value: item.label,
              }))}
              value={PaymentMethod}
              onChange={setPaymentMethod}
            />
          </div>
          {PaymentMethod === "Bank" && (
            <div className="">
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

          {/* Amount - Full Width (both columns) */}
          <div className="">
            <InputFieldGeneric
              label="Amount (قیمت)"
              type="number"
              required={true}
              placeholder="Enter Amount"
              SateChange={Amount}
              setSateChange={setAmount}
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
            text={update ? "Update (اپ ڈیٹ)" : "Add Record (شامل کریں)"}
            update={loading}
            loading={loading}
            size={"w-full"}
            loadingtext={update ? "Updating..." : "Adding Record..."}
            onClick={() => EmployeeAdd()}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
}
