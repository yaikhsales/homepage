// YPI hub — the grouped sub-module cards (one source for AppLayout.handleModuleClick and the
// /dashboard/submenu/ypi direct-URL / refresh fallback in SubMenuView).
export const YPI_CARDS = {
    grouped: true,
    groups: [
      {
        label: "Tech-pack",
        cards: [
        {
          title: "Tech-pack",
          icon: "BookOpen",
          color: "bg-sky-500/30 text-white",
          action: "/dashboard/ypi/techpack",
        },
        ],
      },
      {
        label: "Sample Plan",
        cards: [
        {
          title: "Sample Development Plan",
          icon: "FlaskConical",
          color: "bg-amber-500/30 text-white",
          action: "/dashboard/ypi/sample-plan",
        },
        ],
      },
      {
        label: "Marker & Cut Plan",
        cards: [
        {
          title: "Marker & Cut Plan",
          icon: "Scissors",
          color: "bg-emerald-500/30 text-white",
          action: "/dashboard/ypi/cut-plan",
        },
        ],
      },
      {
        label: "Material Portal",
        cards: [
        {
          title: "Material Portal",
          icon: "Package",
          color: "bg-amber-500/30 text-white",
          action: "/dashboard/ypi/material-portal",
        },
        {
          title: "BOM Status",
          icon: "ClipboardCheck",
          color: "bg-amber-500/30 text-white",
          action: "/dashboard/ypi/bom-status",
        },
        ],
      },
    ],
  };
