const fs = require('fs');
const code = fs.readFileSync('src/data/module.js', 'utf8');
const regex = /id:\s*["']([^"']+)["'],\s*title:\s*["']([^"']+)["']/g;
let match;
while((match = regex.exec(code)) !== null) {
  // Only extract the modules, ignore layout columns (which don't have -col, wait, let's filter out -col and -section)
  if(!match[1].endsWith('-col') && !match[1].endsWith('-section')) {
    console.log(match[1] + '|' + match[2]);
  }
}
