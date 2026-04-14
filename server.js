const http = require('http');
const net = require('net');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { detectURL } = require('./detector.js');

const PORT = 8080;
const configPath = path.join(__dirname, 'config.json');
const blockHtml = fs.readFileSync(path.join(__dirname, 'block.html'));
const logsPath = path.join(__dirname, 'logs.txt');

function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    return { enabled: true, mode: 'safe' };
  }
}

function logRequest(mode, domain, result) {
  const ts = new Date().toISOString();
  const logLine = `[${ts}] MODE:${mode} DOMAIN:${domain} RESULT:${result}\n`;
  try {
    fs.appendFileSync(logsPath, logLine);
  } catch (e) {}
}

const server = http.createServer((req, res) => {
  const config = getConfig();
  const parsedUrl = new url.URL(req.url);
  const domain = parsedUrl.hostname;
  let status = 'allow';
  
  if (config.enabled) {
    status = detectURL(req.url, config.mode);
  }

  logRequest(config.mode, domain, status.toUpperCase());

  if (status === 'block') {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end(blockHtml);
    return;
  }

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.pathname + parsedUrl.search,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', () => {
    res.writeHead(500);
    res.end();
  });
  
  req.pipe(proxyReq);
});

server.on('connect', (req, clientSocket, head) => {
  const config = getConfig();
  const [hostname, portStr] = req.url.split(':');
  const port = portStr ? parseInt(portStr, 10) : 443;
  let status = 'allow';

  if (config.enabled) {
    status = detectURL(`https://${hostname}`, config.mode);
  }

  logRequest(config.mode, hostname, status.toUpperCase());

  if (status === 'block') {
    clientSocket.destroy();
    return;
  }

  const serverSocket = net.connect(port, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  clientSocket.setTimeout(10000);
  serverSocket.setTimeout(10000);

  clientSocket.on('timeout', () => {
    clientSocket.destroy();
    serverSocket.destroy();
  });

  serverSocket.on('timeout', () => {
    clientSocket.destroy();
    serverSocket.destroy();
  });

  serverSocket.on('error', () => {
    clientSocket.destroy();
  });
  
  clientSocket.on('error', () => {
    serverSocket.destroy();
  });
});

module.exports = server;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
  });
}
