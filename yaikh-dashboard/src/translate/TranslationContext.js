import React, { createContext, useContext, useState } from 'react';
import engTranslations from './eng';
import khTranslations from './kh';
import chTranslations from './ch';

const TranslationContext = createContext();

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};

export const TranslationProvider = ({ children }) => {
    // Language codes: 'en' for English, 'km' for Khmer, 'zh' for Chinese
    // Map to translation files: 'en' -> eng, 'km' -> kh, 'zh' -> ch
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('app-language') || 'en';
        return savedLanguage;
    });

    const translations = {
        'en': engTranslations,
        'km': khTranslations,
        'zh': chTranslations
    };

    const currentTranslations = translations[language] || engTranslations;

    const t = (key) => {
        return currentTranslations[key] || key;
    };

    const changeLanguage = (langCode) => {
        setLanguage(langCode);
        localStorage.setItem('app-language', langCode);
    };

    // Get language name based on code
    const getLanguageName = (code) => {
        const names = {
            'en': 'English',
            'km': 'ខ្មែរ',
            'zh': '中文'
        };
        return names[code] || 'English';
    };

    // Helper function to translate module titles
    // Maps common module titles to translation keys
    const translateModuleTitle = (title) => {
        if (!title) return '';
        
        // Map of title to translation key
        const titleMap = {
            'Administration': 'administration',
            'Management Dashboard': 'managementDashboard',
            'Operations': 'operations',
            'Accountant': 'accountant',
            'ADMIN': 'admin',
            'HR': 'hr',
            'CSR': 'csr',
            'E-GOV': 'egov',
            'QA': 'qa',
            'Internal Logistics': 'internalLogistics',
            'Production': 'production',
            'E-Invoicing': 'eInvoicing',
            'Purchase Request': 'purchaseRequest',
            'Y Shop': 'yShop',
            'Support Ticket': 'supportTicket',
            'Bill Record': 'billRecord',
            'Gate Pass': 'gatePass',
            'Meeting Room': 'meetingRoom',
            'My Car Booking': 'myCarBooking',
            'Fire Alarm': 'fireAlarm',
            'CCTV': 'cctv',
            'YHR': 'yhr',
            'Salary Bill': 'salaryBill',
            'Org Chart': 'orgChart',
            'Training': 'training',
            'Temp Work Request': 'tempWorkRequest',
            'Speak Up': 'speakUp',
            'Digital Audit': 'digitalAudit',
            'Energy': 'energy',
            'Air': 'air',
            'Water': 'water',
            'Waste': 'waste',
            'Chemical': 'chemical',
            'E-GOVERNMENT': 'eGovernment',
            'System Analysis': 'systemAnalysis',
            'YQMS': 'yqms',
            'Call Out': 'callOut',
            'FC': 'fc',
            'PWIP': 'pwip',
            'KANBAN': 'kanban',
            'CE': 'ce',
            'YTPM': 'ytpm',
            'YTM Shop': 'ytmShop',
            'DT Sync': 'dtSync',
            'Master Plan': 'masterPlan',
            'Line Plan': 'linePlan',
            'PPM': 'ppm',
            'TEC PACK': 'tecPack',
            'PPS': 'pps',
            'Sample': 'sample',
            'Material Purchase': 'materialPurchase',
            'Download': 'downloadData',
            'Checklist Attendant': 'checklistAttendant',
            'My Attendant': 'myAttendant',
            'FWCMS Portal': 'fwcmsPortal',
            'Ministry of Labour': 'ministryOfLabour',
            'Show Lists Request': 'showListsRequest',
            'Master List': 'masterList',
            'Purchaser Workspace': 'purchaserWorkspace',
            'My Confirm Received': 'myConfirmReceived',
            'Documents Joiner': 'documentsJoiner',
            'Gate In/Out Records': 'gateInOutRecords',
            'Motorcycle Records': 'motorcycleRecords',
            'Car Plate Records': 'carPlateRecords',
            'Truck Records': 'truckRecords',
            'Walk In/Out': 'walkInOut',
            'Visitor Record': 'visitorRecord',
            '12K YM Tuk Tuk': 'kYMukTuk',
            'Verify PR': 'verifyPR',
            'Approval PR': 'approvalPR',
            'Pay PR': 'payPR',
            'TB Monthly Yearly': 'tbMonthlyYearly',
            'TOI': 'toi',
            'Factory Accounting': 'factoryAccounting',
            'TAX Reporting': 'taxReporting',
            'Checklist 6s': 'checklist6s',
            'Compliance Certificate': 'complianceCertificate',
            'Audit Plan': 'auditPlan',
            'Master Organization Chart': 'masterOrganizationChart',
            'Custom Organization Chart': 'customOrganizationChart',
            'Leader/Worker Sections': 'leaderWorkerSections',
            'Face Scan Logs': 'faceScanLogs',
            'My Face Scan': 'myFaceScan',
            'Meters': 'meters',
            'Solar Dashboard': 'solarDashboard',
            'Switch Board Ampere Load Monitoring': 'switchBoardAmpereLoadMonitoring',
            'Energy Source': 'energySource',
            'Temperature Humidity Sensor': 'temperatureHumiditySensor',
            'Switch (Fan & Pump)': 'switchFanPump',
            'Air Quality Detector': 'airQualityDetector',
            'Request Worker Form': 'requestWorkerForm',
            'Request Worker List': 'requestWorkerList',
            'Cambodia E Invoice': 'cambodiaEInvoice',
            'Supplier Management': 'supplierManagement',
            'IEWS': 'iews',
            'QC File': 'qcFile',
            'Pre Production Meeting': 'preProductionMeeting',
            'First Output Cutting': 'firstOutputCutting',
            'First Output Printing Embroidery': 'firstOutputPrintingEmbroidery',
            'First Output Sewing': 'firstOutputSewing',
            'QA Cutting': 'qaCutting',
            'QA Printing Embroidery': 'qaPrintingEmbroidery',
            'QA 20pcs Audit': 'qa20pcsAudit',
            'Inline Audit Rolling': 'inlineAuditRolling',
            'Offline Audit': 'offlineAudit',
            'QC End Line Checking': 'qcEndLineChecking',
            'Internal Rolling QC': 'internalRollingQC',
            'Cutting Inspection': 'cuttingInspection',
            'Cut Panel Inspection': 'cutPanelInspection',
            'Printing Inspection': 'printingInspection',
            'Embroidery Inspection': 'embroideryInspection',
            'Garment Check Output': 'garmentCheckOutput',
            'Finishing Inspection': 'finishingInspection',
            'Ironing Inspection': 'ironingInspection',
            'Packing Inspection': 'packingInspection',
            'Pre Final Inspection': 'preFinalInspection',
            'Final Inspection': 'finalInspection',
            'Buyer Final Inspection': 'buyerFinalInspection',
            'Supplier Evaluation': 'supplierEvaluation',
            'Customer Complain Cap': 'customerComplainCap',
            'Fabric Receiving': 'fabricReceiving',
            'Fabric Inspection': 'fabricInspection',
            'Fabric Test': 'fabricTest',
            'Consumptions': 'consumptions',
            'Calculator': 'calculator',
            'Fabric Issuing': 'fabricIssuing',
            'Delivery Tracking': 'deliveryTracking',
            'Return Fabric': 'returnFabric',
            'Return Accessories': 'returnAccessories',
            'Brand Protection': 'brandProtection',
            'Accessories Receiving': 'accessoriesReceiving',
            'Accessories Inspection': 'accessoriesInspection',
            'Accessories Issuing': 'accessoriesIssuing',
            'Warehouse Tracking Location': 'warehouseTrackingLocation',
            'ST Standard Time': 'stStandardTime',
            'Product development': 'productDevelopment',
            'Garment Analysis': 'garmentAnalysis',
            'Cut,Sew,Pack Productivity': 'cutSewPackProductivity',
            'Machine allocation': 'machineAllocation',
            'Skill inventory': 'skillInventory',
            'Team Performance': 'teamPerformance',
            'Learning Curve': 'learningCurve',
            'Downtimes': 'downtimes',
            'Cost centers ,Direct/Indirect Cost': 'costCentersDirectIndirectCost',
            'CPM': 'cpm',
            'Style Costing': 'styleCosting',
            'QA Audit Finishing Packing': 'qaAuditFinishingPacking',
            'Humidity Aquaboy Checking': 'humidityAquaboyChecking',
            'First Output Finishing And Packing': 'firstOutputFinishingAndPacking',
            'Online Training': 'onlineTraining',
            'Shipping': 'shipping',
            'PPC': 'ppc',
            'Merchandising': 'merchandising',
            'Purchasing': 'purchasing',
            'General Affairs': 'generalAffairs',
            'Financial': 'financial',
            'CBSA': 'cbsa',
            'Technical': 'technical',
            'Raw Material Warehouse': 'rawMaterialWarehouse',
            'SCC': 'scc',
            'TPM': 'tpm',
            'Warehouse': 'warehouse',
            'IE': 'ie',
            'QA (Fabric)': 'qaFabric',
            'Dashboard': 'dashboard',
            'Report': 'report',
            'CCF': 'ccf',
            'MISTI': 'misti',
            'OWSO': 'owso',
            'E-Filing': 'eFiling',
            'NSSF': 'nssf',
            'Pre Production': 'preProduction',
            'First Output ': 'firstOutput',
            'Cut': 'cut'
        };

        const translationKey = titleMap[title];
        if (translationKey) {
            return t(translationKey);
        }
        
        // If no mapping found, try to find a direct key match (camelCase)
        const camelCaseKey = title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
        const firstLower = camelCaseKey.charAt(0).toLowerCase() + camelCaseKey.slice(1);
        if (currentTranslations[firstLower]) {
            return t(firstLower);
        }
        
        // Return original title if no translation found
        return title;
    };

    const value = {
        language,
        translations: currentTranslations,
        t,
        changeLanguage,
        getLanguageName,
        translateModuleTitle
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

export default TranslationContext;

