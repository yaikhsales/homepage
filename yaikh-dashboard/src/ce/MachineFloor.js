// CE · the Machine column's screens on the shared floor: Machine Layout (lens "machine"), Mechanic Line
// Plan ("mechanic"), Machine Requirement ("requirement"). The floor draws the lines and the selected line;
// the lens body under it comes from machineLenses.js. Machine Layout also links to the old allocation view.
import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Floor from "./floor/Floor";
import { MACHINE_LENS_BODIES, MACHINE_LENSES } from "./machineLenses";

const TITLES = { machine: "Machine Layout", mechanic: "Mechanic Line Plan", requirement: "Machine Requirement" };

// what a station circle says under the worker, per lens
const STATION = {
  machine: (s) => `${s.machine_code || ""} ${s.model || s.machine || ""}`.trim(),
  mechanic: (s) => (s.change && s.change !== "keep" ? `${s.change} → ${(s.next_machine && s.next_machine.machine_code) || "?"}` : s.operation),
  requirement: (s) => `${s.machine_code || ""} · ${s.presser_foot || ""}`.trim(),
};

const MachineFloor = ({ lens, onBack }) => {
  const navigate = useNavigate();
  const Body = MACHINE_LENS_BODIES[lens];
  return (
    <Floor
      lens={lens}
      label={TITLES[lens] || lens}
      onBack={onBack}
      nav={MACHINE_LENSES}
      renderStation={STATION[lens]}
      stationReason={lens === "mechanic" ? (s) => (s.available === false ? `next machine not available · ${(s.next_machine && s.next_machine.machine_code) || ""}` : "") : undefined}
      renderDetail={(det) => (
        <>
          {Body && <Body detail={det} />}
          {lens === "machine" && (
            <div className="text-xs text-slate-400">
              Machine allocation — owned, in use, at peak, what to rent or borrow — lives inside this screen:{" "}
              <button onClick={() => navigate("/dashboard/ce/machine-allocation")} className="inline-flex items-center gap-1 rounded-lg border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 px-2 py-0.5 text-xs font-bold"><ExternalLink size={11} />open the allocation table</button>
            </div>
          )}
        </>
      )}
      stationCard={(s) => (lens === "mechanic" && s.next_machine ? <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs text-amber-200"><b>Next style: </b>{s.change || "keep"} → {s.next_machine.machine_code} {s.next_machine.machine}{s.next_machine.operation ? " · " + s.next_machine.operation : ""}{s.available === false ? <span className="text-rose-300 font-bold"> · not available yet</span> : null}</div> : null)}
    />
  );
};

export default MachineFloor;
