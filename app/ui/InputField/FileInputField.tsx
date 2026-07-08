interface GenericFileInputProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

export default function FileInputGeneric({
  label,
  required = false,
  disabled = false,
  onFileChange,
}: GenericFileInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2 mt-2">
        {label}
        {required && <span className="text-red-600 text-lg ml-1">*</span>}
      </label>

      <input
        type="file"
        disabled={disabled}
        accept="image/*"
        onChange={(e) => {
          onFileChange(e.target.files?.[0] || null);
        }}
        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
      />
    </div>
  );
}
