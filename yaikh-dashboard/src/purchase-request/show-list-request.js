import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Download,
  FileText,
  MessageCircle,
  Video,
} from "lucide-react";
import ImageViewer from "../components/ImageViewer";
import PdfViewer from "../components/PdfViewer";
import GeneralAIAgent from "../general-ag";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const ShowListRequest = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState("");
  const [selectedPdfPath, setSelectedPdfPath] = useState("");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  // Removed unused filter states - keeping for potential future use

  // Sample purchase request data matching the image exactly
  const sampleRequests = [
    {
      code: 1933,
      name: "LI MING",
      profileImage:
        "https://ym.kottrahr.com/Uploads/Images/Employee/H01_0000841520240816151942.jpeg",
      department: "TPM",
      productService: "益新/机针/针车零件/...",
      requestDate: "22-12-25",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "WANG QIURONG",
        approvedDate: "12/27/25",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "12/30/25",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "12/30/25",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1932,
      name: "V nn cheat",
      profileImage:
        "https://ym.kottrahr.com/Uploads/Images/Employee/H01_0000439320241230165111.jpeg",
      department: "CSR",
      productService: "MOE Wastewater Testi...",
      requestDate: "22-12-25",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "KASSAPA GUNASINGHA",
        approvedDate: "12/22/25",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "12/24/25",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "12/24/25",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "paid",
        paidDate: "12/25/25",
      },
      hasReturnMessage: true,
      returnMessage: "Buy 75g paper, i/o 70g.... paper jam.",
    },
    {
      code: 1931,
      name: "eurn Li",
      profileImage:
        "https://ym.kottrahr.com/Uploads/Images/Employee/H01_0000761120230620092706.jpeg",
      department: "Admin",
      productService: "New Purchase",
      requestDate: "22-12-25",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "12/31/25",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1930,
      name: "LIU MINGYU",
      profileImage:
        "https://ym.kottrahr.com/Uploads/Images/Employee/H01_0000841520240816151942.jpeg",
      department: "TPM",
      productService: "国成/针车零件/气管接...",
      requestDate: "22-12-25",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "WANG QIURONG",
        approvedDate: "12/27/25",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "12/30/25",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "12/30/25",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1900,
      name: "Sok Samnang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000415420220331144000.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1899,
      name: "Touch Borey",
      profileImage: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1898,
      name: "Chan Thavy",
      profileImage: "/assets/Yaikh-Uploads/H01_0000415620210721081000.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1897,
      name: "Keo Leakhena",
      profileImage: "/assets/Yaikh-Uploads/H01_0000415920241228104419.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1896,
      name: "Seng Sophea",
      profileImage: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1895,
      name: "Mao Vanna",
      profileImage: "/assets/Yaikh-Uploads/H01_0000416420220318125258.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1894,
      name: "Heng Piseth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000416520220318125329.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1893,
      name: "Ouk Sokhom",
      profileImage: "/assets/Yaikh-Uploads/H01_0000416620220713102009.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1892,
      name: "Sim Sreyneang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000416720210711152309.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1891,
      name: "Bun Reth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000416820211223105114.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1890,
      name: "Chea Srey",
      profileImage: "/assets/Yaikh-Uploads/H01_0000416920220318125405.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1889,
      name: "Phan Sopheak",
      profileImage: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1888,
      name: "Kim Chanda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000417520210721080641.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1887,
      name: "Nhean Sovann",
      profileImage: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1886,
      name: "Preap Sovath",
      profileImage: "/assets/Yaikh-Uploads/H01_0000417820210711152433.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1885,
      name: "Sinn Sisamouth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000417920220318125541.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1884,
      name: "Ros Sereysothea",
      profileImage: "/assets/Yaikh-Uploads/H01_0000418120210711152449.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1883,
      name: "Pen Ron",
      profileImage: "/assets/Yaikh-Uploads/H01_0000418220220331143852.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1882,
      name: "Meng Keo Pichenda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000418520241228122016.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1881,
      name: "Noy Vanneth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000418720241228102121.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1880,
      name: "Sok Samnang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000418820220318125710.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1879,
      name: "Touch Borey",
      profileImage: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1878,
      name: "Chan Thavy",
      profileImage: "/assets/Yaikh-Uploads/H01_0000419420241228103252.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1877,
      name: "Keo Leakhena",
      profileImage: "/assets/Yaikh-Uploads/H01_0000419520241228121702.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1876,
      name: "Seng Sophea",
      profileImage: "/assets/Yaikh-Uploads/H01_0000419720220311101310.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1875,
      name: "Mao Vanna",
      profileImage: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1874,
      name: "Heng Piseth",
      profileImage: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1873,
      name: "Ouk Sokhom",
      profileImage: "/assets/Yaikh-Uploads/H01_0000420020210711152501.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1872,
      name: "Sim Sreyneang",
      profileImage: "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1871,
      name: "Bun Reth",
      profileImage: "/assets/Yaikh-Uploads/H01_00004203_20250903122655.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1870,
      name: "Chea Srey",
      profileImage: "/assets/Yaikh-Uploads/H01_0000420420241228122514.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1869,
      name: "Phan Sopheak",
      profileImage: "/assets/Yaikh-Uploads/H01_0000420520220318130017.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1868,
      name: "Kim Chanda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000420920210711152515.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1867,
      name: "Nhean Sovann",
      profileImage: "/assets/Yaikh-Uploads/H01_0000421020220325142145.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1866,
      name: "Preap Sovath",
      profileImage: "/assets/Yaikh-Uploads/H01_0000421120220331144749.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1865,
      name: "Sinn Sisamouth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000421220210721080659.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1864,
      name: "Ros Sereysothea",
      profileImage: "/assets/Yaikh-Uploads/H01_00004216_20260114093811.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1863,
      name: "Pen Ron",
      profileImage: "/assets/Yaikh-Uploads/H01_0000421720210721080659.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1862,
      name: "Meng Keo Pichenda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000421820210721080718.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1861,
      name: "Noy Vanneth",
      profileImage: "/assets/Yaikh-Uploads/H01_00004219_20260114093834.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1860,
      name: "Sok Samnang",
      profileImage: "/assets/Yaikh-Uploads/H01_00004220_20260108154036.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1859,
      name: "Touch Borey",
      profileImage: "/assets/Yaikh-Uploads/H01_00004222_20260110130201.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1858,
      name: "Chan Thavy",
      profileImage: "/assets/Yaikh-Uploads/H01_0000422320220331143907.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1857,
      name: "Keo Leakhena",
      profileImage: "/assets/Yaikh-Uploads/H01_0000422420210721080718.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1856,
      name: "Seng Sophea",
      profileImage: "/assets/Yaikh-Uploads/H01_00004225_20260112095718.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1855,
      name: "Mao Vanna",
      profileImage: "/assets/Yaikh-Uploads/H01_0000422620220318130150.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1854,
      name: "Heng Piseth",
      profileImage: "/assets/Yaikh-Uploads/H01_00004227_20260110104235.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1853,
      name: "Ouk Sokhom",
      profileImage: "/assets/Yaikh-Uploads/H01_0000422820220318130216.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1852,
      name: "Sim Sreyneang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000422920220318130230.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1851,
      name: "Bun Reth",
      profileImage: "/assets/Yaikh-Uploads/H01_00004230_20260112095743.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1850,
      name: "Chea Srey",
      profileImage: "/assets/Yaikh-Uploads/H01_0000423320220325143707.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1849,
      name: "Phan Sopheak",
      profileImage: "/assets/Yaikh-Uploads/H01_0000423520210721080737.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1848,
      name: "Kim Chanda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000423620241228104308.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1847,
      name: "Nhean Sovann",
      profileImage: "/assets/Yaikh-Uploads/H01_00004237_20260110130233.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1846,
      name: "Preap Sovath",
      profileImage: "/assets/Yaikh-Uploads/H01_00004238_20260114093925.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1845,
      name: "Sinn Sisamouth",
      profileImage: "/assets/Yaikh-Uploads/H01_00004239_20251215163445.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1844,
      name: "Ros Sereysothea",
      profileImage: "/assets/Yaikh-Uploads/H01_00004240_20260110104302.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1843,
      name: "Pen Ron",
      profileImage: "/assets/Yaikh-Uploads/H01_00004273_20260112130342.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1842,
      name: "Meng Keo Pichenda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000428120220827094405.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1841,
      name: "Noy Vanneth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000430720241228121758.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1840,
      name: "Sok Samnang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000436320210721081018.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1839,
      name: "Touch Borey",
      profileImage: "/assets/Yaikh-Uploads/H01_00004364_20250131131525.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1838,
      name: "Chan Thavy",
      profileImage: "/assets/Yaikh-Uploads/H01_00004365_20250203123742.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1837,
      name: "Keo Leakhena",
      profileImage: "/assets/Yaikh-Uploads/H01_0000436620211222080009.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1836,
      name: "Seng Sophea",
      profileImage: "/assets/Yaikh-Uploads/H01_0000437020211222075243.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1835,
      name: "Mao Vanna",
      profileImage: "/assets/Yaikh-Uploads/H01_00004379_20250729131339.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1834,
      name: "Heng Piseth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000438020211208095628.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1833,
      name: "Ouk Sokhom",
      profileImage: "/assets/Yaikh-Uploads/H01_0000438720220326094450.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1832,
      name: "Sim Sreyneang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000439320241230165111.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1831,
      name: "Bun Reth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000441920211222075612.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1830,
      name: "Chea Srey",
      profileImage: "/assets/Yaikh-Uploads/H01_0000444420241203130427.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1829,
      name: "Phan Sopheak",
      profileImage: "/assets/Yaikh-Uploads/H01_0000448220241228104335.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1828,
      name: "Kim Chanda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000461020210721080902.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1827,
      name: "Nhean Sovann",
      profileImage: "/assets/Yaikh-Uploads/H01_0000471820230929172936.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1826,
      name: "Preap Sovath",
      profileImage: "/assets/Yaikh-Uploads/H01_00004905_20260110104422.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1825,
      name: "Sinn Sisamouth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000521720220126164724.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1824,
      name: "Ros Sereysothea",
      profileImage: "/assets/Yaikh-Uploads/H01_0000543920230316124026.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1823,
      name: "Pen Ron",
      profileImage: "/assets/Yaikh-Uploads/H01_0000590020241228121849.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1822,
      name: "Meng Keo Pichenda",
      profileImage: "/assets/Yaikh-Uploads/H01_0000609920241228121909.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1821,
      name: "Noy Vanneth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000618520210817163056.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1820,
      name: "Sok Samnang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000649620250102095758.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1819,
      name: "Touch Borey",
      profileImage: "/assets/Yaikh-Uploads/H01_00006801_20251119095908.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1818,
      name: "Chan Thavy",
      profileImage: "/assets/Yaikh-Uploads/H01_0000683220241230165029.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1817,
      name: "Keo Leakhena",
      profileImage: "/assets/Yaikh-Uploads/H01_0000705420241228121921.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1816,
      name: "Seng Sophea",
      profileImage: "/assets/Yaikh-Uploads/H01_0000706320220930082804.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1815,
      name: "Mao Vanna",
      profileImage: "/assets/Yaikh-Uploads/H01_0000735020230109135540.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1814,
      name: "Heng Piseth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000761120230620092706.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "returned",
      returnMessage: "Wrong specification ordered.",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: true,
    },
    {
      code: 1813,
      name: "Ouk Sokhom",
      profileImage: "/assets/Yaikh-Uploads/H01_0000803120231103125217.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1812,
      name: "Sim Sreyneang",
      profileImage: "/assets/Yaikh-Uploads/H01_0000820720240504121622.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1811,
      name: "Bun Reth",
      profileImage: "/assets/Yaikh-Uploads/H01_0000828120240619102032.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1810,
      name: "Chea Srey",
      profileImage: "/assets/Yaikh-Uploads/H01_00009487_20251224102241.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1809,
      name: "Phan Sopheak",
      profileImage: "/assets/Yaikh-Uploads/H01_00009488_20251224125815.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1808,
      name: "Kim Chanda",
      profileImage: "/assets/Yaikh-Uploads/H01_00009489_20251229101408.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 3",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1807,
      name: "Nhean Sovann",
      profileImage: "/assets/Yaikh-Uploads/H01_00009490_20260106154218.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1806,
      name: "Preap Sovath",
      profileImage: "/assets/Yaikh-Uploads/H01_00009491_20251229101255.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1805,
      name: "Sinn Sisamouth",
      profileImage: "/assets/Yaikh-Uploads/H01_00009492_20251229101312.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1804,
      name: "Ros Sereysothea",
      profileImage: "/assets/Yaikh-Uploads/H01_00009493_20251229101327.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1803,
      name: "Pen Ron",
      profileImage: "/assets/Yaikh-Uploads/H01_00009494_20260105105141.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1802,
      name: "Meng Keo Pichenda",
      profileImage: "/assets/Yaikh-Uploads/H01_00009495_20260113121342.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1801,
      name: "Noy Vanneth",
      profileImage: "/assets/Yaikh-Uploads/H01_00009496_20260107153513.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "rejected",
      },
      gmReqApprove: {
        status: "rejected",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1800,
      name: "Sok Samnang",
      profileImage: "/assets/Yaikh-Uploads/H01_00009497_20260107153529.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1799,
      name: "Touch Borey",
      profileImage: "/assets/Yaikh-Uploads/H01_00009498_20260107153543.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1798,
      name: "Chan Thavy",
      profileImage: "/assets/Yaikh-Uploads/H01_00009499_20260109094021.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1797,
      name: "Keo Leakhena",
      profileImage: "/assets/Yaikh-Uploads/H01_00009500_20260109094036.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1796,
      name: "Seng Sophea",
      profileImage: "/assets/Yaikh-Uploads/H01_00009501_20260109094050.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 5",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "delivered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1795,
      name: "Mao Vanna",
      profileImage: "/assets/Yaikh-Uploads/H01_00009502_20260114142042.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 1",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1794,
      name: "Heng Piseth",
      profileImage: "/assets/Yaikh-Uploads/H01_00009503_20260114142539.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 2",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1793,
      name: "Ouk Sokhom",
      profileImage: "/assets/Yaikh-Uploads/H01_00009504_20260114142100.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
    {
      code: 1792,
      name: "Sim Sreyneang",
      profileImage: "/assets/Yaikh-Uploads/H01_00009505_20260114142025.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "12-02-26",
      buyerType: "Buy by Myself",
      returnStatus: "pending",
      headOfDept: {
        status: "approved",
        approvedBy: "Manager 4",
        approvedDate: "02/14/26",
      },
      gmReqApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      gmPaymentApprove: {
        status: "approved",
        approvedBy: "CHAN WINGHONG",
        approvedDate: "02/14/26",
      },
      purchaser: {
        status: "ordered",
      },
      payment: {
        status: "paid",
        paidDate: "02/15/26",
      },
      hasReturnMessage: false,
    },
    {
      code: 1791,
      name: "Bun Reth",
      profileImage: "/assets/Yaikh-Uploads/H01_00009506_20260114150453.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "12-02-26",
      buyerType: "Buy by Purchaser",
      returnStatus: "pending",
      headOfDept: {
        status: "pending",
      },
      gmReqApprove: {
        status: "pending",
      },
      gmPaymentApprove: {
        status: "pending",
      },
      purchaser: {
        status: "pending",
      },
      payment: {
        status: "pending",
      },
      hasReturnMessage: false,
    },
  ];

  // Using sampleRequests directly in the render

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleReturn = (code) => {
    console.log("Return request:", code);
  };

  const handleViewReturnDetails = (code) => {
    console.log("View return details:", code);
  };

  const handleInvoice = (code) => {
    // Show invoice image/PDF matching the request code
    setSelectedImagePath(`/assets/purchase/invoice.png?v=1`);
    setShowImageViewer(true);
  };

  const handleDetails = (code) => {
    // Show detail image matching the request code
    setSelectedImagePath(`/assets/purchase/detail.png`);
    setShowImageViewer(true);
  };

  const handlePDF = (code) => {
    // Show PDF viewer - matching with request code
    setSelectedPdfPath(`/assets/purchase/view-pdf.pdf?v=1`);
    setShowPdfViewer(true);
  };

  const handleViewForm = (code) => {
    // Show PDF viewer for request form
    setSelectedPdfPath(`/assets/purchase/view-pdf.pdf?v=1`);
    setShowPdfViewer(true);
  };

  const handleDetail = (code) => {
    // Show detail image matching the request code
    setSelectedImagePath(`/assets/purchase/detail.png`);
    setShowImageViewer(true);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 z-[200]">
      {/* Header */}
      <div className="bg-slate-100 p-3 border-b flex items-center justify-between flex-shrink-0 shadow-sm relative z-[201]">
        <div className="w-32"></div> {/* Left spacer */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0 text-slate-700 font-semibold text-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={18} className="inline mr-1" />
              {t("back")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              title={t("home")}
            >
              <img
                src="/logo.jpg"
                alt={t("home")}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
          <h1 className="text-lg font-bold text-slate-800">
            {t("purchaseRequest")}
          </h1>
        </div>
        <div className="w-32 flex justify-end gap-2 pr-4 relative z-[202]">
          <button
            onClick={() =>
              setSelectedVideo("/assets/short-video-training/new-updated-vd/Purchase.mp4")
            }
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
          >
            <Video size={20} className="text-blue-600" />
          </button>
          <button
            onClick={() => setSelectedDocument("/assets/purchase/view-pdf.pdf")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Report Training"
          >
            <FileText size={20} className="text-blue-600" />
          </button>
        </div>{" "}
        {/* Right spacer with icons */}
      </div>

      {/* Filter Section */}
      {/* <div className="bg-white p-4 border-b flex flex-col gap-4 flex-shrink-0">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Filter:</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All Request">All Request</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Returned">Returned</option>
                            </select>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                            Master List
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
                            Export
                        </button>
                    </div>

                    <div className="flex items-center gap-3 ml-auto flex-wrap">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Filter by User:</label>
                            <select
                                value={filterByUser}
                                onChange={(e) => setFilterByUser(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All</option>
                                <option value="User1">User1</option>
                                <option value="User2">User2</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Search by Code:</label>
                            <input
                                type="text"
                                placeholder="Search by Code"
                                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Department:</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All</option>
                                <option value="Admin">Admin</option>
                                <option value="Cooling">Cooling</option>
                                <option value="GAR">GAR</option>
                                <option value="DSU">DSU</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">From:</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">To:</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleFilter}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                        >
                            <Filter size={16} />
                            Filter
                        </button>
                        <button
                            onClick={handleClear}
                            className="bg-slate-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition-colors text-sm flex items-center gap-2"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    </div>
                </div>

                <div className="flex gap-1 border-b">
                    <button
                        onClick={() => {
                            setActiveTab('new');
                            setCurrentPage(1);
                        }}
                        className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                            activeTab === 'new'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        New Data
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('old');
                            setCurrentPage(1);
                        }}
                        className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                            activeTab === 'old'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Old Data
                    </button>
                </div>
            </div> */}

      {/* Table */}
      {/* <div className="flex-1 overflow-auto p-6">
                <div className="overflow-x-auto h-full">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">CODE</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">RETURN</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">SIGN OF DEPT</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">INSTMENT APPROVE</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">PURCHASE</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">PAYMENT</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">NAME</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">DEPARTMENT</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">PREPARED BY</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">REQUEST DATE</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">ATTACH DOCUMENTS</th>
                                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="text-center py-16 text-slate-500">
                                        No requests found
                                    </td>
                                </tr>
                            ) : (
                                paginatedRequests.map((req, idx) => (
                                    <tr key={req.code} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center font-medium">{req.code}</td>
                                        <td className="px-4 py-4 border border-slate-200 text-center">
                                            {req.returnStatus === 'returned' ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-xs text-slate-600">Return message: {req.returnMessage}</div>
                                                    <button
                                                        onClick={() => handleViewReturnDetails(req.code)}
                                                        className="text-blue-600 hover:underline text-xs"
                                                    >
                                                        View Return Details
                                                    </button>
                                                </div>
                                            ) : req.returnStatus === 'approved' ? (
                                                <div className="flex flex-col gap-1">
                                                    <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-600 transition-colors">
                                                        Approved
                                                    </button>
                                                    <div className="text-xs text-slate-600">{req.returnApprovedBy} {req.returnApprovedDate}</div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleReturn(req.code)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors"
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 border border-slate-200 text-center">
                                            {req.signOfDept === 'approved' ? (
                                                <div className="flex flex-col gap-1">
                                                    <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-600 transition-colors">
                                                        Approved
                                                    </button>
                                                    <div className="text-xs text-slate-600">{req.signApprovedBy} {req.signApprovedDate}</div>
                                                </div>
                                            ) : (
                                                <button className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors">
                                                    Pending
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 border border-slate-200 text-center">
                                            <div className="flex flex-col gap-2">
                                                <button className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors">
                                                    Pending
                                                </button>
                                                <button
                                                    onClick={() => handleInvoice(req.code)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                                                >
                                                    Invoice
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border border-slate-200 text-center">
                                            <button className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors">
                                                Pending
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 border border-slate-200 text-center">
                                            <button className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors">
                                                Pending
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 border border-slate-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
                                                    {req.name.charAt(0)}
                                                </div>
                                                <span className="text-slate-700">{req.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border border-slate-200 text-slate-700">{req.department}</td>
                                        <td className="px-4 py-4 border border-slate-200 text-slate-700">{req.preparedBy}</td>
                                        <td className="px-4 py-4 border border-slate-200 text-slate-700">{req.requestDate}</td>
                                        <td className="px-4 py-4 border border-slate-200">
                                            <div className="flex flex-col gap-2">
                                                <div className="text-xs text-slate-600">Request Form</div>
                                                <div className="flex items-center gap-2">
                                                    <button className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-600 transition-colors flex items-center gap-1">
                                                        <FileText size={12} />
                                                        PDF
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewDocument(req.code)}
                                                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                    >
                                                        <Eye size={12} />
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border border-slate-200 text-center">
                                            <button
                                                onClick={() => handleDetails(req.code)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div> */}

      {/* Pagination Footer */}
      {/* <div className="bg-white border-t p-4 flex items-center justify-between flex-shrink-0">
                <div className="text-sm text-slate-600">
                    Showing {startItem} to {endItem} of {filteredRequests.length} results
                </div>
                {renderPagination()}
            </div> */}

      {/* Table Display - Commented Out */}
      {/* <div className="flex-1 overflow-auto bg-white p-4">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full text-sm border-collapse bg-white">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">CODE</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">RETURN</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">HEAD OF DEPT</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">GM(REQ-APPROVE)</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">GM(PAYMENT-APPROVE)</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">PURCHASER</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">PAYMENT</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-left">NAME</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-left">DEPARTMENT</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-left">PRODUCT/SERVICE</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-left">REQUEST DATE</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">ATTACH DOCUMENTS</th>
                                <th className="px-2 py-2 border border-slate-200 text-slate-600 font-bold text-[10px] text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleRequests.map((req, idx) => (
                                <tr key={req.code} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-2 py-2 border border-slate-200 text-slate-700 text-center font-medium text-xs">{req.code}</td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        <button
                                            onClick={() => handleReturn(req.code)}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-600 transition-colors min-w-[60px]"
                                        >
                                            Return
                                        </button>
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        {req.headOfDept.status === 'approved' ? (
                                            <div className="flex flex-col gap-1 items-center">
                                                <button className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-600 transition-colors min-w-[60px]">
                                                    Approved
                                                </button>
                                                <div className="text-[10px] text-slate-600 leading-tight">{req.headOfDept.approvedBy} {req.headOfDept.approvedDate}</div>
                                            </div>
                                        ) : (
                                            <button className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-600 transition-colors min-w-[60px]">
                                                Pending
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        {req.gmReqApprove.status === 'approved' ? (
                                            <div className="flex flex-col gap-1 items-center">
                                                <button className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-600 transition-colors min-w-[60px]">
                                                    Approved
                                                </button>
                                                <div className="text-[10px] text-slate-600 leading-tight">{req.gmReqApprove.approvedBy} {req.gmReqApprove.approvedDate}</div>
                                                <button
                                                    onClick={() => handleDetail(req.code)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-[10px] font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 min-w-[55px]"
                                                >
                                                    <Eye size={10} />
                                                    Detail
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1 items-center">
                                                <button className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-600 transition-colors min-w-[60px]">
                                                    Pending
                                                </button>
                                                <button
                                                    onClick={() => handleDetail(req.code)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-[10px] font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 min-w-[55px]"
                                                >
                                                    <Eye size={10} />
                                                    Detail
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        <button className="bg-slate-400 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-slate-500 transition-colors min-w-[60px]">
                                            Pending
                                        </button>
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        <button className="bg-slate-400 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-slate-500 transition-colors min-w-[60px]">
                                            Pending
                                        </button>
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-600 transition-colors min-w-[60px]">
                                            Pending
                                        </button>
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200">
                                        <div className="flex flex-col items-center gap-1">
                                            {req.profileImage ? (
                                                <img 
                                                    src={req.profileImage} 
                                                    alt={req.name}
                                                    className="w-10 h-10 rounded object-cover border border-slate-200"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '';
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-slate-300 flex items-center justify-center text-[10px] font-semibold text-slate-700">
                                                    {req.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-slate-700 font-medium text-[10px] text-center">{req.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-slate-700 text-[10px]">{req.department}</td>
                                    <td className="px-2 py-2 border border-slate-200 text-slate-700 text-[10px]">{req.productService}</td>
                                    <td className="px-2 py-2 border border-slate-200 text-slate-700 text-[10px]">
                                        <div>{req.requestDate}</div>
                                        <div className="text-slate-500 mt-0.5">{req.buyerType}</div>
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        <div className="flex flex-col gap-1 items-center">
                                            <div className="text-[10px] text-slate-600 font-semibold">Request Form</div>
                                            <div className="flex flex-col gap-1 items-center">
                                                <button
                                                    onClick={() => handlePDF(req.code)}
                                                    className="bg-green-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1 min-w-[50px]"
                                                >
                                                    <Download size={10} />
                                                    PDF
                                                </button>
                                                <button
                                                    onClick={() => handleViewForm(req.code)}
                                                    className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 min-w-[50px]"
                                                >
                                                    <Eye size={10} />
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 border border-slate-200 text-center">
                                        <button
                                            onClick={() => handleDetails(req.code)}
                                            className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-blue-700 transition-colors min-w-[60px]"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}

      {/* Table Display */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white">
            <thead className="bg-[#F1F5F9] sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  CODE
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  RETURN
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  HEAD OF DEPT
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  GM(REQ-APPROVE)
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  GM(PAYMENT-APPROVE)
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  PURCHASER
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  PAYMENT
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  NAME
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  DEPARTMENT
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  PRODUCT/SERVICE
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  REQUEST DATE
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  ATTACH DOCUMENTS
                </th>
                <th className="px-2 py-3 text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleRequests.map((req, idx) => (
                <React.Fragment key={req.code}>
                  <tr className="hover:bg-slate-50 transition-colors border-b border-slate-200">
                    {/* CODE */}
                    <td className="px-2 py-2 text-black text-center font-bold text-xs">
                      {req.code}
                    </td>

                    {/* RETURN */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <button
                          onClick={() => handleReturn(req.code)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-700 transition-colors min-w-[60px]"
                        >
                          {t("return")}
                        </button>
                      </div>
                    </td>

                    {/* HEAD OF DEPT */}
                    <td className="px-2 py-2 text-center">
                      {req.headOfDept.status === "approved" ? (
                        <div className="flex flex-col gap-1 items-center">
                          <button className="bg-green-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-700 transition-colors min-w-[60px]">
                            {t("approved")}
                          </button>
                          <div className="text-[10px] text-black font-bold leading-tight">
                            {req.headOfDept.approvedBy}
                          </div>
                          <div className="text-[10px] text-black font-bold leading-tight">
                            {req.headOfDept.approvedDate}
                          </div>
                        </div>
                      ) : (
                        <button className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-700 transition-colors min-w-[60px]">
                          {t("pending")}
                        </button>
                      )}
                    </td>

                    {/* GM(REQ-APPROVE) */}
                    <td className="px-2 py-2 text-center">
                      {req.gmReqApprove.status === "approved" ? (
                        <div className="flex flex-col gap-1 items-center">
                          <button className="bg-green-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-700 transition-colors min-w-[60px]">
                            {t("approved")}
                          </button>
                          <button
                            onClick={() => handleDetail(req.code)}
                            className="bg-transparent text-blue-400 border-[1px] border-blue-400 px-2 py-1 rounded-2xl text-[10px] font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 min-w-[55px]"
                          >
                            <Eye size={10} className="text-blue-400" />
                            {t("detail")}
                          </button>
                          <div className="text-[10px] text-black font-bold leading-tight">
                            {req.gmReqApprove.approvedBy}
                          </div>
                          <div className="text-[10px] text-black font-bold leading-tight">
                            {req.gmReqApprove.approvedDate}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 items-center">
                          <button className="bg-gray-400 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-gray-500 transition-colors min-w-[60px]">
                            {t("pending")}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* GM(PAYMENT-APPROVE) */}
                    <td className="px-2 py-2 text-center">
                      {req.gmPaymentApprove.status === "approved" ? (
                        <div className="flex flex-col gap-1 items-center">
                          <button className="bg-green-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-700 transition-colors min-w-[60px]">
                            {t("approved")}
                          </button>
                          <button
                            onClick={() => handleInvoice(req.code)}
                            className="bg-transparent text-blue-400 border-[1px] border-blue-400 px-2 py-1 rounded-2xl text-[10px] font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 min-w-[55px]"
                          >
                            <FileText size={10} className="text-blue-400" />
                            {t("invoice")}
                          </button>
                          <div className="text-[10px] text-black font-bold leading-tight">
                            {req.gmPaymentApprove.approvedBy}
                          </div>
                          <div className="text-[10px] text-black font-bold leading-tight">
                            {req.gmPaymentApprove.approvedDate}
                          </div>
                        </div>
                      ) : (
                        <button className="bg-gray-400 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-gray-500 transition-colors min-w-[60px]">
                          {t("pending")}
                        </button>
                      )}
                    </td>

                    {/* PURCHASER */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {req.payment.status === "paid" ? (
                          <button className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-700 transition-colors min-w-[60px]">
                            {t("pending")}
                          </button>
                        ) : req.code === 1931 ? (
                          <button className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-700 transition-colors min-w-[60px]">
                            {t("pending")}
                          </button>
                        ) : req.purchaser.status === "pending" ? (
                          <button className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-700 transition-colors min-w-[60px]">
                            {t("pending")}
                          </button>
                        ) : (
                          <button className="bg-gray-400 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-gray-500 transition-colors min-w-[60px]">
                            {t("pending")}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* PAYMENT */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {req.payment.status === "paid" ? (
                          <div className="flex flex-col gap-0.5 items-center">
                            <button className="bg-green-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-700 transition-colors min-w-[60px]">
                              {t("paid")}
                            </button>
                            {req.payment.paidDate && (
                              <div className="text-[10px] text-black font-bold leading-tight">
                                {req.payment.paidDate}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-700 transition-colors min-w-[60px]">
                            {t("pending")}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* NAME */}
                    <td className="px-2 py-2">
                      <div className="flex flex-col items-center gap-1">
                        {req.profileImage ? (
                          <img
                            src={req.profileImage}
                            alt={req.name}
                            className="w-10 h-10 rounded object-cover border border-slate-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              const placeholder =
                                e.target.parentElement.querySelector(
                                  ".avatar-placeholder",
                                );
                              if (placeholder) {
                                placeholder.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-10 h-10 rounded bg-slate-300 flex items-center justify-center text-[10px] font-semibold text-slate-700 avatar-placeholder ${req.profileImage ? "hidden" : ""}`}
                        >
                          {req.name.charAt(0)}
                        </div>
                        <span className="text-black font-bold text-[10px] text-center">
                          {req.name}
                        </span>
                      </div>
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-2 py-2 text-black font-bold text-[10px]">
                      {req.department || ""}
                    </td>

                    {/* PRODUCT/SERVICE */}
                    <td className="px-2 py-2 text-black font-bold text-[10px]">
                      {req.productService}
                    </td>

                    {/* REQUEST DATE */}
                    <td className="px-2 py-2 text-black font-bold text-[10px]">
                      <div>{req.requestDate}</div>
                      <div className="text-black font-bold mt-0.5 text-[9px]">
                        {req.buyerType}
                      </div>
                    </td>

                    {/* ATTACH DOCUMENTS */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <div className="text-[10px] text-black font-semibold border border-slate-300 px-2 py-0.5 rounded bg-slate-50">
                          {t("requestForm")}
                        </div>
                        <div className="flex flex-col gap-1 items-center">
                          <button
                            onClick={() => handlePDF(req.code)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-1 min-w-[50px]"
                          >
                            <Download size={10} />
                            {t("pdf")}
                          </button>
                          <button
                            onClick={() => handleViewForm(req.code)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 min-w-[50px]"
                          >
                            <Eye size={10} />
                            {t("view")}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => handleDetails(req.code)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-blue-600 transition-colors min-w-[60px]"
                      >
                        {t("details")}
                      </button>
                    </td>
                  </tr>
                  {/* Return Message Row */}
                  {req.hasReturnMessage && (
                    <tr>
                      <td colSpan={12} className="px-3 py-2 bg-orange-50">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-orange-600 font-bold">▲</span>
                          <span className="text-black font-medium">
                            {t("returnMessage")}: {req.returnMessage}
                          </span>
                          <button
                            onClick={() => handleViewReturnDetails(req.code)}
                            className="text-blue-600 hover:underline ml-2 font-medium"
                          >
                            {t("viewReturnDetails")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Viewer */}
      {showImageViewer && selectedImagePath && (
        <ImageViewer
          imagePath={selectedImagePath}
          onClose={() => {
            setShowImageViewer(false);
            setSelectedImagePath("");
          }}
        />
      )}

      {/* PDF Viewer */}
      {showPdfViewer && selectedPdfPath && (
        <PdfViewer
          onClose={() => {
            setShowPdfViewer(false);
            setSelectedPdfPath("");
          }}
          pdfPath={selectedPdfPath}
        />
      )}

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Show List Request bot"
        title="Ask Show List Request bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Show List Request"
        />
      )}

      {/* Video Viewer Modal */}
      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          documentPath={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default ShowListRequest;
