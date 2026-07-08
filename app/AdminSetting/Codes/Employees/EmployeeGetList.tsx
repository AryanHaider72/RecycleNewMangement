import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import TableComponent from "@/app/ui/Table/Table";
import { useState } from "react";

export default function EmployeeGetList() {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const GenderList = [
    { id: "1", label: "Male", value: "Male" },
    { id: "2", label: "Female", value: "Female" },
    { id: "3", label: "Rather Not Say", value: "Rather Not Say" },
  ];
  return (
    <>
      <div>
        <div className="w-1/2 flex gap-2">
          <div>
            <InputFieldGeneric
              label=""
              type="text"
              required={false}
              placeholder="Enter Name/Phone/CNIC..."
              SateChange={SearchEmployee}
              setSateChange={setSearchEmployee}
              disabled={false}
            />
          </div>
          <div className="mt-2">
            <DropDownList
              label=""
              placeholder="Enter All Modules"
              required={true}
              filedID={setGenderID}
              value={GenderName}
              onChange={setGenderName}
              options={GenderList.map((item) => ({
                label: item.label,
                value: item.value,
                id: item.id,
              }))}
            />
          </div>
        </div>
        <TableComponent />
      </div>
    </>
  );
}
