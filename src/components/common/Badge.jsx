const badgeConfig = {
  MSC: {
    label: 'MSC Certified',
    color: 'bg-blue-100 text-blue-800',
    icon: '🐟',
  },
  'IFS Food': {
    label: 'IFS Food',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
  },
  'BRC Global Standards': {
    label: 'BRC Global',
    color: 'bg-purple-100 text-purple-800',
    icon: '🏆',
  },
};

export default function Badge({ type }) {
  const config = badgeConfig[type] || {
    label: type,
    color: 'bg-gray-100 text-gray-800',
    icon: '📋',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}