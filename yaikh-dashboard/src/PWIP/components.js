import React from "react";

// ----------------------------------------------------------------------
// Reusable Chart Components for PWIP Dashboards
// ----------------------------------------------------------------------

export const TopMetricCard = ({
  title,
  subtitle,
  value,
  target,
  percentage,
  isPositive,
  chartType,
  dataPoints,
}) => {
  const width = 140;
  const height = 50;
  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints) * 0.8;
  const range = max - min || 1;
  const step = width / (dataPoints.length - 1);

  let pathD = `M0,${height - ((dataPoints[0] - min) / range) * height}`;
  dataPoints.forEach((d, i) => {
    pathD += ` L${i * step},${height - ((d - min) / range) * height}`;
  });
  const areaD = `${pathD} V${height} H0 Z`;

  const chartColor = chartType === "dark" ? "#0f3f6e" : "#2083b8";

  return (
    <div className="bg-white px-3 py-2 border-r border-b border-gray-200 h-full flex flex-col justify-between overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-black leading-tight">{title}</h3>
          <p className="text-[10px] text-gray-500 italic mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xl font-bold text-[#006080] leading-tight">{value}</span>
          {target && (
            <div className="text-[9px] text-gray-500 mt-0.5">
              Target: <span className="text-red-500 font-semibold">{target}</span>
            </div>
          )}
        </div>

        <div className="w-[100px] h-[40px] shrink-0">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <path d={areaD} fill={chartColor} opacity="0.3" />
            <path d={pathD} fill="none" stroke={chartColor} strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Target Badge */}
      <div className="flex justify-end mt-1 h-5">
        {percentage && (
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-white font-bold ${isPositive ? "bg-[#00b050]" : "bg-[#c00000]"}`}
          >
            <span className="text-[9px]">{isPositive ? "↑" : "↓"}</span>{" "}
            {percentage}
          </div>
        )}
      </div>
    </div>
  );
};

export const HorizontalBarChart = ({ title, subtitle, data, showYear, year }) => {
  return (
    <div className="bg-white px-3 py-2 border-r border-b border-gray-200 h-full flex flex-col overflow-hidden">
      <h3 className="text-xs font-bold text-black leading-tight">{title}</h3>
      <p className="text-[10px] text-gray-500 italic mb-2 mt-0.5">{subtitle}</p>

      <div className="flex-1 min-h-0 flex flex-col justify-center">
        <div className="flex items-center border-l border-b border-gray-300 relative">
          {/* Y-axis labels on the left */}
          <div className="w-16 shrink-0 flex flex-col justify-center pr-2">
            {showYear && (
              <div className="text-xs text-gray-500 font-medium text-right">{year}</div>
            )}
          </div>
          
          {/* Bars area */}
          <div className="flex-1 flex flex-col gap-2.5 pl-2 pr-2 py-1">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Label on the left */}
                <div className="w-20 shrink-0 text-[10px] font-medium text-gray-700 text-right">
                  {item.label}
                </div>
                {/* Bar */}
                <div className="flex-1 relative h-4 bg-gray-100/50 rounded-sm overflow-hidden">
                  <div
                    className="h-full absolute left-0 top-0 transition-all duration-1000 rounded-sm"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="ml-20 flex justify-between text-[9px] text-gray-500 mt-1 border-t border-gray-300 pt-1 px-2">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export const DonutChart = ({ title, centerValue, segments, legend }) => {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  let currentOffset = 0;
  const circumference = 2 * Math.PI * 15.9155; // r = 15.9155

  return (
    <div className="bg-white px-3 py-2 border-r border-b border-gray-200 h-full flex flex-col overflow-hidden">
      <h3 className="text-xs font-bold text-black leading-tight mb-1">{title}</h3>
      <div className="flex items-center justify-center h-full relative">
        <div className="relative w-40 h-40">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {segments.map((seg, idx) => {
              const dashLength = (seg.value / total) * circumference;
              const dashArray = `${dashLength} ${circumference - dashLength}`;
              const offset = currentOffset;
              currentOffset -= dashLength;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="15.9155"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={dashArray}
                  strokeDashoffset={offset}
                />
              );
            })}

            {/* Center Text */}
            <text
              x="50"
              y="55"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              fill="black"
            >
              {centerValue}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="ml-4 flex flex-col gap-2">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GroupedBarChart = ({
  title,
  subtitle,
  showYAxis = true,
  months,
  getHeight,
  colors = ["#002f4b", "#2083b8", "#58b9c9"],
  labels = ["Machine-A", "Machine-B", "Machine-C"],
  yAxisMax = 100,
}) => {
  return (
    <div className="bg-white px-3 py-2 border-r border-b border-gray-200 h-full flex flex-col overflow-hidden">
      <h3 className="text-xs font-bold text-black leading-tight">{title}</h3>
      {subtitle && (
        <p className="text-[10px] text-gray-500 italic mb-1 mt-0.5">{subtitle}</p>
      )}

      <div className="flex-1 flex relative items-end ml-6 border-l border-b border-gray-300 pb-1 min-h-0">
        {/* Y Axis Labels */}
        {showYAxis && (
          <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-500 py-2 text-right w-6 font-medium">
            <span>{yAxisMax}</span>
            <span>{Math.round(yAxisMax * 0.8)}</span>
            <span>{Math.round(yAxisMax * 0.6)}</span>
            <span>{Math.round(yAxisMax * 0.4)}</span>
            <span>{Math.round(yAxisMax * 0.2)}</span>
            <span>0</span>
          </div>
        )}

        {/* Bars */}
        {months.map((m, i) => (
          <div
            key={i}
            className="flex-1 flex items-end justify-center h-full px-[1px]"
          >
            {colors.map((color, colorIdx) => (
              <div
                key={colorIdx}
                className={`w-[${100 / colors.length}%] mx-[1px]`}
                style={{
                  height: `${getHeight(i, colorIdx)}%`,
                  backgroundColor: color,
                  width: `${100 / colors.length}%`,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between ml-6 mt-0.5 text-[7px] text-gray-500 -rotate-45 origin-top-left h-6">
        {months.map((m, i) => (
          <span key={i} className="w-full text-center block mt-1">
            {m}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-2 mt-1">
        {labels.map((label, idx) => (
          <div key={idx} className="flex items-center gap-0.5">
            <div
              className="w-1.5 h-1.5"
              style={{ backgroundColor: colors[idx] }}
            ></div>
            <span className="text-[8px] font-bold text-black">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AreaChartDots = ({
  title,
  points,
  dates,
  yAxisMax = 100,
  legend = "Operators Available",
}) => {
  let d = `M${points[0].x},${100 - points[0].y}`;
  points.forEach((p) => (d += ` L${p.x},${100 - p.y}`));
  const areaD = `${d} V100 H0 Z`;

  return (
    <div className="bg-white px-3 py-2 border-r border-b border-gray-200 h-full flex flex-col overflow-hidden">
      <h3 className="text-xs font-bold text-black leading-tight">{title}</h3>
      <div className="flex-1 relative mt-2 ml-6 border-l border-b border-gray-400 min-h-0">
        {/* Y Axis */}
        <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-500 h-full">
          <span>{yAxisMax}</span>
          <span>{yAxisMax * 0.8}</span>
          <span>{yAxisMax * 0.6}</span>
          <span>{yAxisMax * 0.4}</span>
          <span>{yAxisMax * 0.2}</span>
          <span>0</span>
        </div>

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d={areaD} fill="#1a3e5c" opacity="0.9" />
          <path d={d} fill="none" stroke="#fff" strokeWidth="0.5" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={100 - p.y}
              r="1.5"
              fill="white"
              stroke="#1a3e5c"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between ml-6 mt-0.5 text-[7px] text-gray-500 -rotate-45 origin-top-left h-6">
        {dates.map((d, i) => (
          <span key={i} className="w-full text-center block mt-1">
            {d}
          </span>
        ))}
      </div>
      <div className="text-center text-[8px] font-bold mt-1">{legend}</div>
    </div>
  );
};

export const StackedHorizontalBarChart = ({
  title,
  subtitle,
  data,
  showYear,
  year,
  xAxisMax,
  xAxisSteps = 5,
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const stepValue = xAxisMax / xAxisSteps;

  return (
    <div className="bg-white px-3 py-2 border-r border-b border-gray-200 h-full flex flex-col overflow-hidden">
      <h3 className="text-xs font-bold text-black leading-tight">{title}</h3>
      <p className="text-[10px] text-gray-500 italic mb-2 mt-0.5">{subtitle}</p>

      <div className="flex items-center flex-1 min-h-0">
        {showYear && (
          <div className="text-xs text-gray-500 w-10 shrink-0">{year}</div>
        )}
        <div className="flex-1 flex flex-col gap-3 border-l border-gray-300 pl-2">
          {data.map((item, idx) => (
            <div key={idx} className="w-full relative h-5 bg-gray-100/50">
              <div
                className="h-full absolute left-0 top-0 transition-all duration-1000"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Axis/Grid Simulation */}
      <div className="ml-10 flex justify-between text-[9px] text-gray-500 mt-0.5 border-t border-gray-400 pt-0.5">
        {Array.from({ length: xAxisSteps + 1 }, (_, i) => (
          <span key={i}>{Math.round((i * stepValue) / 1000)}k</span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-2 mt-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-0.5">
            <div
              className="w-1.5 h-1.5"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-[9px] font-bold text-black">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

