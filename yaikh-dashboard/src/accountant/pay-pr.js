import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Video,
} from "lucide-react";
import RequestDetailModal from "../components/RequestDetailModal";
import InvoiceModal from "../components/InvoiceModal";
import ImageViewer from "../components/ImageViewer";
import PdfViewer from "../components/PdfViewer";
import GeneralAIAgent from "../general-ag";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const PayPR = ({ onBack }) => {
  const navigate = useNavigate();
  const { t, translateModuleTitle } = useTranslation();
  const [activeTab, setActiveTab] = useState("new");
  const [searchCode, setSearchCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState("");
  const [selectedPdfPath, setSelectedPdfPath] = useState("");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Sample data - replace with actual data from API
  const sampleData = [
    {
      code: 1978,
      name: "Yo Ka",
      department: "Admin",
      productService: "Diesel on 27/12/2025",
      requestDate: "29-12-25",
      accPay: "paid",
      accPayDate: "12/30/25 17:16",
      accPayBy: "Mom Chheangna",
      image:
        "https://ym.kottrahr.com/Uploads/Images/Employee/H01_0000803120231103125217.jpeg",
    },
    {
      code: 1977,
      name: "U Chheng",
      department: "Admin",
      productService: "New Purchase",
      requestDate: "29-12-25",
      accPay: "paid",
      accPayDate: "12/31/25 12:35",
      accPayBy: "Mom Chheangna",
      image:
        "https://ym.kottrahr.com/Uploads/Images/Employee/H01_0000437020211222075243.jpeg",
    },
    {
      code: 1975,
      name: "Ro Ton",
      department: "Admin",
      productService: "For backup use in ca...",
      requestDate: "29-12-25",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
      image:
        "https://ym.kottrahr.com/Uploads/Images/Employee/H01_00008943_20250313153947.jpeg",
    },
    {
      code: 1900,
      name: "Sok Samnang",
      image: "/assets/Yaikh-Uploads/H01_0000415420220331144000.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1899,
      name: "Touch Borey",
      image: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1898,
      name: "Chan Thavy",
      image: "/assets/Yaikh-Uploads/H01_0000415620210721081000.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1897,
      name: "Keo Leakhena",
      image: "/assets/Yaikh-Uploads/H01_0000415920241228104419.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1896,
      name: "Seng Sophea",
      image: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1895,
      name: "Mao Vanna",
      image: "/assets/Yaikh-Uploads/H01_0000416420220318125258.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1894,
      name: "Heng Piseth",
      image: "/assets/Yaikh-Uploads/H01_0000416520220318125329.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1893,
      name: "Ouk Sokhom",
      image: "/assets/Yaikh-Uploads/H01_0000416620220713102009.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1892,
      name: "Sim Sreyneang",
      image: "/assets/Yaikh-Uploads/H01_0000416720210711152309.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1891,
      name: "Bun Reth",
      image: "/assets/Yaikh-Uploads/H01_0000416820211223105114.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1890,
      name: "Chea Srey",
      image: "/assets/Yaikh-Uploads/H01_0000416920220318125405.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1889,
      name: "Phan Sopheak",
      image: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1888,
      name: "Kim Chanda",
      image: "/assets/Yaikh-Uploads/H01_0000417520210721080641.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1887,
      name: "Nhean Sovann",
      image: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1886,
      name: "Preap Sovath",
      image: "/assets/Yaikh-Uploads/H01_0000417820210711152433.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1885,
      name: "Sinn Sisamouth",
      image: "/assets/Yaikh-Uploads/H01_0000417920220318125541.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1884,
      name: "Ros Sereysothea",
      image: "/assets/Yaikh-Uploads/H01_0000418120210711152449.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1883,
      name: "Pen Ron",
      image: "/assets/Yaikh-Uploads/H01_0000418220220331143852.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1882,
      name: "Meng Keo Pichenda",
      image: "/assets/Yaikh-Uploads/H01_0000418520241228122016.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1881,
      name: "Noy Vanneth",
      image: "/assets/Yaikh-Uploads/H01_0000418720241228102121.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1880,
      name: "Sok Samnang",
      image: "/assets/Yaikh-Uploads/H01_0000418820220318125710.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1879,
      name: "Touch Borey",
      image: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1878,
      name: "Chan Thavy",
      image: "/assets/Yaikh-Uploads/H01_0000419420241228103252.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1877,
      name: "Keo Leakhena",
      image: "/assets/Yaikh-Uploads/H01_0000419520241228121702.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1876,
      name: "Seng Sophea",
      image: "/assets/Yaikh-Uploads/H01_0000419720220311101310.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1875,
      name: "Mao Vanna",
      image: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1874,
      name: "Heng Piseth",
      image: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1873,
      name: "Ouk Sokhom",
      image: "/assets/Yaikh-Uploads/H01_0000420020210711152501.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1872,
      name: "Sim Sreyneang",
      image: "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1871,
      name: "Bun Reth",
      image: "/assets/Yaikh-Uploads/H01_00004203_20250903122655.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1870,
      name: "Chea Srey",
      image: "/assets/Yaikh-Uploads/H01_0000420420241228122514.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1869,
      name: "Phan Sopheak",
      image: "/assets/Yaikh-Uploads/H01_0000420520220318130017.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1868,
      name: "Kim Chanda",
      image: "/assets/Yaikh-Uploads/H01_0000420920210711152515.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1867,
      name: "Nhean Sovann",
      image: "/assets/Yaikh-Uploads/H01_0000421020220325142145.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1866,
      name: "Preap Sovath",
      image: "/assets/Yaikh-Uploads/H01_0000421120220331144749.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1865,
      name: "Sinn Sisamouth",
      image: "/assets/Yaikh-Uploads/H01_0000421220210721080659.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1864,
      name: "Ros Sereysothea",
      image: "/assets/Yaikh-Uploads/H01_00004216_20260114093811.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1863,
      name: "Pen Ron",
      image: "/assets/Yaikh-Uploads/H01_0000421720210721080659.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1862,
      name: "Meng Keo Pichenda",
      image: "/assets/Yaikh-Uploads/H01_0000421820210721080718.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1861,
      name: "Noy Vanneth",
      image: "/assets/Yaikh-Uploads/H01_00004219_20260114093834.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1860,
      name: "Sok Samnang",
      image: "/assets/Yaikh-Uploads/H01_00004220_20260108154036.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1859,
      name: "Touch Borey",
      image: "/assets/Yaikh-Uploads/H01_00004222_20260110130201.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1858,
      name: "Chan Thavy",
      image: "/assets/Yaikh-Uploads/H01_0000422320220331143907.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1857,
      name: "Keo Leakhena",
      image: "/assets/Yaikh-Uploads/H01_0000422420210721080718.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1856,
      name: "Seng Sophea",
      image: "/assets/Yaikh-Uploads/H01_00004225_20260112095718.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1855,
      name: "Mao Vanna",
      image: "/assets/Yaikh-Uploads/H01_0000422620220318130150.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1854,
      name: "Heng Piseth",
      image: "/assets/Yaikh-Uploads/H01_00004227_20260110104235.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1853,
      name: "Ouk Sokhom",
      image: "/assets/Yaikh-Uploads/H01_0000422820220318130216.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1852,
      name: "Sim Sreyneang",
      image: "/assets/Yaikh-Uploads/H01_0000422920220318130230.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1851,
      name: "Bun Reth",
      image: "/assets/Yaikh-Uploads/H01_00004230_20260112095743.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1850,
      name: "Chea Srey",
      image: "/assets/Yaikh-Uploads/H01_0000423320220325143707.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1849,
      name: "Phan Sopheak",
      image: "/assets/Yaikh-Uploads/H01_0000423520210721080737.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1848,
      name: "Kim Chanda",
      image: "/assets/Yaikh-Uploads/H01_0000423620241228104308.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1847,
      name: "Nhean Sovann",
      image: "/assets/Yaikh-Uploads/H01_00004237_20260110130233.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1846,
      name: "Preap Sovath",
      image: "/assets/Yaikh-Uploads/H01_00004238_20260114093925.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1845,
      name: "Sinn Sisamouth",
      image: "/assets/Yaikh-Uploads/H01_00004239_20251215163445.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1844,
      name: "Ros Sereysothea",
      image: "/assets/Yaikh-Uploads/H01_00004240_20260110104302.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1843,
      name: "Pen Ron",
      image: "/assets/Yaikh-Uploads/H01_00004273_20260112130342.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1842,
      name: "Meng Keo Pichenda",
      image: "/assets/Yaikh-Uploads/H01_0000428120220827094405.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1841,
      name: "Noy Vanneth",
      image: "/assets/Yaikh-Uploads/H01_0000430720241228121758.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1840,
      name: "Sok Samnang",
      image: "/assets/Yaikh-Uploads/H01_0000436320210721081018.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1839,
      name: "Touch Borey",
      image: "/assets/Yaikh-Uploads/H01_00004364_20250131131525.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1838,
      name: "Chan Thavy",
      image: "/assets/Yaikh-Uploads/H01_00004365_20250203123742.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1837,
      name: "Keo Leakhena",
      image: "/assets/Yaikh-Uploads/H01_0000436620211222080009.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1836,
      name: "Seng Sophea",
      image: "/assets/Yaikh-Uploads/H01_0000437020211222075243.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1835,
      name: "Mao Vanna",
      image: "/assets/Yaikh-Uploads/H01_00004379_20250729131339.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1834,
      name: "Heng Piseth",
      image: "/assets/Yaikh-Uploads/H01_0000438020211208095628.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1833,
      name: "Ouk Sokhom",
      image: "/assets/Yaikh-Uploads/H01_0000438720220326094450.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1832,
      name: "Sim Sreyneang",
      image: "/assets/Yaikh-Uploads/H01_0000439320241230165111.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1831,
      name: "Bun Reth",
      image: "/assets/Yaikh-Uploads/H01_0000441920211222075612.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1830,
      name: "Chea Srey",
      image: "/assets/Yaikh-Uploads/H01_0000444420241203130427.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1829,
      name: "Phan Sopheak",
      image: "/assets/Yaikh-Uploads/H01_0000448220241228104335.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1828,
      name: "Kim Chanda",
      image: "/assets/Yaikh-Uploads/H01_0000461020210721080902.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1827,
      name: "Nhean Sovann",
      image: "/assets/Yaikh-Uploads/H01_0000471820230929172936.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1826,
      name: "Preap Sovath",
      image: "/assets/Yaikh-Uploads/H01_00004905_20260110104422.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1825,
      name: "Sinn Sisamouth",
      image: "/assets/Yaikh-Uploads/H01_0000521720220126164724.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1824,
      name: "Ros Sereysothea",
      image: "/assets/Yaikh-Uploads/H01_0000543920230316124026.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1823,
      name: "Pen Ron",
      image: "/assets/Yaikh-Uploads/H01_0000590020241228121849.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1822,
      name: "Meng Keo Pichenda",
      image: "/assets/Yaikh-Uploads/H01_0000609920241228121909.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1821,
      name: "Noy Vanneth",
      image: "/assets/Yaikh-Uploads/H01_0000618520210817163056.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1820,
      name: "Sok Samnang",
      image: "/assets/Yaikh-Uploads/H01_0000649620250102095758.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1819,
      name: "Touch Borey",
      image: "/assets/Yaikh-Uploads/H01_00006801_20251119095908.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1818,
      name: "Chan Thavy",
      image: "/assets/Yaikh-Uploads/H01_0000683220241230165029.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1817,
      name: "Keo Leakhena",
      image: "/assets/Yaikh-Uploads/H01_0000705420241228121921.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1816,
      name: "Seng Sophea",
      image: "/assets/Yaikh-Uploads/H01_0000706320220930082804.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1815,
      name: "Mao Vanna",
      image: "/assets/Yaikh-Uploads/H01_0000735020230109135540.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1814,
      name: "Heng Piseth",
      image: "/assets/Yaikh-Uploads/H01_0000761120230620092706.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1813,
      name: "Ouk Sokhom",
      image: "/assets/Yaikh-Uploads/H01_0000803120231103125217.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1812,
      name: "Sim Sreyneang",
      image: "/assets/Yaikh-Uploads/H01_0000820720240504121622.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1811,
      name: "Bun Reth",
      image: "/assets/Yaikh-Uploads/H01_0000828120240619102032.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1810,
      name: "Chea Srey",
      image: "/assets/Yaikh-Uploads/H01_00009487_20251224102241.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1809,
      name: "Phan Sopheak",
      image: "/assets/Yaikh-Uploads/H01_00009488_20251224125815.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1808,
      name: "Kim Chanda",
      image: "/assets/Yaikh-Uploads/H01_00009489_20251229101408.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1807,
      name: "Nhean Sovann",
      image: "/assets/Yaikh-Uploads/H01_00009490_20260106154218.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1806,
      name: "Preap Sovath",
      image: "/assets/Yaikh-Uploads/H01_00009491_20251229101255.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1805,
      name: "Sinn Sisamouth",
      image: "/assets/Yaikh-Uploads/H01_00009492_20251229101312.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1804,
      name: "Ros Sereysothea",
      image: "/assets/Yaikh-Uploads/H01_00009493_20251229101327.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1803,
      name: "Pen Ron",
      image: "/assets/Yaikh-Uploads/H01_00009494_20260105105141.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1802,
      name: "Meng Keo Pichenda",
      image: "/assets/Yaikh-Uploads/H01_00009495_20260113121342.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1801,
      name: "Noy Vanneth",
      image: "/assets/Yaikh-Uploads/H01_00009496_20260107153513.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1800,
      name: "Sok Samnang",
      image: "/assets/Yaikh-Uploads/H01_00009497_20260107153529.jpeg",
      department: "TPM",
      productService: "Machine Parts",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1799,
      name: "Touch Borey",
      image: "/assets/Yaikh-Uploads/H01_00009498_20260107153543.jpeg",
      department: "CSR",
      productService: "Stationery",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1798,
      name: "Chan Thavy",
      image: "/assets/Yaikh-Uploads/H01_00009499_20260109094021.jpeg",
      department: "Admin",
      productService: "Fabric",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1797,
      name: "Keo Leakhena",
      image: "/assets/Yaikh-Uploads/H01_00009500_20260109094036.jpeg",
      department: "HR",
      productService: "Uniforms",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
    {
      code: 1796,
      name: "Seng Sophea",
      image: "/assets/Yaikh-Uploads/H01_00009501_20260109094050.jpeg",
      department: "Finance",
      productService: "Chemicals",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1795,
      name: "Mao Vanna",
      image: "/assets/Yaikh-Uploads/H01_00009502_20260114142042.jpeg",
      department: "Production",
      productService: "IT Equipment",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1794,
      name: "Heng Piseth",
      image: "/assets/Yaikh-Uploads/H01_00009503_20260114142539.jpeg",
      department: "QA",
      productService: "Maintenance",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1793,
      name: "Ouk Sokhom",
      image: "/assets/Yaikh-Uploads/H01_00009504_20260114142100.jpeg",
      department: "Warehouse",
      productService: "Cleaning Supplies",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1792,
      name: "Sim Sreyneang",
      image: "/assets/Yaikh-Uploads/H01_00009505_20260114142025.jpeg",
      department: "Cutting",
      productService: "Office Furniture",
      requestDate: "25-02-26",
      accPay: "paid",
      accPayDate: "02/26/26 10:30",
      accPayBy: "Mom Chheangna",
    },
    {
      code: 1791,
      name: "Bun Reth",
      image: "/assets/Yaikh-Uploads/H01_00009506_20260114150453.jpeg",
      department: "Sewing",
      productService: "Packing Materials",
      requestDate: "25-02-26",
      accPay: "pending",
      accPayDate: null,
      accPayBy: null,
    },
  ];

  const [data] = useState(sampleData);
  const totalItems = data.length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleReturn = (code) => {
    // Handle return action
    console.log("Return PR:", code);
  };

  const handleDetails = (item) => {
    setSelectedRequest(item);
    setShowDetailModal(true);
  };

  const handleInvoice = (item) => {
    setSelectedRequest(item);
    setShowInvoiceModal(true);
  };

  const handleViewDocument = (code) => {
    // Handle view document action
    console.log("View document for PR:", code);
  };

  const handleReqDetails = (code) => {
    // Handle request details action
    console.log("View request details for PR:", code);
  };

  const handleViewDetail = () => {
    setSelectedImagePath("/assets/accountant/pay-pr/detail.jpg");
    setShowImageViewer(true);
  };

  const handleViewDetailAction = () => {
    setSelectedImagePath("/assets/accountant/pay-pr/request-detail.jpg");
    setShowImageViewer(true);
  };

  const handleViewInvoice = () => {
    setSelectedImagePath("/assets/accountant/pay-pr/invoice.jpg");
    setShowImageViewer(true);
  };

  const handleViewPdf = () => {
    setSelectedPdfPath("/assets/accountant/pay-pr/view-pdf.pdf");
    setShowPdfViewer(true);
  };

  const handleViewRequestForm = () => {
    setSelectedImagePath("/assets/accountant/pay-pr/request-form.jpg");
    setShowImageViewer(true);
  };

  const filteredData = data.filter(
    (item) => searchCode === "" || item.code.toString().includes(searchCode),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const startItem = filteredData.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, filteredData.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 10;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first pages
      for (let i = 1; i <= 10; i++) {
        pages.push(i);
      }
      pages.push("...");
      // Show last pages
      pages.push(24);
      pages.push(25);
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-1 border border-slate-300 rounded text-sm font-semibold ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-slate-50"
            } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 z-10">
      {/* Header with Breadcrumb and Back Button */}
      <div className="bg-slate-100 p-4 border-b flex flex-col gap-3 flex-shrink-0 shadow-sm relative">
        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2">
          <button
            onClick={() =>
              setSelectedVideo(
                "/assets/short-video-training/new-updated-vd/Purchase.mp4",
              )
            }
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
          >
            <Video size={20} className="text-blue-600" />
          </button>
          <button
            onClick={() =>
              setSelectedDocument("/assets/accountant/pay-pr/view-pdf.pdf")
            }
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Report Training"
          >
            <FileText size={20} className="text-blue-600" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 rounded-lg transition-colors bg-slate-100"
            aria-label="Go back"
          >
            <ArrowLeft size={18} /> {t("back")}
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
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>{t("accountant")}</span>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-slate-800">
              {t("purchaseRequest")}
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 text-center">
          {t("payRequestLists")} - {t("purchaseRequest")}
        </h2>
      </div>

      {/* Search Bar */}
      {/* <div className="bg-white p-4 border-b flex items-center gap-3 flex-shrink-0">
                <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Code..."
                        className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                        value={searchCode}
                        onChange={(e) => {
                            setSearchCode(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Search
                </button>
            </div> */}

      {/* Tabs */}
      {/* <div className="bg-white border-b flex gap-1 px-4 flex-shrink-0">
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
            </div> */}

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("code")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("return")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("accPay")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("invoice")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("nameHeader")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("departmentHeader")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("productService")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("requestDate")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("attachDocuments")}
                </th>
                <th className="px-4 py-3 border-b border-slate-200 text-center">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-slate-500">
                    {t("noData")}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-slate-900 text-center">
                      {item.code}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleReturn(item.code)}
                        className="bg-slate-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-slate-600 transition-colors"
                      >
                        {t("return")}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.accPay === "paid" ? (
                        <div className="flex flex-col gap-1 items-center">
                          <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-600 transition-colors inline-block w-fit mx-auto">
                            {t("paid")}
                          </button>
                          <div className="text-xs text-slate-600">
                            {item.accPayDate}
                          </div>
                          <div className="text-xs text-slate-600">
                            {t("by")} {item.accPayBy}
                          </div>
                        </div>
                      ) : (
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors">
                          {t("pending")}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleViewDetail}
                          className="bg-white text-blue-600 border-2 border-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1 justify-center"
                        >
                          <Eye size={12} />
                          {t("details")}
                        </button>
                        <button
                          onClick={handleViewInvoice}
                          className="bg-white text-blue-600 border-2 border-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1 justify-center"
                        >
                          <Eye size={12} />
                          {t("invoice")}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-16 object-cover border border-slate-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "";
                              e.target.style.display = "none";
                              const fallback = e.target.nextElementSibling;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-12 h-16 bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700 border border-slate-200 ${item.image ? "hidden" : ""}`}
                        >
                          {item.name.charAt(0)}
                        </div>
                        <span className="text-slate-700 text-xs text-center">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 text-center">
                      {item.department}
                    </td>
                    <td className="px-4 py-4 text-slate-700 text-center">
                      {item.productService}
                    </td>
                    <td className="px-4 py-4 text-slate-700 text-center">
                      {item.requestDate}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleViewRequestForm}
                          className="text-xs text-slate-600 hover:text-slate-800 transition-colors text-left"
                        >
                          Request Form
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleViewPdf}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-600 transition-colors flex items-center gap-1"
                          >
                            <FileText size={12} />
                            PDF
                          </button>
                          <button
                            onClick={handleViewPdf}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <Eye size={12} />
                            View
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedImagePath(
                            "/assets/accountant/pay-pr/request-detail.jpg",
                          );
                          setShowImageViewer(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {t("requestDetails")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {/* <div className="bg-white border-t p-4 flex items-center justify-between flex-shrink-0">
                <div className="text-sm text-slate-600">
                    Showing {startItem} to {endItem} of {filteredData.length} results
                </div>
                {renderPagination()}
            </div> */}

      {/* Modals */}
      <RequestDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        requestData={selectedRequest}
      />
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        requestData={selectedRequest}
      />

      {/* Image Viewer */}
      {showImageViewer && (
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
          pdfPath={selectedPdfPath}
          onClose={() => {
            setShowPdfViewer(false);
            setSelectedPdfPath("");
          }}
        />
      )}

      {/* AI Bot Button */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="Ask Pay PR bot"
        title="Ask Pay PR bot"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Pay PR"
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

export default PayPR;
