import { purchaseTripList } from "@/app/api/Types/module1/purchaseTrip";

interface DetailsProps {
  data?: purchaseTripList;
}
export default function DetailSupplierData({ data }: DetailsProps) {
  const header = [
    "Supplier (سپلائر)",
    "KG (کلوگرام)",
    "Rate (Rate)",
    "Total (کل)",
    "Paid (ادائیگی )",
    "Credit  (بقیہ)",
  ];
  const header2 = ["Labour (مزدور)", "Labour Paid", "Labour Due"];
  const header3 = [
    "Supplier (سپلائر)",
    "Cash Paid",
    "Cash Received",
    "Notes (نوٹس)",
  ];
  const header4 = ["Customer (گاہک)", "Rate (قیمت)", "Notes (نوٹس)"];
  const supplier = data?.scrapPurchase;
  const labour = data?.labourList;
  const supplierPayemtn = data?.supplierPayments;
  const customerPayment = data?.customerRecovery;
  return (
    <>
      <h1 className="font-medium text-gray-800">Scrap Purchase</h1>
      <table className="w-full  bg-white border-collapse border border-gray-300 rounded-lg  shadow-md mt-2">
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
          <>
            {supplier?.length === 0 ? (
              <>
                <tr>
                  <td colSpan={9} className="py-10 text-center">
                    <span className="text-lg font-semibold text-gray-500">
                      No Record Found
                    </span>
                  </td>
                </tr>
              </>
            ) : (
              supplier?.map((employee, index) => (
                <tr key={employee.scrapID} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{employee.supplierName}</td>
                  <td className="px-4 py-3">{employee.purchaseKg}</td>
                  <td className="px-4 py-3">{employee.purchasedRate}</td>
                  <td className="px-4 py-3">
                    {employee.purchasedRate * employee.purchaseKg}
                  </td>
                  <td className="px-4 py-3">{employee.amountPaid}</td>

                  <td className="px-4 py-3">
                    {employee.purchasedRate * employee.purchaseKg -
                      employee.amountPaid}
                  </td>
                </tr>
              ))
            )}
          </>
        </tbody>
      </table>
      <h1 className="font-medium text-gray-800 mt-2">Labour Cost</h1>
      <table className="w-full  bg-white border-collapse border border-gray-300 rounded-lg  shadow-md mt-2">
        <thead className="bg-gray-100">
          <tr className="sticky top-0 bg-white z-10">
            {header2.map((heading) => (
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
          <>
            {labour?.length === 0 ? (
              <>
                <tr>
                  <td colSpan={9} className="py-10 text-center">
                    <span className="text-lg font-semibold text-gray-500">
                      No Record Found
                    </span>
                  </td>
                </tr>
              </>
            ) : (
              labour?.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{employee.labourName}</td>
                  <td className="px-4 py-3">{employee.labourPaid}</td>
                  <td className="px-4 py-3">{employee.labourDue}</td>
                </tr>
              ))
            )}
          </>
        </tbody>
      </table>
      <h1 className="font-medium text-gray-800 mt-2">Supplier Payment</h1>
      <table className="w-full  bg-white border-collapse border border-gray-300 rounded-lg  shadow-md mt-2">
        <thead className="bg-gray-100">
          <tr className="sticky top-0 bg-white z-10">
            {header3.map((heading) => (
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
          <>
            {supplierPayemtn?.length === 0 ? (
              <>
                <tr>
                  <td colSpan={9} className="py-10 text-center">
                    <span className="text-lg font-semibold text-gray-500">
                      No Record Found
                    </span>
                  </td>
                </tr>
              </>
            ) : (
              supplierPayemtn?.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{employee.supplierName}</td>
                  <td className="px-4 py-3">{employee.amountCredit}</td>
                  <td className="px-4 py-3">{employee.amountDebit}</td>
                  <td className="px-4 py-3">{employee.remarks}</td>
                </tr>
              ))
            )}
          </>
        </tbody>
      </table>
      <h1 className="font-medium text-gray-800 mt-2">Customer Recovery</h1>
      <table className="w-full  bg-white border-collapse border border-gray-300 rounded-lg  shadow-md mt-2">
        <thead className="bg-gray-100">
          <tr className="sticky top-0 bg-white z-10">
            {header4.map((heading) => (
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
          <>
            {customerPayment?.length === 0 ? (
              <>
                <tr>
                  <td colSpan={9} className="py-10 text-center">
                    <span className="text-lg font-semibold text-gray-500">
                      No Record Found
                    </span>
                  </td>
                </tr>
              </>
            ) : (
              customerPayment?.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{employee.customerName}</td>
                  <td className="px-4 py-3">{employee.amount}</td>
                  <td className="px-4 py-3">{employee.remarks}</td>
                </tr>
              ))
            )}
          </>
        </tbody>
      </table>
      {/* <table className="w-full  bg-white border-collapse border border-gray-300 rounded-lg  shadow-lg mt-2">
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
          <>
            {supplier?.length === 0 ? (
              <>
                <tr>
                  <td colSpan={9} className="py-10 text-center">
                    <span className="text-lg font-semibold text-gray-500">
                      No Record Found
                    </span>
                  </td>
                </tr>
              </>
            ) : (
              supplier?.map((employee, index) => (
                <tr key={employee.scrapID} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{employee.supplierName}</td>
                  <td className="px-4 py-3">{employee.purchaseKg}</td>
                  <td className="px-4 py-3">{employee.purchasedRate}</td>
                  <td className="px-4 py-3">
                    {employee.purchasedRate * employee.purchaseKg}
                  </td>
                  <td className="px-4 py-3">{employee.amountPaid}</td>

                  <td className="px-4 py-3">
                    {employee.purchasedRate * employee.purchaseKg -
                      employee.amountPaid}
                  </td>
                </tr>
              ))
            )}
          </>
        </tbody>
      </table> */}
    </>
  );
}
