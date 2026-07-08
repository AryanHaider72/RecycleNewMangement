"use client";
import Heading from "@/app/ui/Heading/Heading";
import { Plus } from "lucide-react";
import EmployeeGetList from "./EmployeeGetList";

export default function EmployeeManagement() {
  const eventTrigger = () => {};
  return (
    <>
      <div className="">
        <Heading
          heading="Employees (ملازمین)"
          subHeading="(تمام ملازمین)"
          onClick={eventTrigger}
        />
        <div className="mt-8">
          <EmployeeGetList />
        </div>
      </div>
    </>
  );
}
