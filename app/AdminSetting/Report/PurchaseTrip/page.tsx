"use client";
import Heading from "@/app/ui/Heading/Heading";
import SecondTripDetailReport from "./SecondCopyTriDetail";

export default function PurchaseTrip() {
  const onclick = () => {
    return;
  };
  return (
    <>
      <div className="">
        <Heading
          heading="Purchase Trip (خریداری ٹرپ)"
          subHeading="(ٹرپ کی رپورٹ)"
          onClick={onclick}
          disable={true}
        />
        {/* <div className="mt-2 mb-2 "></div> */}
        <SecondTripDetailReport />
      </div>
    </>
  );
}
