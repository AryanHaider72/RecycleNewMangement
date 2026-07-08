export default function TableComponent() {
  return (
    <>
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-lg mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              NAME
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              DEPT
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              WAGES TYPES (اجرت کی اقسام)
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              CNIC
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              PHONE (فون)
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              SALARY (تنخواہ)
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              STATUS (حیثیت)
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-300">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm ">Aslam</td>
            <td className="px-4 py-3 text-sm ">M1</td>
            <td className="px-4 py-3 text-sm ">Permanent</td>
            <td className="px-4 py-3 text-sm ">123</td>
            <td className="px-4 py-3 text-sm ">1312342</td>
            <td className="px-4 py-3 text-sm ">1,00,000</td>
            <td className="px-4 py-3 text-sm ">Active</td>
            <td className="px-4 py-3 text-sm">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                Edit
              </button>
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm ">Aslam</td>
            <td className="px-4 py-3 text-sm ">M1</td>
            <td className="px-4 py-3 text-sm ">Permanent</td>
            <td className="px-4 py-3 text-sm ">123</td>
            <td className="px-4 py-3 text-sm ">1312342</td>
            <td className="px-4 py-3 text-sm ">1,00,000</td>
            <td className="px-4 py-3 text-sm ">Active</td>
            <td className="px-4 py-3 text-sm">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                Edit
              </button>
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm ">Aslam</td>
            <td className="px-4 py-3 text-sm ">M1</td>
            <td className="px-4 py-3 text-sm ">Permanent</td>
            <td className="px-4 py-3 text-sm ">123</td>
            <td className="px-4 py-3 text-sm ">1312342</td>
            <td className="px-4 py-3 text-sm ">1,00,000</td>
            <td className="px-4 py-3 text-sm ">Active</td>
            <td className="px-4 py-3 text-sm">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
