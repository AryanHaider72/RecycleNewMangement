"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

interface MessagePopUpProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

export default function MessagePopUp({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: MessagePopUpProps) {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
  };

  const colors = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-sky-500",
    warning: "bg-amber-500",
  };

  const textColors = {
    success: "text-emerald-600",
    error: "text-rose-600",
    info: "text-sky-600",
    warning: "text-amber-600",
  };

  useEffect(() => {
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose?.(), 200);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center">
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 bg-black/10 backdrop-blur-sm transition-all duration-300
          ${isExiting ? "opacity-0" : "opacity-100"}`}
        onClick={handleClose}
      />

      {/* Confirmation Box */}
      <div
        className={`
          relative top-8 w-96 max-w-full mx-4
          bg-white rounded-2xl shadow-2xl
          transform transition-all duration-300 ease-out
          ${
            isExiting
              ? "opacity-0 -translate-y-4 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }
        `}
      >
        {/* Icon Section */}
        <div className="p-6 pb-4 flex flex-col items-center">
          <div className={`mb-4 ${textColors[type]}`}>{icons[type]}</div>

          {/* Message */}
          <p className="text-lg text-gray-800 font-semibold text-center">
            {message}
          </p>

          {/* Optional subtitle */}
          <p className="text-sm text-gray-500 mt-2 text-center">
            Click anywhere outside to close
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-6">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors[type]} transition-all duration-50 ease-linear rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleClose}
            className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all
              ${
                type === "success"
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : type === "error"
                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : type === "info"
                      ? "bg-sky-50 text-sky-700 hover:bg-sky-100"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
