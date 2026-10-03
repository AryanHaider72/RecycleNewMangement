interface GenericInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  setSateChange: (data: string) => void;
  SateChange: string;
  required: boolean;
  disabled?: boolean;
  readonly?: boolean;
}
import { ToWords } from "to-words";
const toWords = new ToWords();

export default function InputFieldGeneric({
  label,
  type = "text",
  placeholder,
  setSateChange,
  required = false,
  SateChange,
  disabled = false,
  readonly,
}: GenericInputProps) {
  const words =
    type === "number" && SateChange !== "" && !isNaN(Number(SateChange))
      ? toWords.convert(Number(SateChange))
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // If it's a number input, only allow valid numeric values
    if (type === "number") {
      // Allow empty string (so user can clear the field)
      if (value === "") {
        setSateChange(value);
        return;
      }

      // Reject anything that isn't a valid number
      if (isNaN(Number(value))) {
        return; // block the input
      }
    }

    setSateChange(value);
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700 ">
          {label}
          {required && <span className="text-red-600 text-lg ml-1">*</span>}
        </label>
        <input
          type={type}
          value={SateChange}
          readOnly={readonly}
          disabled={disabled}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
          placeholder={placeholder}
        />
        {words && <p className="text-xs text-blue-400">{words}</p>}
      </div>
    </>
  );
}
