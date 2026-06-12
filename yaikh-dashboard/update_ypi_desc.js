const fs = require('fs');

const ypi_eng = "YPI introduction ... i got all the technical details in 3 languages or even more, from 1st sample to shipment every technical details.";
const ypi_kh = "ការណែនាំ YPI... ខ្ញុំមានព័ត៌មានលម្អិតបច្ចេកទេសទាំងអស់ជា ៣ ភាសា ឬច្រើនជាងនេះ ចាប់ពីគំរូទី១ រហូតដល់ការដឹកជញ្ជូនរាល់ព័ត៌មានលម្អិតបច្ចេកទេសទាំងអស់។";
const ypi_ch = "YPI 介绍... 我掌握了3种或更多语言的所有技术细节，从第一个样品到装运的每一个技术细节。";

const sb_eng = "I manage the payment of shipping and freight bills, ensuring all customs duties and transport invoices are accurate, recorded, and paid on time.";
const sb_kh = "ខ្ញុំគ្រប់គ្រងការទូទាត់វិក័យប័ត្រដឹកជញ្ជូននិងទំនិញ ដោយធានាថារាល់ពន្ធគយ និងវិក័យប័ត្រដឹកជញ្ជូនមានភាពត្រឹមត្រូវ ត្រូវបានកត់ត្រា និងទូទាត់ទាន់ពេលវេលា។";
const sb_ch = "我管理运输和运费账单的支付，确保所有关税和运输发票准确无误、记录在案并按时支付。";

['eng.js', 'kh.js', 'ch.js'].forEach(lang => {
    let file = 'src/translate/' + lang;
    let content = fs.readFileSync(file, 'utf8');

    let ypi_desc = lang === 'eng.js' ? ypi_eng : lang === 'kh.js' ? ypi_kh : ypi_ch;
    let sb_desc = lang === 'eng.js' ? sb_eng : lang === 'kh.js' ? sb_kh : sb_ch;

    // Check what the key is named (desc_ypi, desc_shippingBill, desc_shipping_bill)
    if (!content.includes('desc_ypi:')) {
        // If desc_ypi doesn't exist, we append it before the end of the object
        content = content.replace(/(\n};\n?)$/, `\n    popupTitle_ypi: "OPERATIONS · YPI",\n    desc_ypi: "${ypi_desc}",$1`);
    } else {
        content = content.replace(/desc_ypi:\s*["'].*?["'],?/g, `desc_ypi: "${ypi_desc}",`);
        content = content.replace(/popupTitle_ypi:\s*["'].*?["'],?/g, `popupTitle_ypi: "OPERATIONS · YPI",`);
    }

    if (content.includes('desc_shipping_bill:')) {
        content = content.replace(/desc_shipping_bill:\s*["'].*?["'],?/g, `desc_shipping_bill: "${sb_desc}",`);
        content = content.replace(/popupTitle_shipping_bill:\s*["'].*?["'],?/g, `popupTitle_shipping_bill: "ADMINISTRATION · BILLING",`);
    } else if (content.includes('desc_shippingBill:')) {
        content = content.replace(/desc_shippingBill:\s*["'].*?["'],?/g, `desc_shippingBill: "${sb_desc}",`);
        content = content.replace(/popupTitle_shippingBill:\s*["'].*?["'],?/g, `popupTitle_shippingBill: "ADMINISTRATION · BILLING",`);
    } else {
        // Append it
        content = content.replace(/(\n};\n?)$/, `\n    popupTitle_shipping_bill: "ADMINISTRATION · BILLING",\n    desc_shipping_bill: "${sb_desc}",$1`);
    }

    fs.writeFileSync(file, content);
});
console.log("Updated YPI and Shipping Bill translations!");
