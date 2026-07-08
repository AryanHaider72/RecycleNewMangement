interface GenericInputProps {
  label?: string;
  placeholder?: string;
  setSateChange: (data: string) => void;
  SateChange: string;
  required: boolean;
  disabled?: boolean;
}

export default function TextAreaFieldGeneric({
  label,
  placeholder,
  setSateChange,
  required = false,
  SateChange,
  disabled = false,
}: GenericInputProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 mt-2">
          {label}
          {required && <span className="text-red-600 text-lg ml-1">*</span>}
        </label>
        <textarea
          value={SateChange}
          onChange={(e) => setSateChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
