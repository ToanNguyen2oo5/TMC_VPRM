import { generateOutfitWithCloudflare } from './src/services/cloudflareImageService.js';
import dotenv from 'dotenv';
dotenv.config();

async function testCF() {
  try {
    const res = await generateOutfitWithCloudflare(
      { ten: 'Áo dài', id: 'ao_dai_cach_tan' },
      0, 
      {}, 
      null, 
      12345
    );
    console.log('Success, length:', res.length);
  } catch (e) {
    console.error('Error CF:', e);
  }
}
testCF();

