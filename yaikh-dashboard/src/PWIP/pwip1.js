import React from "react";
import {
  TopMetricCard,
  HorizontalBarChart,
  DonutChart,
  GroupedBarChart,
  AreaChartDots,
} from "./components";

const PWIP1 = () => {
  // Pseudo random generator for consistent mock data
  const getH = (i, offset) => {
    const seed = (i + offset) * 9301 + 49297;
    return (seed % 80) + 10;
  };

  const months = [
    "Jan-18",
    "Feb-18",
    "Mar-18",
    "Apr-18",
    "May-18",
    "Jun-18",
    "Jul-18",
    "Aug-18",
    "Sep-18",
    "Oct-18",
    "Nov-18",
    "Dec-18",
  ];

  const dates = [
    "01-01-2018",
    "02-01-2018",
    "03-01-2018",
    "04-01-2018",
    "05-01-2018",
    "06-01-2018",
    "07-01-2018",
    "08-01-2018",
    "09-01-2018",
    "10-01-2018",
  ];

  const operatorsPoints = [
    { x: 0, y: 15 },
    { x: 10, y: 20 },
    { x: 20, y: 30 },
    { x: 30, y: 10 },
    { x: 40, y: 12 },
    { x: 50, y: 18 },
    { x: 60, y: 30 },
    { x: 70, y: 45 },
    { x: 80, y: 55 },
    { x: 90, y: 20 },
  ];

  return (
    <div className="w-full h-full bg-white p-4 flex flex-col relative overflow-hidden">
      {/* Dashboard Title */}
      <div className="mb-3 relative border-l-4 border-gray-400 pl-3 py-0.5 shrink-0">
        <h1 className="text-xl font-normal text-black leading-tight">
          Manufacturing KPI Dashboard Showing Production...
        </h1>
        <div className="absolute -top-1 -left-[5px] w-6 h-1 bg-gray-400"></div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 grid-rows-3 flex-1 border-t border-l border-gray-200 min-h-0 gap-0 overflow-hidden">
        {/* Row 1 */}
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <TopMetricCard
            title="Units YTD"
            subtitle="Units produced"
            value="345,144.00"
            target="350,000.00"
            percentage="-5%"
            isPositive={false}
            chartType="blue"
            dataPoints={[20, 25, 23, 27, 26, 22, 24]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[180px]">
          <TopMetricCard
            title="Units : lost"
            subtitle="Units loss"
            value="380"
            chartType="dark"
            dataPoints={[50, 40, 35, 38, 45, 52, 55]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[180px]">
          <TopMetricCard
            title="Overall Plant Productivity"
            subtitle="Productivity"
            value="80.15%"
            target="82.10%"
            percentage="5%"
            isPositive={true}
            chartType="dark"
            dataPoints={[40, 42, 41, 44, 43, 45, 46]}
          />
        </div>

        {/* Row 2 */}
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <HorizontalBarChart
            title="Production Rate : Machine"
            subtitle="Units produced"
            showYear={true}
            year="2018"
            data={[
              { label: "Machine-A", value: 25, color: "#002f4b" },
              { label: "Machine-B", value: 35, color: "#2083b8" },
              { label: "Machine-C", value: 100, color: "#58b9c9" },
            ]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <DonutChart
            title="Lost Units : Causes"
            centerValue="100"
            segments={[
              { value: 20, color: "#004c6d" },
              { value: 30, color: "#2a8b9e" },
              { value: 20, color: "#2ecc71" },
              { value: 30, color: "#1abc9c" },
            ]}
            legend={[
              { label: "Tooling Error", color: "#004c6d" },
              { label: "Operator Damage", color: "#2a8b9e" },
              { label: "Physical Damage", color: "#2ecc71" },
              { label: "Other Causes", color: "#1abc9c" },
            ]}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <GroupedBarChart
            title="Productivity By : Machine"
            months={months}
            getHeight={getH}
          />
        </div>

        {/* Row 3 */}
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <AreaChartDots
            title="Operators Available"
            points={operatorsPoints}
            dates={dates}
            yAxisMax={100}
            legend="Operators Available"
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <GroupedBarChart
            title="Units Lost : Machine"
            subtitle="Units loss"
            showYAxis={true}
            months={months}
            getHeight={getH}
            yAxisMax={40}
          />
        </div>
        <div className="border-r border-b border-gray-200 min-h-[240px]">
          <HorizontalBarChart
            title="Overall Productivity :YTD"
            subtitle="Productivity"
            showYear={true}
            year="2018"
            data={[
              { label: "Machine-A", value: 90, color: "#002f4b" },
              { label: "Machine-B", value: 80, color: "#2083b8" },
              { label: "Machine-C", value: 50, color: "#58b9c9" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PWIP1;

