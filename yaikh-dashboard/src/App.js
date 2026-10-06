import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import { TranslationProvider } from "./translate/TranslationContext";

// Import all view components
import TrainingGridView from "./views/TrainingGridView";
import SensorGridView from "./views/SensorGridView";
import WasteDashboardView from "./views/WasteDashboardView";
import TimelineView from "./views/TimelineView";
import SubMenuView from "./views/SubMenuView";
import TableView from "./views/TableView";
// eslint-disable-next-line no-unused-vars
import SupportTicketView from "./views/SupportTicketView";
import SupportTicketManagement from "./support-tickets/support-ticket-management";
import OrgChart from "./hr/OrgChart";
import Employees from "./hr/Employees";
import Employee from "./hr/Employee";
import Headcount from "./hr/Headcount";
import Sections from "./hr/Sections";
// eslint-disable-next-line no-unused-vars
import MeterDeviceListView from "./views/MeterDeviceListView";
// eslint-disable-next-line no-unused-vars
import SystemAnalysisView from "./views/SystemAnalysisView";
// eslint-disable-next-line no-unused-vars
import ShopGridView from "./views/ShopGridView";
import ImageView from "./views/ImageView";
import IframeView from "./views/IframeView";
import VerifyPR from "./accountant/verify-pr";
import ApprovalPR from "./accountant/approval-pr";
import PayPR from "./accountant/pay-pr";
import ChecklistAttendance from "./yhr/checklist-attendance";
import MyAttendance from "./yhr/my-attendance";
import YHR from "./yhr/index";
import SpeakUp from "./speak-up/speak-up";
import FireAlarm from "./fire-alarm/fire-alarm";
import CCTV from "./cctv/cctv";
import Recruitment from "./yhr/recruitment";
import Interview from "./yhr/interview";
import Onboarding from "./yhr/onboarding";
import BenefitProfile from "./yhr/benefit-profile";
import Payroll from "./yhr/payroll";
import VisaWorkPermit from "./yhr/visa-work-permit";
import Canteen from "./yhr/canteen";
import NSSF from "./yhr/NSSF";
import MonthlySalary from "./salary-bill/monthly-salary";
import WeeklyIncentive from "./salary-bill/weekly-incentive";
import PermitFee from "./salary-bill/permit-fee";
import ResignPayment from "./salary-bill/resign-payment";
import SalaryBill from "./salary-bill/salary-bill";
import BillClaim from "./bill-claim/bill-claim";
import ShippingBill from "./shipping-bill/shipping-bill";
import CE from "./ce/ce";
import OperationBreakdown from "./ce/OperationBreakdown";
import LinePlanning from "./ce/LinePlanning";
import Avma from "./ce/Avma";
import GarmentAnalysis from "./ce/GarmentAnalysis";
import IeMaster from "./ce/IeMaster";
import MachineFloor from "./ce/MachineFloor";
import ProductionFloor from "./ce/ProductionFloor";
import ModuleFrame from "./components/ModuleFrame";
import Cpm from "./ce/Cpm";
import StyleCosting from "./ce/StyleCosting";
import CostCentres from "./ce/CostCentres";
import ComplianceCertificate from "./digital-audit/compliance-certificate";
import AuditPlan from "./digital-audit/audit-plan";
import Checklist6S from "./digital-audit/checklist-6s";
import AuditQuestions from "./digital-audit/audit-questions";
import ShowListRequest from "./purchase-request/show-list-request";
import MasterList from "./purchase-request/master-list";
import MyConfirmReceived from "./purchase-request/my-confirm-received";
import PurchaseRequisitionForm from "./purchase-request/purchase-requisition-form";
import Meters from "./energy/meters";
import SwitchBoard from "./energy/switch-board";
import EnergySource from "./energy/energy-source";
import SolarDashboard from "./energy/solar-dashboard";
import Temperature from "./air/temperature";
import Air from "./air/air";
import RequestWorkerForm from "./temp-worker-request/request-worker-form";
import RequestWorkerList from "./temp-worker-request/request-worker-list";
import BillRecord from "./bill-record/bill-record";
import Water from "./water/index";
import WaterIn from "./water/in";
import WaterOut from "./water/out";
import GatePass from "./gatepass/gatepass";
import Visitor from "./gatepass/visitor";
import Waste from "./waste/waste";
import Boiler from "./waste/boiler";
import MeetingRoom from "./meeting-room/meeting-room";
import CarBooking from "./car-booking/car-booking";
import FaceScan from "./cctv/face-scan";
import MyFaceScan from "./cctv/my-face-scan";
import SystemAnalyze from "./system-analyze/system-analyze";
import YTMShop from "./ytm-shop/ytm-shop";
import YTM from "./ytm/ytm";
import YShop from "./y-shop/y-shop";
import TrafficLight from "./traffic-light/traffic-light";
import SOPMap from "./views/SOPMap";
import FactoryWorkflow from "./views/FactoryWorkflow";
import PWIP from "./PWIP/pwip";
import CallOut from "./Call-out/call-out";
import Training from "./training/training";
import WelcomePage from "./welcome-page";
import HappyNewYear from "./happy-new-year";
import QCFile from "./yqms/qc-file";
import PreProductionMeeting from "./yqms/PPM/pre-production-meeting";
import FinCheckDashboard from "./yqms/Fin-check/index";
import ShippingRequest from "./shipping/ShippingRequest";
import MoneyClaim from "./money-claim/money-claim";
import AutoPost from "./autopost/AutoPost";

