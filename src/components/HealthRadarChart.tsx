import React from 'react';

interface HealthRadarChartProps {
  scores: {
    heart: number;
    diabetes: number;
    lifestyleRisk: number;
    obesity: number;
    vitals: number;
  };
}

export const HealthRadarChart: React.FC<HealthRadarChartProps> = ({ scores }) => {
  // 5 axes: Heart (top), Lifestyle (top-right), Obesity (bottom-right), Vitals (bottom-left), Diabetes (top-left)
  const size = 260;
  const center = size / 2;
  const radius = 95;

  const axes = [
    { label: '❤️ Heart', score: scores.heart, angle: -Math.PI / 2 },
    { label: '🫁 Lifestyle Risk', score: scores.lifestyleRisk, angle: -Math.PI / 2 + (2 * Math.PI) / 5 },
    { label: '⚖️ Obesity/BMI', score: scores.obesity, angle: -Math.PI / 2 + (4 * Math.PI) / 5 },
    { label: '🫀 Vitals/BP', score: scores.vitals, angle: -Math.PI / 2 + (6 * Math.PI) / 5 },
    { label: '🩸 Diabetes', score: scores.diabetes, angle: -Math.PI / 2 + (8 * Math.PI) / 5 },
  ];

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = axes
    .map((axis) => {
      const { x, y } = getCoordinates(axis.score, axis.angle);
      return `${x},${y}`;
    })
    .join(' ');

  // Calculate average risk for gradient styling
  const avgRisk =
    (scores.heart + scores.diabetes + scores.lifestyleRisk + scores.obesity + scores.vitals) / 5;
  const riskColor = avgRisk > 60 ? '#ef4444' : avgRisk > 35 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex flex-col items-center bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between w-full mb-1">
        <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500">
          Health Risk Profile Radar
        </h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${riskColor}15`,
            color: riskColor,
          }}
        >
          Avg: {Math.round(avgRisk)}%
        </span>
      </div>

      <div className="relative flex justify-center items-center w-full py-2">
        <svg
          id="health-radar-svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Circular/Pentagonal Grid rings */}
          {levels.map((lvl) => {
            const gridPoints = axes
              .map((axis) => {
                const r = lvl * radius;
                const x = center + r * Math.cos(axis.angle);
                const y = center + r * Math.sin(axis.angle);
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <g key={lvl}>
                <polygon
                  points={gridPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={lvl === 1 ? 'none' : '3,3'}
                />
                <text
                  x={center + 4}
                  y={center - lvl * radius + 10}
                  fontSize="9"
                  fill="#94a3b8"
                  textAnchor="start"
                >
                  {Math.round(lvl * 100)}%
                </text>
              </g>
            );
          })}

          {/* Spoke lines from center to outer ring */}
          {axes.map((axis, i) => {
            const outer = getCoordinates(100, axis.angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}

          {/* Polygon risk fill */}
          <polygon
            points={polygonPoints}
            fill={riskColor}
            fillOpacity="0.25"
            stroke={riskColor}
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Vertex dots */}
          {axes.map((axis, i) => {
            const pt = getCoordinates(axis.score, axis.angle);
            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill={riskColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-500 ease-out"
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          {axes.map((axis, i) => {
            const labelCoord = getCoordinates(118, axis.angle);
            let textAnchor = 'middle';
            if (axis.angle > -Math.PI / 2 + 0.1 && axis.angle < Math.PI / 2 - 0.1) textAnchor = 'start';
            else if (axis.angle < -Math.PI / 2 - 0.1 || axis.angle > Math.PI / 2 + 0.1)
              textAnchor = 'end';

            return (
              <g key={i}>
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  fontSize="11"
                  fontWeight="600"
                  fill="#334155"
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                >
                  {axis.label}
                </text>
                <text
                  x={labelCoord.x}
                  y={labelCoord.y + 13}
                  fontSize="10"
                  fontWeight="700"
                  fill={axis.score > 60 ? '#dc2626' : axis.score > 35 ? '#d97706' : '#16a34a'}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                >
                  {axis.score}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full pt-3 mt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>&lt;35% Low Risk</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>35-60% Moderate</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>&gt;60% High Risk</span>
        </div>
      </div>
    </div>
  );
};
