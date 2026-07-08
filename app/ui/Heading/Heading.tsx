import { Plus } from "lucide-react";

interface Heading {
  heading: string;
  subHeading: string;
  onClick: () => void;
}

export default function Heading({ heading, subHeading, onClick }: Heading) {
  return (
    <>
      <div className="w-full flex  justify-between">
        <div className="flex flex-col">
          <h1 className="font-medium">{heading}</h1>
          <p className="font-medium text-sm ">{subHeading}</p>
        </div>
        <div>
          <button
            onClick={onClick}
            className="flex gap-2  rounded-md shadow-sm px-3 py-2 border border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <Plus className="w-4 h-4 mt-1" /> Add (شامل کریں)
          </button>
        </div>
      </div>
      <div className="border-b border-gray-200 w-full mt-3" />
    </>
  );
}
