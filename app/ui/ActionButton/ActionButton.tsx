interface PrimaryButtonProps {
  text: string;
  update?: boolean;
  loading?: boolean;
  size?: boolean;
  loadingtext: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ActionButton({
  text,
  update,
  loading,
  loadingtext,
  size,
  onClick,
  disabled,
}: PrimaryButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`px-6 py-2 ${size ? "w-full" : ""} rounded-xl bg-blue-700 text-white font-medium hover:bg-blue-800 transition shadow-lg`}
      >
        {update ? loadingtext : text}
      </button>
    </>
  );
}
