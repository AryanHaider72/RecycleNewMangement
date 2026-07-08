// components/GenericRadio.tsx

interface RadioProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function GenericRadio({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
}: RadioProps) {
  return (
    <label
      className={`flex items-center gap-1 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="w-4 h-4 accent-neutral-900"
      />

      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </label>
  );
}
