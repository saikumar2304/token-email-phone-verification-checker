const axios = require('axios');
const fs = require('fs');

async function checkVerification() {
  try {
    const tokens = fs.readFileSync('tokens.txt', 'utf8').split('\n').filter(Boolean);
    const logStream = fs.createWriteStream('logs.txt', { flags: 'a' });

    for (const token of tokens) {
      const headers = {
        Authorization: token.trim(),
        'Content-Type': 'application/json'
      };

      const response = await axios.get('https://discord.com/api/v10/users/@me', { headers });

      if (response.status === 200) {
        const data = response.data;
        const emailVerified = data.verified;
        const phoneVerified = data.phone !== null;

        const log = `Token: ${token}\nEmail Verified: ${emailVerified}\nPhone Verified: ${phoneVerified}\n---\n`;

        console.log(log);
        logStream.write(log);
      } else {
        const log = `Failed to check verification for token: ${token}\n---\n`;

        console.log(log);
        logStream.write(log);
      }
    }

    logStream.end();
    console.log('Verification check completed. Results logged in logs.txt');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

checkVerification();