// FC Module Components
import MrpView from "./mrp/MrpView";
import DeptView from "./deptview/DeptView";
import YwipFlow from "./ywip/YwipFlow";
import FourDP from "./fourdp/FourDP";
import LineLive from "./fourdp/LineLive";
import CutPlan from "./ypi/CutPlan";
import MaterialPortal from "./ypi/MaterialPortal";
import TechPack from "./ypi/TechPack";
import SamplePlan from "./ypi/SamplePlan";
import Costing from "./ypi/Costing";
import WarehouseMap from "./fc/WarehouseMap";
import LocationPlan from "./fc/LocationPlan";
import Calculator from "./fc/Calculator";
import InternalRollingQC from "./yqms/InternalRollingQC";
import CuttingInspection from "./yqms/CuttingInspection";
import GarmentCheckOutput from "./yqms/GarmentCheckOutput";
import PackingInspection from "./yqms/PackingInspection";
import FinalInspection from "./yqms/FinalInspection";

import AuditReport from "./yqms/AuditReport";
import BuyerFinalInspection from "./yqms/BuyerFinalInspection";
import SupplierEvaluation from "./yqms/SupplierEvaluation";
import CustomerComplainCap from "./yqms/CustomerComplainCap";
import YQMSReport from "./yqms/YQMSReport";
// eslint-disable-next-line no-unused-vars
import YQMSGlobalDashboard from "./yqms/YQMSGlobalDashboard";
import { YQMSDashboard } from "./yqms/Fin-check/Dashboard/YQMSDashboard";
import HumidityReportAdd from "./yqms/HumidityReport/add-model";
import HumidityReportList from "./yqms/HumidityReport/show-list";
import QCRovingDashboard from "./yqms/Fin-check/Dashboard/QCRovingDashboard";
import CuttingDashboard from "./yqms/Fin-check/Dashboard/CuttingDashboard";
import CuttingPanel from "./yqms/Cutting-panel";


