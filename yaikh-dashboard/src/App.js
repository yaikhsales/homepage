import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import OrgChartView from "./views/OrgChartView";
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
import StandardTime from "./ce/standard-time";
import ProductDevelopment from "./ce/product-development";
import GarmentAnalysis from "./ce/garment-analysis";
import Productivity from "./ce/productivity";
import MachineAllocation from "./ce/machine-allocation";
import SkillInventory from "./ce/skill-inventory";
import TeamPerformance from "./ce/team-performance";
import LearningCurve from "./ce/learning-curve";
import Downtimes from "./ce/downtimes";
import CostCenters from "./ce/cost-centers";
import CPM from "./ce/cpm";
import StyleCosting from "./ce/style-costing";
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
import FabricReceiving from "./fc/FabricReceiving";
import AccessoriesReceiving from "./fc/AccessoriesReceiving";
import FabricInspection from "./fc/FabricInspection";
import FabricTest from "./fc/FabricTest";
import AccessoriesInspection from "./fc/AccessoriesInspection";
import WarehouseTracking from "./fc/WarehouseTracking";
import Consumptions from "./fc/Consumptions";
import Calculator from "./fc/Calculator";
import FabricIssuing from "./fc/FabricIssuing";
import AccessoriesIssuing from "./fc/AccessoriesIssuing";
import DeliveryTracking from "./fc/DeliveryTracking";
import ReturnFabric from "./fc/ReturnFabric";
import ReturnAccessories from "./fc/ReturnAccessories";
import BrandProtection from "./fc/BrandProtection";
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
            element={<TrainingGridView onBack={handleBack} />}
          />
          <Route
            path="sensors"
            element={<SensorGridView onBack={handleBack} />}
          />
          <Route
            path="waste/analytics"
            element={<Waste onBack={handleBack} />}
          />
          <Route path="waste/boiler" element={<Boiler onBack={handleBack} />} />
          <Route path="ytm-shop" element={<YTMShop onBack={handleBack} />} />
          <Route path="ytm" element={<YTM onBack={handleBack} />} />
          <Route path="y-shop" element={<YShop onBack={handleBack} />} />
          <Route
            path="traffic-light"
            element={<TrafficLight onBack={handleBack} />}
          />
          <Route path="pwip" element={<PWIP onBack={handleBack} />} />
          <Route path="call-out" element={<CallOut onBack={handleBack} />} />
          <Route
            path="meeting"
            element={<TimelineView onBack={handleBack} onAdd={() => {}} />}
          />
          <Route
            path="meeting-room"
            element={<MeetingRoom onBack={handleBack} />}
          />
          <Route
            path="car-booking"
            element={<CarBooking onBack={handleBack} />}
          />
          <Route
            path="cctv/face-scan"
            element={<FaceScan onBack={handleBack} />}
          />
          <Route
            path="cctv/my-face-scan"
            element={<MyFaceScan onBack={handleBack} />}
          />
          <Route
            path="ticket"
            element={<SupportTicketManagement onBack={handleBack} />}
          />
          <Route path="submenu/:moduleId" element={<SubMenuView />} />
          <Route path="image/*" element={<ImageView onBack={handleBack} />} />
          <Route path="iframe" element={<IframeView onBack={handleBack} />} />
          <Route path="verify-pr" element={<VerifyPR onBack={handleBack} />} />
          <Route
            path="approval-pr"
            element={<ApprovalPR onBack={handleBack} />}
          />
          <Route path="pay-pr" element={<PayPR onBack={handleBack} />} />
          <Route path="yhr" element={<YHR onBack={handleBack} />} />
          <Route path="speak-up" element={<SpeakUp onBack={handleBack} />} />
          <Route
            path="recruitment"
            element={<Recruitment onBack={handleBack} />}
          />
          <Route path="interview" element={<Interview onBack={handleBack} />} />
          <Route
            path="onboarding"
            element={<Onboarding onBack={handleBack} />}
          />
          <Route
            path="benefit-profile"
            element={<BenefitProfile onBack={handleBack} />}
          />
          <Route path="payroll" element={<Payroll onBack={handleBack} />} />
          <Route
            path="visa-work-permit"
            element={<VisaWorkPermit onBack={handleBack} />}
          />
          <Route path="canteen" element={<Canteen onBack={handleBack} />} />
          <Route path="nssf" element={<NSSF onBack={handleBack} />} />
          <Route
            path="salary-bill"
            element={<SalaryBill onBack={handleBack} />}
          />
          <Route
            path="bill-claim"
            element={<BillClaim onBack={handleBack} />}
          />
          <Route
            path="shipping-bill"
            element={<ShippingBill onBack={handleBack} />}
          />
          <Route
            path="monthly-salary"
            element={<MonthlySalary onBack={handleBack} />}
          />
          <Route
            path="weekly-incentive"
            element={<WeeklyIncentive onBack={handleBack} />}
          />
          <Route
            path="permit-fee"
            element={<PermitFee onBack={handleBack} />}
          />
          <Route
            path="resign-payment"
            element={<ResignPayment onBack={handleBack} />}
          />
          <Route path="ce" element={<CE onBack={handleBack} />} />
          <Route
            path="standard-time"
            element={<StandardTime onBack={handleBack} />}
          />
          <Route
            path="product-development"
            element={<ProductDevelopment onBack={handleBack} />}
          />
          <Route
            path="garment-analysis"
            element={<GarmentAnalysis onBack={handleBack} />}
          />
          <Route
            path="productivity"
            element={<Productivity onBack={handleBack} />}
          />
          <Route
            path="machine-allocation"
            element={<MachineAllocation onBack={handleBack} />}
          />
          <Route
            path="skill-inventory"
            element={<SkillInventory onBack={handleBack} />}
          />
          <Route
            path="team-performance"
            element={<TeamPerformance onBack={handleBack} />}
          />
          <Route
            path="learning-curve"
            element={<LearningCurve onBack={handleBack} />}
          />
          <Route path="downtimes" element={<Downtimes onBack={handleBack} />} />
          <Route
            path="cost-centers"
            element={<CostCenters onBack={handleBack} />}
          />
          <Route path="cpm" element={<CPM onBack={handleBack} />} />
          <Route
            path="style-costing"
            element={<StyleCosting onBack={handleBack} />}
          />
          <Route
            path="checklist-attendance"
            element={<ChecklistAttendance onBack={handleBack} />}
          />
          <Route
            path="my-attendance"
            element={<MyAttendance onBack={handleBack} />}
          />
          <Route
            path="compliance-certificate"
            element={<ComplianceCertificate onBack={handleBack} />}
          />
          <Route
            path="audit-plan"
            element={<AuditPlan onBack={handleBack} />}
          />
          <Route
            path="checklist-6s"
            element={<Checklist6S onBack={handleBack} />}
          />
          <Route
            path="digital-audit-questions"
            element={<AuditQuestions onBack={handleBack} />}
          />
          <Route
            path="purchase-requisition-form"
            element={<PurchaseRequisitionForm onBack={handleBack} />}
          />
          <Route
            path="show-list-request"
            element={<ShowListRequest onBack={handleBack} />}
          />
          <Route
            path="master-list"
            element={<MasterList onBack={handleBack} />}
          />
          <Route
            path="my-confirm-received"
            element={<MyConfirmReceived onBack={handleBack} />}
          />
          <Route
            path="org-chart-master"
            element={<OrgChartView onBack={handleBack} />}
          />
          <Route
            path="energy/meters"
            element={<Meters onBack={handleBack} />}
          />
          <Route
            path="energy/switch-board"
            element={<SwitchBoard onBack={handleBack} />}
          />
          <Route
            path="energy/energy-source"
            element={<EnergySource onBack={handleBack} />}
          />
          <Route
            path="energy/solar-dashboard"
            element={<SolarDashboard onBack={handleBack} />}
          />
          <Route
            path="air/temperature"
            element={<Temperature onBack={handleBack} />}
          />
          <Route path="air/quality" element={<Air onBack={handleBack} />} />
          <Route
            path="temp-worker-request/form"
            element={<RequestWorkerForm onBack={handleBack} />}
          />
          <Route
            path="temp-worker-request/list"
            element={<RequestWorkerList onBack={handleBack} />}
          />
          <Route
            path="bill-record"
            element={<BillRecord onBack={handleBack} />}
          />
          <Route path="water" element={<Water onBack={handleBack} />} />
          <Route path="water/in" element={<WaterIn onBack={handleBack} />} />
          <Route path="water/out" element={<WaterOut onBack={handleBack} />} />
          <Route path="gatepass" element={<GatePass onBack={handleBack} />} />
          <Route
            path="gatepass/visitor"
            element={<Visitor onBack={handleBack} />}
          />
          <Route
            path="system-analysis"
            element={<SystemAnalyze onBack={handleBack} />}
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
            element={<WasteDashboardView onBack={handleBack} />}
          />
          <Route
            path="training/:department"
            element={<Training onBack={handleBack} />}
          />

          {/* FC Module Routes */}
          <Route
            path="fc/fabric-receiving"
            element={<FabricReceiving onBack={handleBack} />}
          />
          <Route
            path="fc/accessories-receiving"
            element={<AccessoriesReceiving onBack={handleBack} />}
          />
          <Route
            path="fc/fabric-inspection"
            element={<FabricInspection onBack={handleBack} />}
          />
          <Route
            path="fc/fabric-test"
            element={<FabricTest onBack={handleBack} />}
          />
          <Route
            path="fc/accessories-inspection"
            element={<AccessoriesInspection onBack={handleBack} />}
          />
          <Route
            path="fc/warehouse-tracking"
            element={<WarehouseTracking onBack={handleBack} />}
          />
          <Route
            path="fc/consumptions"
            element={<Consumptions onBack={handleBack} />}
          />
          <Route
            path="fc/calculator"
            element={<Calculator onBack={handleBack} />}
          />
          <Route
            path="fc/fabric-issuing"
            element={<FabricIssuing onBack={handleBack} />}
          />
          <Route
            path="fc/accessories-issuing"
            element={<AccessoriesIssuing onBack={handleBack} />}
          />
          <Route
            path="fc/delivery-tracking"
            element={<DeliveryTracking onBack={handleBack} />}
          />
          <Route
            path="fc/return-fabric"
            element={<ReturnFabric onBack={handleBack} />}
          />
          <Route
            path="fc/return-accessories"
            element={<ReturnAccessories onBack={handleBack} />}
          />
          <Route
            path="fc/brand-protection"
            element={<BrandProtection onBack={handleBack} />}
          />

          {/* YQMS Module Routes */}
          <Route path="yqms/qc-file" element={<QCFile onBack={handleBack} />} />
          <Route
            path="yqms/pre-production-meeting"
            element={<PreProductionMeeting onBack={handleBack} />}
          />
          <Route
            path="yqms/fin-check"
            element={<FinCheckDashboard onBack={handleBack} />}
          />
          <Route
            path="yqms/rolling-qc"
            element={<InternalRollingQC onBack={handleBack} />}
          />
          <Route
            path="yqms/cutting-inspection"
            element={<CuttingInspection onBack={handleBack} />}
          />
          <Route
            path="yqms/sewing-output"
            element={<GarmentCheckOutput onBack={handleBack} />}
          />
          <Route
            path="yqms/packing-inspection"
            element={<PackingInspection onBack={handleBack} />}
          />
          <Route
            path="yqms/final-inspection"
            element={<FinalInspection onBack={handleBack} />}
          />
          <Route
            path="yqms/ppm"
            element={<PreProductionMeeting onBack={handleBack} />}
          />

          {/* Additional YQMS Routes using AuditReport */}
          <Route
            path="yqms/20pcs-audit"
            element={<AuditReport title="QA 20pcs Audit" onBack={handleBack} />}
          />
          <Route
            path="yqms/inline-audit"
            element={
              <AuditReport title="Inline Audit Rolling" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/offline-audit"
            element={<AuditReport title="Offline Audit" onBack={handleBack} />}
          />
          <Route
            path="yqms/endline-check"
            element={
              <AuditReport title="QC End Line Checking" onBack={handleBack} />
            }
          />

          <Route
            path="yqms/first-output-cutting"
            element={
              <AuditReport title="First Output Cutting" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/pre-final"
            element={
              <AuditReport title="Pre Final Inspection" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/buyer-final"
            element={<BuyerFinalInspection onBack={handleBack} />}
          />
          <Route
            path="yqms/supplier-evaluation"
            element={<SupplierEvaluation onBack={handleBack} />}
          />
          <Route
            path="yqms/cap"
            element={<CustomerComplainCap onBack={handleBack} />}
          />
          <Route
            path="yqms/qa-audit-finishing"
            element={
              <AuditReport
                title="QA Audit Finishing Packing"
                onBack={handleBack}
              />
            }
          />
          <Route
            path="yqms/first-output-finishing"
            element={
              <AuditReport
                title="First Output Finishing And Packing"
                onBack={handleBack}
              />
            }
          />
          <Route
            path="yqms/report"
            element={<YQMSReport onBack={handleBack} />}
          />
          <Route
            path="yqms/ironing-inspection"
            element={
              <AuditReport title="Ironing Inspection" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/aquaboy"
            element={<HumidityReportAdd onBack={handleBack} />}
          />
          <Route
            path="yqms/aquaboy/list"
            element={<HumidityReportList onBack={handleBack} />}
          />

          <Route
            path="yqms/dashboard"
            element={<YQMSDashboard onBack={handleBack} />}
          />
          <Route
            path="yqms/qc-roving"
            element={<CuttingDashboard onBack={handleBack} />}
          />
          <Route
            path="yqms/cutting"
            element={<QCRovingDashboard onBack={handleBack} />}
          />
          <Route
            path="yqms/first-output-print"
            element={
              <AuditReport
                title="First Output Printing/Embroidery"
                onBack={handleBack}
              />
            }
          />
          <Route
            path="yqms/first-output-sewing"
            element={
              <AuditReport title="First Output Sewing" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/qa-cutting"
            element={<AuditReport title="QA Cutting" onBack={handleBack} />}
          />
          <Route
            path="yqms/qa-print"
            element={
              <AuditReport title="QA Printing/Embroidery" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/cut-panel-inspection"
            element={<CuttingPanel onBack={handleBack} />}
          />

          <Route
            path="yqms/printing-inspection"
            element={
              <AuditReport title="Printing Inspection" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/embroidery-inspection"
            element={
              <AuditReport title="Embroidery Inspection" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/finishing-inspection"
            element={
              <AuditReport title="Finishing Inspection" onBack={handleBack} />
            }
          />
          <Route
            path="yqms/ironing-inspection"
            element={
              <AuditReport title="Ironing Inspection" onBack={handleBack} />
            }
          />

          <Route
            path="shipping/request"
            element={<ShippingRequest onBack={handleBack} />}
          />

          <Route path="money-claim" element={<MoneyClaim onBack={handleBack} />} />
          <Route path="autopost" element={<AutoPost onBack={handleBack} />} />
          <Route path=":moduleId" element={<TableView onBack={handleBack} />} />
        </Route>
      </Routes>
    </TranslationProvider>
  );
}
