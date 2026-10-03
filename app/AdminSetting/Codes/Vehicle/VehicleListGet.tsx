import { VehicleList } from "@/app/api/Types/Codes/Vehicle/Vehicle";
import DropDownList from "@/app/ui/DropDown/DropDown";
import InputFieldGeneric from "@/app/ui/InputField/InputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";
interface VehicleModifyProps {
  setgetVehicleDataForList: VehicleList[];
  initalData: (data: VehicleList) => void;
  setIsLoading: boolean;
}
export default function VehicleGetList({
  initalData,
  setgetVehicleDataForList,
  setIsLoading,
}: VehicleModifyProps) {
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [GenderName, setGenderName] = useState("");
  const [GenderID, setGenderID] = useState<string | null>(null);
  const [getVehicleData, setgetVehicleData] = useState<VehicleList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (setgetVehicleDataForList || setIsLoading) {
      setisLoading(setIsLoading);
      setgetVehicleData(setgetVehicleDataForList);
    }
  }, [setgetVehicleDataForList, setIsLoading]);

  const GenderList = [
    { ID: "1", label: "Own" },
    { ID: "2", label: "OutSource" },
  ];
  const header = [
    "#",
    "Vehicle No",
    "Start Meter Reading",
    "positive-Threshold",
    "Carry-Threshold",
    "Scrap-Rate/KG",
    "Bottle-Rate/Pcs",
    "Investment",
    "OwnerShip",
    "Action",
  ];

  const assignData = (ID: string) => {
    const data = getVehicleData.find((item) => item.vehicleID === ID);
    if (data) {
      initalData(data);
    }
  };

  const filterData = getVehicleData.filter((emp) => {
    return (
      emp?.vehicleNo.toLowerCase().includes(SearchEmployee.toLowerCase()) &&
      emp?.ownerShip.toLowerCase().includes(GenderName.toLowerCase())
    );
  });
  return (
    <>
      <div>
        <div className="w-1/2 flex gap-2">
          <div>
            <InputFieldGeneric
              label=""
              type="text"
              required={false}
              placeholder="Search By Vehicle No"
              SateChange={SearchEmployee}
              setSateChange={setSearchEmployee}
              disabled={false}
            />
          </div>
          <div className="">
            <DropDownList
              label=""
              placeholder="Search By OwnerShip"
              required={true}
              filedID={setGenderID}
              value={GenderName}
              onChange={setGenderName}
              options={GenderList.map((item) => ({
                label: item.label,
                value: item.label,
                id: item.ID,
              }))}
            />
          </div>
        </div>
        <table className="w-full  bg-white border-collapse border border-gray-300 rounded-lg  shadow-lg mt-2">
          <thead className="bg-gray-100">
            <tr className="sticky top-0 bg-white z-10">
              {header.map((heading) => (
                <th
                  key={heading}
                  className=" px-4 py-3 text-left text-sm font-semibold uppercase border-b border-gray-300"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {isloading ? (
              <tr>
                <td colSpan={10} className="py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <>
                {filterData.length === 0 ? (
                  <>
                    <tr>
                      <td colSpan={10} className="py-10 text-center">
                        <span className="text-lg font-semibold text-gray-500">
                          No Record Found
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  filterData.map((employee, index) => (
                    <tr key={employee.vehicleID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{employee.vehicleNo}</td>
                      <td className="px-4 py-3">
                        {employee.openingMeterReading.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.positiveThreshold.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.scrapCarryThreshold.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.scrapRatePerKG.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.bottleRatePerPcs.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {employee.openingInvestment.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{employee.ownerShip}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => assignData(employee.vehicleID)}
                          className="px-3 py-1 border rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
