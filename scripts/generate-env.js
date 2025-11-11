const fs = require('fs');
const path = require('path');

const requiredKeys = ['API_BASE_URL', 'EXPO_PUBLIC_KAKAO_CLIENT_ID'];
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing environment variables: ${missingKeys.join(', ')}`);
}

const envLines = requiredKeys
  .map((key) => `${key}=${process.env[key]}`)
  .join('\n');

const targetPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(targetPath, `${envLines}\n`);

console.log(`Wrote .env with keys: ${requiredKeys.join(', ')}`);
