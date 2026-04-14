
# PhishGuard Proxy

PhishGuard Proxy is a CLI-based phishing detection and website blocking system that works across all browsers by acting as a local proxy server.

It provides real-time protection against suspicious, unsafe, and adult websites using configurable security modes, logging, and analytics — without requiring any browser extension.

---

## 🚀 Features

* 🔒 Real-time phishing and unsafe site blocking
* 🌐 Works across all browsers (Chrome, Brave, Incognito)
* ⚙️ 3 Security Modes (Safe, Safer, Safest)
* 🚫 Blocks:

  * Suspicious URLs
  * Adult content
  * HTTP traffic (in stricter modes)
* 📊 Logging system (site, time, result, mode)
* 📈 CLI analytics (usage stats)
* 👁️ Live monitoring (real-time logs in terminal)
* ⚡ Optimized HTTPS handling (no slowdown)
* 🧠 Smart detection using patterns and heuristics

---

## 🧠 How It Works

PhishGuard runs as a local proxy server:

Browser → Local Proxy → Internet

The proxy:

* Intercepts every request
* Extracts domain/URL
* Runs detection logic
* Decides:

  * ALLOW ✅
  * BLOCK ❌

Blocked requests are stopped instantly, while allowed requests are forwarded normally.

---

## 📁 Project Structure

```
phishguard-proxy/
│
├── server.js          # Core proxy server (HTTP + HTTPS handling)
├── detector.js        # Detection logic (phishing + adult + suspicious)
├── index.js           # CLI control system
├── config.json        # Settings (mode, enable/disable)
├── logs.txt           # Request logs
├── block.html         # Blocked page UI
├── package.json       # Dependencies
```

---

## ⚙️ Installation

Clone the repository:

```
git clone https://github.com/YOUR-USERNAME/phishguard-proxy.git
cd phishguard-proxy
npm install
```

---

## ▶️ Running the Proxy

```
node server.js
```

---

## 🌐 System Proxy Setup (Windows)

1. Press `Win + R`
2. Type:

```
inetcpl.cpl
```

3. Go to:

   * Connections → LAN Settings
4. Enable proxy:

```
Address: 127.0.0.1  
Port: 8080  
```

5. Save and restart your browser

---

## 🖥️ CLI Commands

### Enable / Disable Protection

```
node index.js on
node index.js off
```

---

### Change Security Mode

```
node index.js mode safe
node index.js mode safer
node index.js mode safest
```

---

### View Logs

```
node index.js logs
```

---

### View Analytics / Stats

```
node index.js stats
```

---

### Live Monitoring (Real-Time)

```
node index.js monitor
```

---

### Clear Logs

```
node index.js clearlogs
```

---

## 🔐 Detection Logic

### Suspicious URL Detection

Blocks URLs if:

* Contains `@`
* Length > 80
* Too many `-` characters
* Uses IP address instead of domain

---

### Adult Content Detection

Blocks domains containing keywords:

```
porn, xxx, adult, sex, xnxx, xvideos, redtube, youporn
```

---

### High-Risk Domain Extensions

Flags domains with:

```
.xyz, .top, .click, .tk, .ml, .cf, .gq
```

---

## ⚡ Security Modes

### SAFE

* Allows most traffic
* Blocks only clearly suspicious URLs

---

### SAFER

* Blocks all HTTP websites
* Blocks suspicious URLs

---

### SAFEST

* Blocks HTTP
* Blocks suspicious URLs
* Blocks adult content
* Applies stricter filtering

---

## 📊 Log Format

Each request is logged:

```
[2026-04-14T21:30:25] MODE:safest DOMAIN:xnxx.com RESULT:BLOCK
```

---

## 🧪 Testing

Try:

### Should BLOCK:

* http://example.com (in safer/safest)
* xnxx.com
* g00gle-login.com

### Should ALLOW:

* https://google.com
* https://github.com

---

## ⚠️ Limitations

* HTTPS content is not deeply inspected (only domain-level filtering)
* Cannot show UI warning inside browser (no extension used)
* Some advanced phishing sites may require AI detection

---

## 🔥 Future Improvements

* AI-based phishing detection (Ollama integration)
* Auto-updating threat intelligence lists
* Background service (auto start on boot)
* Desktop GUI version
* Installer (.exe)

---

## 👨‍💻 Author

Aryan

---

## 📜 License

This project is for educational and research purposes.
Use responsibly.