export default function App() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <TranslationProvider>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/happy-new-year" element={<HappyNewYear />} />
        <Route path="/" element={<AppLayout />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<div />} />
          <Route
            path="training"
            element={<ModuleFrame><TrainingGridView onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="sensors"
            element={<ModuleFrame><SensorGridView onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="waste/analytics"
            element={<ModuleFrame><Waste onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="waste/boiler" element={<ModuleFrame><Boiler onBack={handleBack} /></ModuleFrame>} />
          <Route path="ytm-shop" element={<ModuleFrame><YTMShop onBack={handleBack} /></ModuleFrame>} />
          <Route path="ytm" element={<ModuleFrame><YTM onBack={handleBack} /></ModuleFrame>} />
          <Route path="y-shop" element={<ModuleFrame><YShop onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="traffic-light"
            element={<ModuleFrame><TrafficLight onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="pwip" element={<ModuleFrame><PWIP onBack={handleBack} /></ModuleFrame>} />
          <Route path="call-out" element={<ModuleFrame><CallOut onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="meeting"
            element={<ModuleFrame><TimelineView onBack={handleBack} onAdd={() => {}} /></ModuleFrame>}
          />
          <Route
            path="meeting-room"
            element={<ModuleFrame><MeetingRoom onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="car-booking"
            element={<ModuleFrame><CarBooking onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="cctv/face-scan"
            element={<ModuleFrame><FaceScan onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="cctv/my-face-scan"
            element={<ModuleFrame><MyFaceScan onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="ticket"
            element={<ModuleFrame><SupportTicketManagement onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="submenu/:moduleId" element={<SubMenuView />} />
          <Route path="image/*" element={<ImageView onBack={handleBack} />} />
          <Route path="iframe" element={<IframeView onBack={handleBack} />} />
          <Route path="verify-pr" element={<ModuleFrame><VerifyPR onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="approval-pr"
            element={<ModuleFrame><ApprovalPR onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="pay-pr" element={<ModuleFrame><PayPR onBack={handleBack} /></ModuleFrame>} />
          <Route path="yhr" element={<ModuleFrame><YHR onBack={handleBack} /></ModuleFrame>} />
          <Route path="speak-up" element={<ModuleFrame><SpeakUp onBack={handleBack} /></ModuleFrame>} />
          <Route path="fire-alarm" element={<ModuleFrame><FireAlarm onBack={handleBack} /></ModuleFrame>} />
          <Route path="cctv" element={<ModuleFrame><CCTV onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="recruitment"
            element={<ModuleFrame><Recruitment onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="interview" element={<ModuleFrame><Interview onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="onboarding"
            element={<ModuleFrame><Onboarding onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="benefit-profile"
            element={<ModuleFrame><BenefitProfile onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="payroll" element={<ModuleFrame><Payroll onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="visa-work-permit"
            element={<ModuleFrame><VisaWorkPermit onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="canteen" element={<ModuleFrame><Canteen onBack={handleBack} /></ModuleFrame>} />
          <Route path="nssf" element={<ModuleFrame><NSSF onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="salary-bill"
            element={<ModuleFrame><SalaryBill onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="bill-claim"
            element={<ModuleFrame><BillClaim onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="shipping-bill"
            element={<ModuleFrame><ShippingBill onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="monthly-salary"
            element={<ModuleFrame><MonthlySalary onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="weekly-incentive"
            element={<ModuleFrame><WeeklyIncentive onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="permit-fee"
            element={<ModuleFrame><PermitFee onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="resign-payment"
            element={<ModuleFrame><ResignPayment onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="ce" element={<CE onBack={handleBack} />} />
          {/* CE sub-modules read the simulated factory (sim/view, module "ce"); two have custom visuals */}
          <Route path="ce/avma" element={<Avma onBack={handleBack} />} />
          <Route path="ce/avma/:type" element={<Avma onBack={handleBack} />} />
          <Route path="ce/operation-video" element={<Navigate to="/dashboard/ce/avma" replace />} />
          <Route path="ce/ie-master" element={<IeMaster onBack={handleBack} />} />
          <Route path="ce/machine-layout" element={<MachineFloor lens="machine" onBack={handleBack} />} />
          <Route path="ce/line-plan" element={<MachineFloor lens="mechanic" onBack={handleBack} />} />
          <Route path="ce/machine-requirement" element={<MachineFloor lens="requirement" onBack={handleBack} />} />
          <Route path="ce/standard-time-library" element={<Navigate to="/dashboard/ce/operation-library" replace />} />
          <Route path="ce/garment-analysis" element={<GarmentAnalysis onBack={handleBack} />} />
          <Route path="ce/operation-breakdown" element={<OperationBreakdown onBack={handleBack} />} />
          <Route path="ce/line-planning" element={<LinePlanning onBack={handleBack} />} />
          <Route path="ce/cpm" element={<Cpm onBack={handleBack} />} />
          <Route path="ce/style-costing" element={<StyleCosting onBack={handleBack} />} />
          <Route path="ce/cost-centers" element={<CostCentres onBack={handleBack} />} />
          <Route path="ce/line-balancing" element={<ProductionFloor lens="balancing" onBack={handleBack} />} />
          <Route path="ce/productivity" element={<ProductionFloor lens="productivity" onBack={handleBack} />} />
          <Route path="ce/team-performance" element={<ProductionFloor lens="team" onBack={handleBack} />} />
          <Route path="ce/skill-inventory" element={<ProductionFloor lens="skill" onBack={handleBack} />} />
          <Route path="ce/learning-curve" element={<ProductionFloor lens="learning" onBack={handleBack} />} />
          <Route path="ce/downtimes" element={<ProductionFloor lens="downtime" onBack={handleBack} />} />
          <Route path="ce/:view" element={<MrpView module="ce" label="CE" onBack={handleBack} />} />
          {/* old CE addresses keep working */}
          <Route path="standard-time" element={<Navigate to="/dashboard/ce/operation-library" replace />} />
          <Route path="product-development" element={<Navigate to="/dashboard/ce/product-development" replace />} />
          <Route path="garment-analysis" element={<Navigate to="/dashboard/ce/garment-analysis" replace />} />
          <Route path="productivity" element={<Navigate to="/dashboard/ce/productivity" replace />} />
          <Route path="machine-allocation" element={<Navigate to="/dashboard/ce/machine-allocation" replace />} />
          <Route path="skill-inventory" element={<Navigate to="/dashboard/ce/skill-inventory" replace />} />
          <Route path="team-performance" element={<Navigate to="/dashboard/ce/team-performance" replace />} />
          <Route path="learning-curve" element={<Navigate to="/dashboard/ce/learning-curve" replace />} />
          <Route path="downtimes" element={<Navigate to="/dashboard/ce/downtimes" replace />} />
          <Route path="cost-centers" element={<Navigate to="/dashboard/ce/cost-centers" replace />} />
          <Route path="cpm" element={<Navigate to="/dashboard/ce/cpm" replace />} />
          <Route path="style-costing" element={<Navigate to="/dashboard/ce/style-costing" replace />} />
          <Route
            path="checklist-attendance"
            element={<ModuleFrame><ChecklistAttendance onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="my-attendance"
            element={<ModuleFrame><MyAttendance onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="compliance-certificate"
            element={<ModuleFrame><ComplianceCertificate onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="audit-plan"
            element={<ModuleFrame><AuditPlan onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="checklist-6s"
            element={<ModuleFrame><Checklist6S onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="digital-audit-questions"
            element={<ModuleFrame><AuditQuestions onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="purchase-requisition-form"
            element={<ModuleFrame><PurchaseRequisitionForm onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="show-list-request"
            element={<ModuleFrame><ShowListRequest onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="master-list"
            element={<ModuleFrame><MasterList onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="my-confirm-received"
            element={<ModuleFrame><MyConfirmReceived onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="org-chart-master"
            element={<OrgChart onBack={handleBack} />}
          />
          <Route
            path="energy/meters"
            element={<ModuleFrame><Meters onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="energy/switch-board"
            element={<ModuleFrame><SwitchBoard onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="energy/energy-source"
            element={<ModuleFrame><EnergySource onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="energy/solar-dashboard"
            element={<ModuleFrame><SolarDashboard onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="air/temperature"
            element={<ModuleFrame><Temperature onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="air/quality" element={<ModuleFrame><Air onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="temp-worker-request/form"
            element={<ModuleFrame><RequestWorkerForm onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="temp-worker-request/list"
            element={<ModuleFrame><RequestWorkerList onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="bill-record"
            element={<ModuleFrame><BillRecord onBack={handleBack} /></ModuleFrame>}
          />
          <Route path="water" element={<ModuleFrame><Water onBack={handleBack} /></ModuleFrame>} />
          <Route path="water/in" element={<ModuleFrame><WaterIn onBack={handleBack} /></ModuleFrame>} />
          <Route path="water/out" element={<ModuleFrame><WaterOut onBack={handleBack} /></ModuleFrame>} />
          <Route path="gatepass" element={<ModuleFrame><GatePass onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="gatepass/visitor"
            element={<ModuleFrame><Visitor onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="system-analysis"
            element={<ModuleFrame><SystemAnalyze onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="sop-map"
            element={<SOPMap onBack={handleBack} />}
          />
          <Route
            path="factory-workflow"
            element={<FactoryWorkflow onBack={handleBack} />}
          />
          <Route
            path="waste"
            element={<ModuleFrame><WasteDashboardView onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="training/:department"
            element={<ModuleFrame><Training onBack={handleBack} /></ModuleFrame>}
          />

          {/* YWIP — the work-in-progress flow as an isometric infographic */}
          <Route path="ywip" element={<YwipFlow onBack={handleBack} />} />
          {/* MRP sub-modules — data from the simulated factory on the M1 */}
          <Route path="mrp/:view" element={<MrpView onBack={handleBack} />} />
          {/* Admin & Support sub-modules — same simulated factory, one shared
              screen that also draws the trend chart and the extra tables these
              departments send (HR absence trend, CSR area/waste-water tables). */}
          <Route path="hr/employees" element={<Employees onBack={handleBack} />} />
          <Route path="hr/employee/:id" element={<Employee onBack={handleBack} />} />
          <Route path="hr/headcount" element={<Headcount onBack={handleBack} />} />
          <Route path="hr/sections" element={<Sections onBack={handleBack} />} />
          <Route path="hr/:view" element={<DeptView module="hr" label="HR" onBack={handleBack} />} />
          <Route path="admin/:view" element={<DeptView module="admin" label="Admin" onBack={handleBack} />} />
          <Route path="accounting/:view" element={<DeptView module="accounting" label="Accounting" onBack={handleBack} />} />
          <Route path="csr/:view" element={<DeptView module="csr" label="CSR" onBack={handleBack} />} />
          {/* 4DP sub-modules: Master Plan, Unit Plan, Line Plan T&A, Line Plan, MRP TV, TEC TV */}
          <Route path="4dp/line/:line" element={<LineLive />} />
          <Route path="4dp/:view" element={<FourDP onBack={() => navigate("/")} />} />
          <Route path="4dp" element={<FourDP onBack={() => navigate("/")} />} />
          {/* YPI: Marker & Cut Plan (the cut plan of one order, and the list of markers) */}
          <Route path="ypi/cut-plan" element={<CutPlan view="cut-plan" onBack={() => navigate("/")} />} />
          <Route path="ypi/markers" element={<CutPlan view="markers" onBack={() => navigate("/")} />} />
          {/* YPI: Material Portal (BOM and buying of one order), BOM status (every order), Tech-pack overview */}
          <Route path="ypi/material-portal" element={<MaterialPortal view="material-portal" onBack={() => navigate("/")} />} />
          <Route path="ypi/sample-plan" element={<SamplePlan />} />
          <Route path="ypi/costing" element={<Costing />} />
          <Route path="ypi/bom-status" element={<MaterialPortal view="bom-status" onBack={() => navigate("/")} />} />
          <Route path="ypi/techpack" element={<TechPack />} />

          {/* FC Module Routes */}
          <Route
            path="fc/fabric-receiving"
            element={<MrpView module="fc" view="fabric-receiving" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/accessories-receiving"
            element={<MrpView module="fc" view="accessories-receiving" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/fabric-inspection"
            element={<MrpView module="fc" view="fabric-inspection" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/fabric-test"
            element={<MrpView module="fc" view="fabric-test" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/accessories-inspection"
            element={<MrpView module="fc" view="accessories-inspection" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/warehouse-tracking"
            element={<WarehouseMap onBack={handleBack} />}
          />
          <Route
            path="fc/location-plan"
            element={<LocationPlan onBack={handleBack} />}
          />
          <Route
            path="fc/consumptions"
            element={<MrpView module="fc" view="consumptions" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/calculator"
            element={<ModuleFrame><Calculator onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="fc/fabric-issuing"
            element={<MrpView module="fc" view="fabric-issuing" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/accessories-issuing"
            element={<MrpView module="fc" view="accessories-issuing" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/delivery-tracking"
            element={<MrpView module="fc" view="delivery-tracking" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/return-fabric"
            element={<MrpView module="fc" view="return-fabric" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/return-accessories"
            element={<MrpView module="fc" view="return-accessories" label="Fabric Control" onBack={handleBack} />}
          />
          <Route
            path="fc/brand-protection"
            element={<MrpView module="fc" view="brand-protection" label="Fabric Control" onBack={handleBack} />}
          />

          {/* YQMS Module Routes */}
          <Route path="yqms/qc-file" element={<ModuleFrame><QCFile onBack={handleBack} /></ModuleFrame>} />
          <Route
            path="yqms/pre-production-meeting"
            element={<ModuleFrame><PreProductionMeeting onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/fin-check"
            element={<ModuleFrame><FinCheckDashboard onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/rolling-qc"
            element={<ModuleFrame><InternalRollingQC onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/cutting-inspection"
            element={<ModuleFrame><CuttingInspection onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/sewing-output"
            element={<ModuleFrame><GarmentCheckOutput onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/packing-inspection"
            element={<ModuleFrame><PackingInspection onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/final-inspection"
            element={<ModuleFrame><FinalInspection onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/ppm"
            element={<ModuleFrame><PreProductionMeeting onBack={handleBack} /></ModuleFrame>}
          />

          {/* Additional YQMS Routes using AuditReport */}
          <Route
            path="yqms/20pcs-audit"
            element={<ModuleFrame><AuditReport title="QA 20pcs Audit" onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/inline-audit"
            element={
            <ModuleFrame>
              <AuditReport title="Inline Audit Rolling" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/offline-audit"
            element={<ModuleFrame><AuditReport title="Offline Audit" onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/endline-check"
            element={
            <ModuleFrame>
              <AuditReport title="QC End Line Checking" onBack={handleBack} />
            </ModuleFrame>
            }
          />

          <Route
            path="yqms/first-output-cutting"
            element={
            <ModuleFrame>
              <AuditReport title="First Output Cutting" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/pre-final"
            element={
            <ModuleFrame>
              <AuditReport title="Pre Final Inspection" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/buyer-final"
            element={<ModuleFrame><BuyerFinalInspection onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/supplier-evaluation"
            element={<ModuleFrame><SupplierEvaluation onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/cap"
            element={<ModuleFrame><CustomerComplainCap onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/qa-audit-finishing"
            element={
            <ModuleFrame>
              <AuditReport
                title="QA Audit Finishing Packing"
                onBack={handleBack}
              />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/first-output-finishing"
            element={
            <ModuleFrame>
              <AuditReport
                title="First Output Finishing And Packing"
                onBack={handleBack}
              />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/report"
            element={<ModuleFrame><YQMSReport onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/ironing-inspection"
            element={
            <ModuleFrame>
              <AuditReport title="Ironing Inspection" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/aquaboy"
            element={<ModuleFrame><HumidityReportAdd onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/aquaboy/list"
            element={<ModuleFrame><HumidityReportList onBack={handleBack} /></ModuleFrame>}
          />

          <Route
            path="yqms/dashboard"
            element={<ModuleFrame><YQMSDashboard onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/qc-roving"
            element={<ModuleFrame><CuttingDashboard onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/cutting"
            element={<ModuleFrame><QCRovingDashboard onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/first-output-print"
            element={
            <ModuleFrame>
              <AuditReport
                title="First Output Printing/Embroidery"
                onBack={handleBack}
              />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/first-output-sewing"
            element={
            <ModuleFrame>
              <AuditReport title="First Output Sewing" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/qa-cutting"
            element={<ModuleFrame><AuditReport title="QA Cutting" onBack={handleBack} /></ModuleFrame>}
          />
          <Route
            path="yqms/qa-print"
            element={
            <ModuleFrame>
              <AuditReport title="QA Printing/Embroidery" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/cut-panel-inspection"
            element={<ModuleFrame><CuttingPanel onBack={handleBack} /></ModuleFrame>}
          />

          <Route
            path="yqms/printing-inspection"
            element={
            <ModuleFrame>
              <AuditReport title="Printing Inspection" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/embroidery-inspection"
            element={
            <ModuleFrame>
              <AuditReport title="Embroidery Inspection" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/finishing-inspection"
            element={
            <ModuleFrame>
              <AuditReport title="Finishing Inspection" onBack={handleBack} />
            </ModuleFrame>
            }
          />
          <Route
            path="yqms/ironing-inspection"
            element={
            <ModuleFrame>
              <AuditReport title="Ironing Inspection" onBack={handleBack} />
            </ModuleFrame>
            }
          />

          <Route
            path="shipping/request"
            element={<ModuleFrame><ShippingRequest onBack={handleBack} /></ModuleFrame>}
          />

          <Route path="money-claim" element={<ModuleFrame><MoneyClaim onBack={handleBack} /></ModuleFrame>} />
          <Route path="autopost" element={<ModuleFrame><AutoPost onBack={handleBack} /></ModuleFrame>} />
          <Route path=":moduleId" element={<TableView onBack={handleBack} />} />
        </Route>
      </Routes>
    </TranslationProvider>
  );
}
