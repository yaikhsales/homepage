const fs = require('fs');

const modulePath = 'src/data/module.js';
let content = fs.readFileSync(modulePath, 'utf8');

const idToAgent = {
  "accountant-module": "agent-1.png",
  "iews": "agent-2.png", // if exists
  "pr-admin": "agent-3.png",
  "money-claim": "agent-4.png",
  "yhr": "agent-6.png",
  "org": "agent-7.png",
  "gatepass": "agent-8.png",
  "water": "agent-9.png",
  "waste": "agent-10.png",
  "ticket": "agent-11.png",
  "shop": "agent-12.png",
  "air": "agent-13.png",
  "meeting": "agent-14.png",
  "car": "agent-15.png",
  "fire-alarm": "agent-16.png",
  "cctv": "agent-17.png",
  "digital-audit": "agent-18.png",
  "energy": "agent-19.png",
  "chemical": "agent-20.png",
  "shipping": "agent-24.png",
  "e-government": "agent-25.png",
  "management": "agent-27.png", // guessing ID for management dashboard
  "sop": "agent-28.png",
  "system-analysis": "agent-29.png", // guessing ID
  "yqms": "agent-30.png",
  "fc": "agent-32.png",
  "4dp": "agent-37.png",
  "ypi": "agent-38.png",
  "e-invoicing": "agent-5.png",
  "salary-bill": "agent-21.png",
  "training": "agent-22.png",
  "temp-work-request": "agent-23.png",
  "speak-up": "agent-26.png",
  "call-out": "agent-31.png",
  "ywip": "agent-33.png",
  "ce": "agent-34.png",
  "ytm": "agent-35.png",
  "ytm-shop": "agent-36.png",
};

// We will use a regex to replace the image for matching ids
let unmatched = [];

for (const [id, agent] of Object.entries(idToAgent)) {
  const regex = new RegExp(`(id:\\s*["']${id}["'],[\\s\\S]*?image:\\s*["'])[^"']+([^"']*["'])`, 'g');
  if (content.match(regex)) {
      content = content.replace(regex, `$1IMG/avatars/${agent}$2`);
  } else {
      unmatched.push(id);
  }
}

// For any other module that didn't get mapped, assign a generic agent or leave it.
// Actually, let's just use regex to replace remaining ones sequentially from remaining pool if needed,
// but for now this is good enough.

fs.writeFileSync(modulePath, content);
console.log('Updated module.js');
console.log('Unmatched IDs:', unmatched);
