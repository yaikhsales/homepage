const fs = require('fs');
['eng.js', 'kh.js', 'ch.js'].forEach(f => {
  let p = 'src/translate/' + f;
  let t = fs.readFileSync(p, 'utf8');
  // It looks for a comma followed by whitespace, then another comma, then whitespace, then title_accountant
  t = t.replace(/,\s*,\s*title_accountant:/g, ',\n    title_accountant:');
  fs.writeFileSync(p, t);
  console.log('Fixed ' + f);
});
