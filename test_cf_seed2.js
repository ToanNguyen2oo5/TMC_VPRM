import dotenv from "dotenv";
dotenv.config();

const accountId = process.env.VITE_CF_ACCOUNT_ID;
const apiToken = process.env.VITE_CF_API_TOKEN;

async function testCF() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: "A cat", steps: 4, seed: 12345 })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text.substring(0, 200));
}

testCF();
