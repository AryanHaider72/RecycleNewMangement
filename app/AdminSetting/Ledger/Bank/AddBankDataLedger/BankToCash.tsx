import AddBankLedgerApi from "@/app/api/Controller/Ledger/Bank/AddBankLedger";
import { BankList } from "@/app/api/Types/Codes/Bank/Bank";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/TextArea";
import { useState } from "react";
interface BanktoCashProps {
  bankList: BankList[];
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function BanktoCash({
  bankList,
  onShowMessage,
}: BanktoCashProps) {
  const [BankID, setBankID] = useState("");
  const [BankName, setBankName] = useState("");
  const [postingDate, setpostingDate] = useState("");
  const [Amount, setAmount] = useState("");
  const [Notes, setNotes] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const EmployeeAdd = async () => {
    try {
      setLoading(true);
      if (!BankID || !postingDate || !Amount)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          bankFromID: BankID,
          transactionType: "banktocash",
          bankToID: "",
          postingDate: postingDate,
          amount: Number(Amount),
          remarks: Notes,
        };
        const token = localStorage.getItem("adminToken");
        const response = await AddBankLedgerApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");
        } else {
          onShowMessage(response.data.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  //   const EmployeeModify = async () => {
  //     try {
  //       setLoading(true);
  //       if (!moduleID || !postingDate || !Amount || !ID)
  //         return alert("Please Fill in Filed with *");
  //       else {
  //         const formData = {
  //           ledgerID: ID,
  //           bankID: moduleID,
  //           postingDate: postingDate,
  //           amount: Number(Amount),
  //           remarks: Notes,
  //         };
  //         const token = localStorage.getItem("adminToken");
  //         const response = await ModifyBankLedgerApi(formData, String(token));
  //         if (response.status == 200) {
  //           setMessageType("success");
  //           setShowMessage(response.data.message);
  //           resetFunction();
  //           setShowForm(false);
  //           click();
  //         } else {
  //           setMessageType("error");
  //           setShowMessage(response.data.message);
  //         }
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
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
            label="Bank (بینک)"
            required={true}
            placeholder="Enter Bank"
            filedID={setBankID}
            options={bankList.map((item) => ({
              id: item.bankID,
              label: item.accountTitle,
              value: item.accountTitle,
            }))}
            value={BankName}
            onChange={setBankName}
          />
        </div>

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
          text={update ? "Update (اپ ڈیٹ)" : "Add Ledger (شامل کریں)"}
          update={false}
          loading={loading}
          size={"w-full"}
          loadingtext={update ? "Updating..." : "Adding Ledger..."}
          onClick={() => EmployeeAdd()}
          disabled={false}
        />
      </div>
    </>
  );
}
