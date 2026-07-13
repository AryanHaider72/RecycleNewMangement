interface PrimaryButtonProps {
  text: string;
  update?: boolean;
  loading?: boolean;
  size?: string;
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
        className={` relative flex w-full border border-gray-200 cursor-pointer  justify-center rounded-lg  px-4 py-3 text-sm font-semibold text-black shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 hover:bg-gray-900 hover:text-white`}
      >
        {update ? loadingtext : text}
      </button>
    </>
  );
}
