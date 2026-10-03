"use client";
import Heading from "@/app/ui/Heading/Heading";
import CashInOutFlowDetailReport from "./CashinOutDetailReport";

export default function ExpensReport() {
  const onclick = () => {
    return;
  };
  return (
    <>
      <div>
        <Heading
          heading="All Expense (تمام اخراجات)"
          subHeading="(تمام اخراجات)"
          onClick={onclick}
          disable={true}
        />
        <div className="w-full">
          <CashInOutFlowDetailReport />
          {/* <ExpenseReportDetail /> */}
        </div>
      </div>
    </>
  );
}
