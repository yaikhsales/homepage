const fs = require('fs');
['eng.js', 'kh.js', 'ch.js'].forEach(f => {
  let p = 'src/translate/' + f;
  let t = fs.readFileSync(p, 'utf8');
  // It looks for a quote followed by whitespace and then draftRoleNote:
  t = t.replace(/(["'])\s+(draftRoleNote:)/g, '$1,\n    $2');
  fs.writeFileSync(p, t);
  console.log('Fixed ' + f);
});
