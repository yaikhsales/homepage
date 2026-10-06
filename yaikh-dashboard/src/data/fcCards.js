// FC hub — the grouped sub-module cards (one source for AppLayout.handleModuleClick and the
// /dashboard/submenu/fc direct-URL / refresh fallback in SubMenuView).
export const FC_CARDS = {
    grouped: true,
    groups: [
      {
        label: "Receiving",
        cards: [
          {
            title: "Fabric Receiving",
            icon: "Package",
            color:
              "bg-blue-500/30 text-white",
            image:
              "assets/fc/fabric-receiving.jpg",
          },
          {
            title:
              "Accessories Receiving",
            icon: "Package",
            color:
              "bg-cyan-500/30 text-white",
            image:
              "assets/fc/accessories-receiving.jpg",
          },
        ],
      },
      {
        label: "Testing",
        cards: [
          {
            title: "Fabric Inspection",
            icon: "Search",
            color:
              "bg-indigo-500/30 text-white",
            image:
              "assets/fc/fabric-inspection.jpg",
          },
          {
            title: "Fabric Test",
            icon: "FlaskConical",
            color:
              "bg-purple-500/30 text-white",
            image:
              "assets/fc/fabric-test.jpg",
          },
          {
            title:
              "Accessories Inspection",
            icon: "Search",
            color:
              "bg-pink-500/30 text-white",
            image:
              "assets/fc/accessories-inspection.jpg",
          },
        ],
      },
      {
        label: "Instore",
        cards: [
          {
            title:
              "Warehouse Tracking Location",
            icon: "MapPin",
            color:
              "bg-teal-500/30 text-white",
            image:
              "assets/fc/warehouse-tracking-location.jpg",
          },
          {
            title: "Warehouse Location Plan",
            icon: "MapPin",
            color:
              "bg-cyan-500/30 text-white",
            image:
              "assets/fc/warehouse-tracking-location.jpg",
            action: "/dashboard/fc/location-plan",
          },
        ],
      },
      {
        label: "Consumption",
        cards: [
          {
            title: "Consumptions",
            icon: "Calculator",
            color:
              "bg-green-500/30 text-white",
            image:
              "assets/fc/consumption.png",
          },
          {
            title: "Calculator",
            icon: "Calculator",
            color:
              "bg-emerald-500/30 text-white",
            image:
              "assets/fc/calculator.png",
          },
        ],
      },
      {
        label: "Issuing",
        cards: [
          {
            title: "Fabric Issuing",
            icon: "ArrowUpRight",
            color:
              "bg-amber-500/30 text-white",
            image:
              "assets/fc/fabric-issuing.jpg",
          },
          {
            title:
              "Accessories Issuing",
            icon: "ArrowUpRight",
            color:
              "bg-orange-500/30 text-white",
            image:
              "assets/fc/accessories-issuing.jpg",
          },
          {
            title: "Delivery Tracking",
            icon: "Truck",
            color:
              "bg-yellow-500/30 text-white",
            image:
              "assets/fc/delivery-tracking.jpg",
          },
        ],
      },
      {
        label: "Return",
        cards: [
          {
            title: "Return Fabric",
            icon: "ArrowDownLeft",
            color:
              "bg-rose-500/30 text-white",
            image:
              "assets/fc/return-fabric.jpg",
          },
          {
            title: "Return Accessories",
            icon: "ArrowDownLeft",
            color:
              "bg-red-500/30 text-white",
            image:
              "assets/fc/return-accessories.jpg",
          },
          {
            title: "Brand Protection",
            icon: "Shield",
            color:
              "bg-violet-500/30 text-white",
            image:
              "assets/fc/brand-protection.jpg",
          },
        ],
      },
    ],
  };
