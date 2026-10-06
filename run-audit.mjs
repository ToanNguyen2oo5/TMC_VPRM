import { chromium } from 'playwright';
import fs from 'fs';

const URL = 'http://localhost:5173';
const SIZES = [360, 768, 1024, 1440];
const TABS = ['home', 'mixer', 'webar'];

async function run() {
  if (!fs.existsSync('./audit-screenshots')) {
    fs.mkdirSync('./audit-screenshots');
  }
  
  console.log('Khởi động trình duyệt...');
  const browser = await chromium.launch();
  
  for (const size of SIZES) {
    const context = await browser.newContext({
      viewport: { width: size, height: size === 360 ? 640 : 900 }
    });
    const page = await context.newPage();
    
    for (const tab of TABS) {
      console.log(`Chụp ảnh viewport ${size}px cho tab ${tab}...`);
      await page.goto(URL);
      
      // Chờ React mount
      await page.waitForTimeout(2000);
      
      // Điều hướng tới tab mong muốn
      if (tab === 'home') {
        // mặc định là home
      } else if (tab === 'mixer') {
        await page.keyboard.press('Alt+2');
      } else if (tab === 'webar') {
        await page.keyboard.press('Alt+3');
      }
      
      // Chờ chuyển cảnh
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: `./audit-screenshots/${tab}-${size}.png`, fullPage: true });
    }
    await context.close();
  }
  
  await browser.close();
  console.log('Hoàn thành chụp ảnh!');
}

run().catch(console.error);
