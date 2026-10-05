import { Client } from '@gradio/client';
async function testCodeFormer() {
  try {
    const client = await Client.connect('sczhou/CodeFormer');
    const result = await client.predict('/predict', [
      null, // background_enhance (boolean)
      null, // face_upsample (boolean)
      null, // upscale (numeric)
      null, // codeformer_fidelity (numeric)
      null, // image (Blob) - Wait, we need to know the parameters
    ]);
  } catch (e) { console.error(e) }
} testCodeFormer();
