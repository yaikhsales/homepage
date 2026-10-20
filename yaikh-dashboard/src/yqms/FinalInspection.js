import React from "react";
import FinalInspectionWorkspace from "./FinalInspectionWorkspace";

const FinalInspection = ({ onBack }) => (
  <FinalInspectionWorkspace stage="final" onBack={onBack} />
);

export default FinalInspection;
