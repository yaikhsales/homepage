// CSR hub sub-menus — the cards of the Digital Audit, Energy, Waste and Air hubs (one source for
// AppLayout.handleModuleClick and the /dashboard/submenu/<id> direct-URL / refresh fallback in SubMenuView).
export const DIGITAL_AUDIT_CARDS = [
    {
      title: "Audit Plan",
      icon: "Layout",
      color: "bg-indigo-500 text-white",
    },
    {
      title: "Compliance Certificate",
      icon: "FileCheck",
      color: "bg-emerald-500 text-white",
    },
    {
      title: "Digital Audit",
      icon: "MonitorPlay",
      color: "bg-blue-500 text-white",
    },
    {
      title: "Checklist 6s",
      icon: "CheckSquare",
      color: "bg-cyan-500 text-white",
    },
  ];
export const ENERGY_CARDS = [
    {
      title: "Meters",
      icon: "GaugeCircle",
      color: "bg-orange-500 text-white",
      action: "/dashboard/energy/meters",
    },
    {
      title: "Solar Dashboard",
      icon: "Sun",
      color: "bg-yellow-500 text-white",
      action: "/dashboard/energy/solar-dashboard",
    },
    {
      title: "Switch Board Ampere Load Monitoring",
      icon: "Activity",
      color: "bg-red-500 text-white",
      action: "/dashboard/energy/switch-board",
    },
    {
      title: "Energy Source",
      icon: "Power",
      color: "bg-green-500 text-white",
      action: "/dashboard/energy/energy-source",
    },
  ];
export const WASTE_CARDS = [
    {
      title: "Waste",
      icon: "Trash2",
      color: "bg-purple-500 text-white",
      action: "/dashboard/waste/analytics",
    },
    {
      title: "Boiler",
      icon: "Flame",
      color: "bg-orange-500 text-white",
      action: "/dashboard/waste/boiler",
    },
  ];
export const AIR_CARDS = [
    {
      title: "Temperature Humidity Sensor",
      icon: "Thermometer",
      color: "bg-red-500 text-white",
      action: "/dashboard/air/temperature",
    },
    {
      title: "Switch (Fan & Pump)",
      icon: "ToggleRight",
      color: "bg-white text-blue-600",
      action: "/dashboard/air/switch",
    },
    {
      title: "Air Quality Detector",
      icon: "Wind",
      color: "bg-sky-500 text-white",
      action: "/dashboard/air/quality",
    },
  ];
