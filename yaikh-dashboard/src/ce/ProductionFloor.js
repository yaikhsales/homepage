// CE · the Production column's six screens on the shared floor: Line Balancing, Cut/Sew/Pack
// Productivity, Team Performance, Skill Inventory, Learning Curve, Downtimes. The floor draws the lines and
// the selected line; the per-station figure and the body under it come from productionLenses.js.
import React from "react";
import Floor from "./floor/Floor";
import { PRODUCTION_LENS_BODIES, PRODUCTION_LENSES, PRODUCTION_STATION, PRODUCTION_REASON } from "./productionLenses";

const ProductionFloor = ({ lens, onBack }) => {
  const Body = PRODUCTION_LENS_BODIES[lens];
  const meta = PRODUCTION_LENSES.find((x) => x.lens === lens) || { title: lens };
  return <Floor lens={lens} label={meta.title} onBack={onBack} nav={PRODUCTION_LENSES} renderStation={PRODUCTION_STATION[lens]} stationReason={PRODUCTION_REASON[lens]} renderDetail={(det) => (Body ? <Body detail={det} /> : null)} />;
};

export default ProductionFloor;
