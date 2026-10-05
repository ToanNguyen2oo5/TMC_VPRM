const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/costumes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));

const cleanDefs = `<defs>
  <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#4169E1" />
    <stop offset="100%" stopColor="#00008B" />
  </linearGradient>
  <linearGradient id="secondaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#DAA520" />
    <stop offset="100%" stopColor="#B8860B" />
  </linearGradient>
  <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#FF69B4" />
    <stop offset="100%" stopColor="#C71585" />
  </linearGradient>
</defs>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace anything between <defs> and </defs> with cleanDefs
  content = content.replace(/<defs>[\s\S]*?<\/defs>/g, cleanDefs);
  
  // Remove any remaining React expressions like { ... }
  content = content.replace(/\{[^}]+\}/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed ' + file);
}
