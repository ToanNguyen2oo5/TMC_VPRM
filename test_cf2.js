import { Client } from '@gradio/client';
async function testCodeFormer() {
  try {
    const client = await Client.connect('sczhou/CodeFormer');
    const app_info = await client.view_api();
    console.log(JSON.stringify(app_info, null, 2));
  } catch (e) { console.error(e) }
} testCodeFormer();
