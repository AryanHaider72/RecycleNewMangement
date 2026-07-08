// components/ProductSkeleton.tsx
export default function ProductSkeleton() {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
        <div className="w-full h-full bg-gray-200"></div>

        {/* Badge Skeletons */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="h-5 w-12 bg-gray-300 rounded-md"></div>
        </div>

        {/* Icon Skeletons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}
