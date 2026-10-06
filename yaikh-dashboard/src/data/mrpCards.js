// MRP hub — the grouped sub-module cards (one source for AppLayout.handleModuleClick and the
// /dashboard/submenu/mrp direct-URL / refresh fallback in SubMenuView).
export const MRP_CARDS = {
    grouped: true,
    groups: [
      {
        label: "Suppliers",
        cards: [
        {
          title: "Suppliers",
          icon: "CheckCircle",
          color: "bg-teal-500/30 text-white",
          action: "/dashboard/mrp/suppliers",
        },
        {
          title: "Orders by Supplier",
          icon: "FileText",
          color: "bg-teal-500/30 text-white",
          action: "/dashboard/mrp/supplier-orders",
        },
        {
          title: "Supplier Portal",
          icon: "Layers",
          color: "bg-teal-500/30 text-white",
          action: "/dashboard/mrp/supplier-portal",
        },
        ],
      },
      {
        label: "Orders",
        cards: [
        {
          title: "Material Orders",
          icon: "FileText",
          color: "bg-blue-500/30 text-white",
          action: "/dashboard/mrp/orders",
        },
        {
          title: "Supplier Confirmation",
          icon: "CheckCircle",
          color: "bg-blue-500/30 text-white",
          action: "/dashboard/mrp/confirmation",
        },
        ],
      },
      {
        label: "Supplier Documents",
        cards: [
        {
          title: "Packing Lists",
          icon: "Package",
          color: "bg-indigo-500/30 text-white",
          action: "/dashboard/mrp/packing-lists",
        },
        {
          title: "Delivery Orders",
          icon: "FileCheck",
          color: "bg-indigo-500/30 text-white",
          action: "/dashboard/mrp/delivery-orders",
        },
        ],
      },
      {
        label: "Logistics",
        cards: [
        {
          title: "Logistics",
          icon: "Truck",
          color: "bg-emerald-500/30 text-white",
          action: "/dashboard/mrp/logistics",
        },
        {
          title: "Shipping Documents",
          icon: "Layers",
          color: "bg-emerald-500/30 text-white",
          action: "/dashboard/mrp/documents",
        },
        {
          title: "Vessel & Truck Tracking",
          icon: "Truck",
          color: "bg-emerald-500/30 text-white",
          action: "/dashboard/mrp/tracking",
        },
        {
          title: "Customs Clearance",
          icon: "Shield",
          color: "bg-emerald-500/30 text-white",
          action: "/dashboard/mrp/customs",
        },
        ],
      },
      {
        label: "Arrival",
        cards: [
        {
          title: "Arrival Board (TV)",
          icon: "MonitorPlay",
          color: "bg-amber-500/30 text-white",
          action: "/dashboard/mrp/board",
        },
        {
          title: "Arrivals to FC",
          icon: "Warehouse",
          color: "bg-amber-500/30 text-white",
          action: "/dashboard/mrp/arrivals",
        },
        ],
      },
      {
        label: "Consumption",
        cards: [
        {
          title: "Consumption",
          icon: "BarChart2",
          color: "bg-violet-500/30 text-white",
          action: "/dashboard/mrp/consumption",
        },
        {
          title: "Ordered vs Required",
          icon: "CheckSquare",
          color: "bg-violet-500/30 text-white",
          action: "/dashboard/mrp/check",
        },
        ],
      },
    ],
  };
