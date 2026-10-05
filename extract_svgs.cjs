const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/OutfitPreview.jsx');
const content = fs.readFileSync(file, 'utf8');

// The costume <g> tags are inside OutfitPreview.jsx.
// We will regex search for them.
const costumes = ['tu-than', 'nhat-binh', 'ngu-than', 'ba-ba', 'giao-linh', 'ao-dai'];

const outDir = path.join(__dirname, 'public/costumes');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// We need to extract the gradients too!
const defsMatch = content.match(/<defs>([\s\S]*?)<\/defs>/);
const defs = defsMatch ? `<defs>${defsMatch[1]}</defs>` : '';

for (const name of costumes) {
  // Regex to extract <g id="costume-name" ...> ... </g>
  // This is tricky because of nested tags. A simpler way is to find the index.
  const startStr = `<g id="costume-${name}"`;
  const startIndex = content.indexOf(startStr);
  
  if (startIndex !== -1) {
    let openCount = 0;
    let endIndex = startIndex;
    
    // Simple bracket matching to find closing </g>
    for (let i = startIndex; i < content.length; i++) {
        if (content.substr(i, 2) === '<g') openCount++;
        else if (content.substr(i, 3) === '</g') {
            openCount--;
            if (openCount === 0) {
                endIndex = i + 4;
                break;
            }
        }
    }
    
    let gContent = content.substring(startIndex, endIndex);
    
    // Replace {fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'} with 'none'
    // Replace fill="url(#primaryGrad)" etc with actual colors since gradients might rely on react props
    // Actually, we can just replace the React expressions with static values
    gContent = gContent.replace(/\{fabricTexture[^}]+\}/g, '"none"');
    gContent = gContent.replace(/\{isAnime[^}]+\}/g, '"#2d1810"');
    gContent = gContent.replace(/\{accentColor\}/g, '"#DAA520"');
    gContent = gContent.replace(/fill="url\(#brocadePattern\)"/g, 'fill="none"');
    
    // Some SVGs use <> ... </> fragments, remove them
    gContent = gContent.replace(/<\/?>/g, '');
    
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 600">
      ${defs.replace(/\{primaryColor\}/g, '"#B22222"').replace(/\{secondaryColor\}/g, '"#DAA520"').replace(/\{accentColor\}/g, '"#DAA520"')}
      ${gContent}
    </svg>`;
    
    fs.writeFileSync(path.join(outDir, `${name}.svg`), svgStr);
    console.log(`Extracted ${name}.svg`);
  }
}
