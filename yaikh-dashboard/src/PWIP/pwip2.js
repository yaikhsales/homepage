import React from "react";
import {
  TopMetricCard,
  HorizontalBarChart,
  DonutChart,
  GroupedBarChart,
  AreaChartDots,
  StackedHorizontalBarChart,
} from "./components";

const PWIP2 = () => {
  // Pseudo random generator for consistent mock data
  const getH = (i, offset) => {
    const seed = (i + offset) * 9301 + 49297;
    return (seed % 80) + 10;
  };

  const months = [
    "Jan-22",
    "Feb-22",
    "Mar-22",
    "Apr-22",
    "May-22",
    "Jun-22",
    "Jul-22",
    "Aug-22",
    "Sep-22",
    "Oct-22",
    "Nov-22",
  ];

  const dates = [
    "Jan 2022",
    "Feb 2022",
    "Mar 2022",
    "Apr 2022",
    "May 2022",
    "Jun 2022",
    "Jul 2022",
    "Aug 2022",
    "Sep 2022",
    "Oct 2022",
    "Nov 2022",
  ];

  // Operators available data - peaks in July around 25
  const operatorsPoints = [
    { x: 0, y: 18 },
    { x: 9, y: 19 },
    { x: 18, y: 20 },
    { x: 27, y: 21 },
    { x: 36, y: 22 },
    { x: 45, y: 23 },
    { x: 54, y: 25 },
    { x: 63, y: 24 },
    { x: 72, y: 22 },
    { x: 81, y: 20 },
    { x: 90, y: 18 },
  ];

  return (
    <div className="w-full h-full bg-white p-4 flex flex-col relative overflow-hidden">
      {/* Dashboard Title */}
      <div className="mb-2 relative border-l-4 border-gray-400 pl-3 py-0.5 shrink-0">
        <h1 className="text-xl font-normal text-black leading-tight">
          Manufacturing Analytics Dashboard with Key Performance Indicators
        </h1>
        <p className="text-xs text-gray-600 mt-1 leading-tight">
          This slide shows the dashboard highlighting the improvement in supply
          chain management of an organization through the use of manufacturing
          analytics software.
        </p>
        <div className="absolute -top-1 -left-[5px] w-6 h-1 bg-gray-400"></div>
      </div>

      {/* Date Range */}
      <div className="mb-2 text-xs text-gray-600 font-semibold shrink-0">
        1 Jan 2022 - 31 Dec 2022
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-4 grid-rows-2 border-t border-l border-gray-200 gap-0 overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
        {/* Row 1 */}
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <TopMetricCard
            title="Units :lost"
            subtitle="Units lost"
            value="396"
            chartType="dark"
            dataPoints={[50, 45, 40, 42, 38, 35, 32]}
          />
        </div>
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <TopMetricCard
            title="Over all Plant Productivity"
            subtitle="productivity"
            value="86.78%"
            target="85.00%"
            percentage="+4%"
            isPositive={true}
            chartType="dark"
            dataPoints={[40, 42, 44, 43, 45, 46, 48]}
          />
        </div>
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <TopMetricCard
            title="Units YTD"
            subtitle="Units products"
            value="355,298.00"
            target="360,000.00"
            percentage="-6%"
            isPositive={false}
            chartType="blue"
            dataPoints={[20, 22, 21, 23, 20, 19, 18]}
          />
        </div>
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <StackedHorizontalBarChart
            title="Production Rate: Machine"
            subtitle="Units products"
            showYear={true}
            year="2022"
            xAxisMax={185000}
            xAxisSteps={10}
            data={[
              { label: "Machine C", value: 100000, color: "#002f4b" },
              { label: "Machine B", value: 130000, color: "#2083b8" },
              { label: "Machine A", value: 170000, color: "#58b9c9" },
            ]}
          />
        </div>

        {/* Row 2 */}
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <DonutChart
            title="Lost Units :Causes"
            centerValue="396"
            segments={[
              { value: 25, color: "#002f4b" },
              { value: 30, color: "#2083b8" },
              { value: 25, color: "#58b9c9" },
              { value: 20, color: "#1abc9c" },
            ]}
            legend={[
              { label: "Text Here", color: "#002f4b" },
              { label: "Text Here", color: "#2083b8" },
              { label: "Text Here", color: "#58b9c9" },
              { label: "Text Here", color: "#1abc9c" },
            ]}
          />
        </div>
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <GroupedBarChart
            title="Productivity by: Machine"
            months={months}
            getHeight={getH}
            colors={["#002f4b", "#2083b8", "#58b9c9"]}
            labels={["Machine-A", "Machine-B", "MachineC"]}
            yAxisMax={100}
          />
        </div>
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <AreaChartDots
            title="Operators Available"
            points={operatorsPoints}
            dates={dates}
            yAxisMax={25}
            legend="Operators Available"
          />
        </div>
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <GroupedBarChart
            title="Units Lost: Machine"
            subtitle="Units Loss"
            showYAxis={true}
            months={dates}
            getHeight={(i, offset) => {
              const seed = (i + offset) * 9301 + 49297;
              return (seed % 25) + 5;
            }}
            yAxisMax={50}
            colors={["#002f4b", "#2083b8", "#58b9c9"]}
            labels={["Machine A", "Machine B", "Machine C"]}
          />
        </div>
      </div>

      {/* Additional Row for Overall Productivity YTD */}
      <div className="grid grid-cols-1 border-t border-l border-gray-200 mt-2" style={{ height: '80px' }}>
        <div className="border-r border-b border-gray-200 overflow-hidden">
          <HorizontalBarChart
            title="Over All Productivity: YTD"
            subtitle="Productivity"
            showYear={true}
            year="2022"
            data={[
              { label: "Machine A", value: 90, color: "#002f4b" },
              { label: "Machine B", value: 85, color: "#2083b8" },
              { label: "Machine C", value: 80, color: "#58b9c9" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PWIP2;

