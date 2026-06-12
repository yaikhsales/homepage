import React from "react";
import {
  TopMetricCard,
  HorizontalBarChart,
  DonutChart,
  GroupedBarChart,
  StackedHorizontalBarChart,
} from "./components";

const PWIP3 = () => {
  // Pseudo random generator for consistent mock data
  const getH = (i, offset) => {
    const seed = (i + offset) * 9301 + 49297;
    return (seed % 80) + 10;
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="w-full h-full bg-white p-4 flex flex-col relative overflow-hidden">
      {/* Dashboard Title */}
      <div className="mb-2 relative border-l-4 border-gray-400 pl-3 py-0.5 shrink-0">
        <h1 className="text-xl font-normal text-black leading-tight">
          Product Manufacturing Dashboards
        </h1>
        <p className="text-xs text-gray-600 mt-1 leading-tight">
          Following slide shows product manufacturing dashboard. This includes
          production rate, overall productivity, unit loss and operators
          availability status.
        </p>
        <div className="absolute -top-1 -left-[5px] w-6 h-1 bg-gray-400"></div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-4 grid-rows-2 flex-1 border-t border-l border-gray-200 min-h-0 gap-0 overflow-hidden">
        {/* Row 1 */}
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <StackedHorizontalBarChart
            title="Production Rate: Machine"
            subtitle="Units Produced"
            showYear={true}
            year="2021"
            xAxisMax={125000}
            xAxisSteps={4}
            data={[
              { label: "Machine -A", value: 85000, color: "#fbbf24" },
              { label: "Machine-B", value: 95000, color: "#6b7280" },
              { label: "Machine-C", value: 105000, color: "#000000" },
            ]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <TopMetricCard
            title="Overall Plant Productivity"
            subtitle="Productivity"
            value="88.11%"
            target="85.00%"
            percentage="+4%"
            isPositive={true}
            chartType="dark"
            dataPoints={[40, 42, 44, 45, 46, 47, 48]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <GroupedBarChart
            title="Productivity by: Machine"
            months={months}
            getHeight={getH}
            colors={["#fbbf24", "#6b7280", "#000000"]}
            labels={["Machine-A", "Machine-B", "Machine-C"]}
            yAxisMax={100}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <TopMetricCard
            title="Units YTD"
            subtitle="Units Produced"
            value="339,194.00"
            target="360,000.00"
            percentage="-6%"
            isPositive={false}
            chartType="blue"
            dataPoints={[20, 22, 21, 20, 19, 18, 17]}
          />
        </div>

        {/* Row 2 */}
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <TopMetricCard
            title="Units: Lost"
            subtitle="Unit Loss"
            value="389"
            chartType="dark"
            dataPoints={[50, 45, 40, 42, 38, 35, 32]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <GroupedBarChart
            title="Lost Units: Machine"
            months={months}
            getHeight={(i, offset) => {
              const seed = (i + offset) * 9301 + 49297;
              return (seed % 25) + 5;
            }}
            colors={["#fbbf24", "#000000", "#6b7280"]}
            labels={["Machine-A", "Machine-B", "Machine-C"]}
            yAxisMax={50}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <DonutChart
            title="Lost Units: Causes"
            centerValue="389"
            segments={[
              { value: 40, color: "#fbbf24" },
              { value: 25, color: "#6b7280" },
              { value: 20, color: "#000000" },
              { value: 15, color: "#d1d5db" },
            ]}
            legend={[
              { label: "Tooling Error", color: "#fbbf24" },
              { label: "Other Damage", color: "#6b7280" },
              { label: "Other Causes", color: "#000000" },
              { label: "Physical Damage", color: "#d1d5db" },
            ]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <HorizontalBarChart
            title="Overall Productivity: YTD"
            subtitle="Productivity"
            showYear={true}
            year="2020"
            data={[
              { label: "Machine -A", value: 90, color: "#fbbf24" },
              { label: "Machine -B", value: 70, color: "#000000" },
              { label: "Machine -C", value: 80, color: "#6b7280" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PWIP3;

