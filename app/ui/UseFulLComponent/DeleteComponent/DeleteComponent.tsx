"use client";

interface DeleteComponentProps {
  onCancel: () => void;
  onConfirm: (reason?: string) => void;
}

export default function DeleteComponent({
  onCancel,
  onConfirm,
}: DeleteComponentProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800">
          Delete Confirmation
        </h2>

        <p className="text-gray-500 mt-2">
          Are you sure you want to delete this record? <br />
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
