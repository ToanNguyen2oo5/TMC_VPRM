// fix_svg_attrs.cjs - Fix camelCase SVG attributes to kebab-case
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'costumes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));

files.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Fix React camelCase -> standard SVG kebab-case
  content = content.replace(/stopColor/g, 'stop-color');
  content = content.replace(/strokeWidth/g, 'stroke-width');
  content = content.replace(/strokeLinecap/g, 'stroke-linecap');
  content = content.replace(/strokeLinejoin/g, 'stroke-linejoin');
  content = content.replace(/fillRule/g, 'fill-rule');
  content = content.replace(/clipRule/g, 'clip-rule');
  content = content.replace(/stopOpacity/g, 'stop-opacity');
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed:', file);
});

console.log('Done! All SVGs fixed.');
