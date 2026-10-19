import React from "react";
import "./cutting-form-tablet.css";

// The device frame belongs only to the Cutting Form, never the module shell.
export default function CuttingFormTablet({ children, label = "Cutting Form" }) {
  return <section className="cutting-form-tablet-view" aria-label={`${label} tablet view`}>
    <p className="cutting-form-tablet-label">iPad · {label}</p>
    <div className="cutting-form-tablet-device">
      <span className="cutting-form-tablet-camera" aria-hidden="true" />
      <div className="cutting-form-tablet-screen">{children}</div>
      <span className="cutting-form-tablet-home" aria-hidden="true" />
    </div>
  </section>;
}
