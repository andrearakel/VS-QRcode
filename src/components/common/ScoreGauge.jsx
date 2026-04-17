import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export default function ScoreGauge({ value, max = 100, label, color, size = 90 }) {
  const data = [{ value, fill: color || getColor(value, max) }];

  function getColor(val, max) {
    const pct = (val / max) * 100;
    if (pct >= 85) return '#16a34a'; // green-600
    if (pct >= 70) return '#ca8a04'; // yellow-600
    return '#dc2626'; // red-600
  }

  const fillColor = color || getColor(value, max);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <RadialBarChart
          width={size}
          height={size}
          cx={size / 2}
          cy={size / 2}
          innerRadius={size * 0.35}
          outerRadius={size * 0.48}
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={size * 0.12}
        >
          <PolarAngleAxis type="number" domain={[0, max]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#f1f5f9' }}
            clockWise
            dataKey="value"
            cornerRadius={size * 0.06}
            angleAxisId={0}
          />
        </RadialBarChart>
        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-gray-900" style={{ fontSize: size * 0.22 }}>
            {value}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-1 text-xs font-medium text-gray-500 text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}