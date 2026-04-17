export default function CategoryCard({
  icon,
  title,
  subtitle,
  onClick,
  color = 'bg-white',
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} w-full flex items-center gap-4 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 text-left active:scale-[0.98]`}
    >
      <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
}