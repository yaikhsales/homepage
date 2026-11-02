import React, { memo, useLayoutEffect, useRef } from "react";
import { useSopLanguage } from "./sop-languages";
import { FABRIC_INSPECTION_ROLES, roleKey } from "./sop-role-model";
/* The detailed job table. Fabric inspection authored an evidence line per
 * role; every other SOP step has one authored at activity level, so those
 * render it once as a cell spanning the roles instead of repeating it. */
export default memo(function FabricInspectionJobCard({ title = "Fabric inspection", roles = FABRIC_INSPECTION_ROLES, selectedRole, onRoleSelect, onHeight, sharedEvidence }) {
 const perRoleEvidence = roles.some(role => role.evidence);
 const {text,localizeRole,language}=useSopLanguage();
 const contentRef=useRef(null);
 useLayoutEffect(()=>{const node=contentRef.current;if(!node||!onHeight)return;const measure=()=>onHeight(Math.max(300,Math.ceil(node.scrollHeight)+12));measure();if(typeof ResizeObserver==="undefined")return;const observer=new ResizeObserver(measure);observer.observe(node);return()=>observer.disconnect();},[language,roles,onHeight]);
 return <div ref={contentRef} lang={language} style={{background:"white",color:"#203448",padding:18}}>
  {title && <h3 style={{fontSize:26,fontWeight:800,margin:"0 0 14px"}}>{text(title)}</h3>}
  <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",fontSize:18,lineHeight:1.6}}>
   <thead><tr>{["Person / role","What this person must do","Evidence / hand-off"].map((label,index)=><th key={label} style={{width:["24%","50%","26%"][index],textAlign:"left",background:"#203448",color:"white",padding:15,fontSize:15}}>{text(label)}</th>)}</tr></thead>
   <tbody>{roles.map((role,index)=>{const active=selectedRole?.key===roleKey(role.role);const display=localizeRole(role);return <tr key={roleKey(role.role)} style={{background:active?"#fef3c7":"white",boxShadow:active?"inset 5px 0 #eab308":undefined}}>
    <td style={{verticalAlign:"top",padding:"18px 15px",borderBottom:"1px solid #dce5eb"}}><button type="button" aria-pressed={active} onClick={()=>onRoleSelect?.({key:roleKey(role.role),label:role.role})} style={{font:"inherit",fontWeight:750,textAlign:"left",color:active?"#854d0e":"#164e63",cursor:"pointer",background:"transparent",border:0,padding:0,textDecoration:"underline",textUnderlineOffset:4}}>{display.role}</button></td>
    <td style={{verticalAlign:"top",padding:"18px 15px",borderBottom:"1px solid #dce5eb"}}>{display.does}</td>
    {perRoleEvidence
      ? <td style={{verticalAlign:"top",padding:"18px 15px",borderBottom:"1px solid #dce5eb",color:"#536c7e"}}>{display.evidence}</td>
      : index === 0 && <td rowSpan={roles.length} style={{verticalAlign:"top",padding:"18px 15px",borderBottom:"1px solid #dce5eb",color:"#536c7e"}}>{sharedEvidence ? text(sharedEvidence) : "—"}</td>}
   </tr>})}</tbody>
  </table>
 </div>;
});
