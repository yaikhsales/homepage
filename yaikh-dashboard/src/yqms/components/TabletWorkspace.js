import React from "react";
import "./tablet-workspace.css";

export default function TabletWorkspace({ children, label = "Cutting inspection" }) {
  return <div className="cutting-tablet-workspace">
    <div className="cutting-tablet-caption"><span>iPad workstation</span><span>A4 portrait · touch workspace</span></div>
    <div className="cutting-tablet-device" aria-label={`${label} tablet workspace`}>
      <div className="cutting-tablet-camera" aria-hidden="true" />
      <div className="cutting-tablet-screen">{children}</div>
      <div className="cutting-tablet-home" aria-hidden="true" />
    </div>
  </div>;
}
