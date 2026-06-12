const fs = require('fs');

const modulePath = 'src/data/module.js';
let content = fs.readFileSync(modulePath, 'utf8');

const descData = JSON.parse(fs.readFileSync('extracted_descriptions.json', 'utf8'));

const descMap = {};
descData.forEach(item => {
    const urlObj = new URL(item.src);
    const filename = urlObj.pathname.split('/').pop();
    descMap[filename] = {
        popupTitle: item.title,
        description: item.description.replace(/^“|”$/g, '')
    };
});

for (const [filename, info] of Object.entries(descMap)) {
    // Escape quotes for JS
    const popupTitleEscaped = info.popupTitle.replace(/"/g, '\\"');
    const descriptionEscaped = info.description.replace(/"/g, '\\"').replace(/\n/g, ' ');
    
    const regex = new RegExp(`(image:\\s*["']IMG/avatars/${filename}["'],)`, 'g');
    const replacement = `$1\n            popupTitle: "${popupTitleEscaped}",\n            description: "${descriptionEscaped}",`;
    
    content = content.replace(regex, replacement);
}

fs.writeFileSync(modulePath, content);
console.log('Descriptions added.');
