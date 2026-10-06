const fs = require('fs');
const buffer = fs.readFileSync('public/garments/ao-dai-placeholder.png');
// Check if it's PNG
if (buffer[0] === 137 && buffer[1] === 80) {
    // IHDR is at 12, length 13. At 25 we have color type
    // Color type 6 = Truecolor with alpha, 4 = Grayscale with alpha
    const colorType = buffer[25];
    console.log("Color type:", colorType);
    if (colorType === 6 || colorType === 4) {
        console.log("Image has alpha channel.");
    } else {
        console.log("Image DOES NOT have alpha channel.");
    }
}
