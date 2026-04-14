const fs = require('fs');
const path = require('path');
const server = require('./server.js');

const logsPath = path.join(__dirname, 'logs.txt');
const command = process.argv[2];

if (!command) {
  if (require.main === module) {
    server.listen(8080, () => {
      console.log('Proxy running on port 8080');
    });
  }
} else if (command === 'logs') {
  if (fs.existsSync(logsPath)) {
    console.log(fs.readFileSync(logsPath, 'utf8'));
  } else {
    console.log('No logs found.');
  }
} else if (command === 'clearlogs') {
  if (fs.existsSync(logsPath)) {
    fs.unlinkSync(logsPath);
  }
  console.log('Logs cleared.');
} else if (command === 'stats') {
  if (!fs.existsSync(logsPath)) {
    return console.log('No logs found.');
  }
  
  const content = fs.readFileSync(logsPath, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  
  let totalRequests = 0;
  let totalBlocked = 0;
  let totalAllowed = 0;
  const domainFreq = {};
  const blockedFreq = {};

  lines.forEach(line => {
    totalRequests++;
    const match = line.match(/DOMAIN:([\S]+) RESULT:([A-Z]+)/);
    if (!match) return;
    
    const domain = match[1];
    const result = match[2];
    
    domainFreq[domain] = (domainFreq[domain] || 0) + 1;
    if (result === 'BLOCK') {
      totalBlocked++;
      blockedFreq[domain] = (blockedFreq[domain] || 0) + 1;
    } else {
      totalAllowed++;
    }
  });

  const getMostFreq = (freq) => {
    let max = 0;
    let most = 'none';
    for (const key in freq) {
      if (freq[key] > max) {
        max = freq[key];
        most = key;
      }
    }
    return `${most} (${max})`;
  };

  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Total Allowed: ${totalAllowed}`);
  console.log(`Total Blocked: ${totalBlocked}`);
  console.log(`Most Visited Domain: ${getMostFreq(domainFreq)}`);
  console.log(`Most Blocked Domain: ${getMostFreq(blockedFreq)}`);
} else {
  console.log('Unknown command. Use: logs, stats, clearlogs');
}
