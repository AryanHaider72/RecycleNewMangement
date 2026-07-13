import { X } from "lucide-react";
import { ReactNode } from "react";

interface PopupEvnetTrigger {
  onClick: () => void;
  title: string;
  children: ReactNode;
}

export default function PopupComponent({
  onClick,
  children,
  title,
}: PopupEvnetTrigger) {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between py-1 border-b border-gray-300 flex-shrink-0">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {title}
              </h2>
            </div>
            <button
              onClick={onClick}
              title="Close"
              className="text-muted-foreground hover:text-red-500 cursor-pointer p-1 rounded-lg hover:bg-accent"
            >
              <X />
            </button>
          </div>

          {/* Content - Scrollable with hidden scrollbar */}
          <div className="px-2 py-2 overflow-y-auto flex-1 hide-scrollbar">
            {children}
          </div>
        </div>
      </div>

      {/* CSS to hide scrollbar */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </>
  );
}
