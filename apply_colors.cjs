const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/costumes');

const COLORS = {
  'tu-than.svg': { primary: ['#8B4513', '#5C4033'], secondary: ['#228B22', '#006400'], accent: ['#FF69B4', '#C71585'] }, // Nâu đất, váy đen/xanh, yếm đào
  'ao-dai.svg': { primary: ['#FFFFFF', '#F0F0F0'], secondary: ['#FF0000', '#CC0000'], accent: ['#DAA520', '#B8860B'] }, // Áo trắng quần lụa đỏ
  'nhat-binh.svg': { primary: ['#000080', '#00008B'], secondary: ['#FF0000', '#B22222'], accent: ['#FFD700', '#DAA520'] }, // Xanh chàm, viền đỏ/vàng
  'ngu-than.svg': { primary: ['#2F4F4F', '#000000'], secondary: ['#FFFFFF', '#F0F0F0'], accent: ['#DAA520', '#B8860B'] }, // Đen / Xanh đen
  'ba-ba.svg': { primary: ['#8B4513', '#5C4033'], secondary: ['#000000', '#000000'], accent: ['#000000', '#000000'] }, // Nâu
  'giao-linh.svg': { primary: ['#800000', '#8B0000'], secondary: ['#DAA520', '#B8860B'], accent: ['#000000', '#000000'] } // Đỏ đô
};

for (const file of Object.keys(COLORS)) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const c = COLORS[file];
  
  const defs = `<defs>
  <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="${c.primary[0]}" />
    <stop offset="100%" stopColor="${c.primary[1]}" />
  </linearGradient>
  <linearGradient id="secondaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="${c.secondary[0]}" />
    <stop offset="100%" stopColor="${c.secondary[1]}" />
  </linearGradient>
  <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="${c.accent[0]}" />
    <stop offset="100%" stopColor="${c.accent[1]}" />
  </linearGradient>
</defs>`;

  content = content.replace(/<defs>[\s\S]*?<\/defs>/g, defs);
  
  fs.writeFileSync(filePath, content);
  console.log('Applied colors to ' + file);
}
