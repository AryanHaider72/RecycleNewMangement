import { MoreHorizontal, Plus } from "lucide-react";

interface Heading {
  heading: string;
  subHeading: string;
  onClick: () => void;
  disable?: boolean;
}

export default function Heading({
  heading,
  subHeading,
  onClick,
  disable,
}: Heading) {
  return (
    <>
      <div className="w-full flex  justify-between">
        <div className="flex flex-col">
          <h1 className="font-medium">{heading}</h1>
          <p className="font-medium text-sm ">{subHeading}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClick}
            className={`flex gap-2 ${disable ? "text-gray-500 border border-gray-200 bg-gray-100 cursor-not-allowed" : "border border-gray-200 hover:bg-gray-100 cursor-pointer"}  rounded-md shadow-sm px-3 py-2  `}
          >
            <Plus className="w-4 h-4 mt-1" /> Add (شامل کریں)
          </button>
        </div>
      </div>
      <div className="border-b border-gray-200 w-full mt-3" />
    </>
  );
}
