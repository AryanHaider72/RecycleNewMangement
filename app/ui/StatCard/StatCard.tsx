interface StatsCardDesing {
  title: string;
  value: string;
  urduTitle: string;
  icon: string;
}
export default function StatsCard({
  title,
  value,
  urduTitle,
  icon,
}: StatsCardDesing) {
  return (
    <div className="bg-white rounded-lg text-center border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[180px] flex-1">
      <div className="flex items-center justify-center mb-1">
        <div>
          <h3 className="flex flex-col text-xs font-medium text-gray-800 uppercase tracking-wide">
            {title}
            <span>{urduTitle}</span>
          </h3>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="mt-2">
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
