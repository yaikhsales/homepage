import React, { memo } from "react";
import { FABRIC_INSPECTION_ROLES, roleKey } from "./sop-role-model";
export default memo(function FabricInspectionJobCard({ title = "Fabric inspection", roles = FABRIC_INSPECTION_ROLES, selectedRole, onRoleSelect }) {
 return <div style={{background:"white",color:"#203448",padding:18,height:"100%"}}>
  <h3 style={{fontSize:26,fontWeight:800,margin:"0 0 14px"}}>{title}</h3>
  <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",fontSize:17,lineHeight:1.5}}>
   <thead><tr>{["Person / role","What this person must do","Evidence / hand-off"].map((label,index)=><th key={label} style={{width:["24%","50%","26%"][index],textAlign:"left",background:"#203448",color:"white",padding:15,fontSize:15}}>{label}</th>)}</tr></thead>
   <tbody>{roles.map(role=>{const active=selectedRole?.key===roleKey(role.role);return <tr key={roleKey(role.role)} style={{background:active?"#fef3c7":"white",boxShadow:active?"inset 5px 0 #eab308":undefined}}>
    <td style={{verticalAlign:"top",padding:"18px 15px",borderBottom:"1px solid #dce5eb"}}><button type="button" aria-pressed={active} onClick={()=>onRoleSelect?.({key:roleKey(role.role),label:role.role})} style={{font:"inherit",fontWeight:750,textAlign:"left",color:active?"#854d0e":"#164e63",cursor:"pointer",background:"transparent",border:0,padding:0,textDecoration:"underline",textUnderlineOffset:4}}>{role.role}</button></td>
    <td style={{verticalAlign:"top",padding:"18px 15px",borderBottom:"1px solid #dce5eb"}}>{role.does}</td>
    <td style={{verticalAlign:"top",padding:"18px 15px",borderBottom:"1px solid #dce5eb",color:"#536c7e"}}>{role.evidence}</td>
   </tr>})}</tbody>
  </table>
 </div>;
});
