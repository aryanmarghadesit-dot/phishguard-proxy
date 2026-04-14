const adultKeywords = ['porn', 'xxx', 'adult', 'sex', 'xnxx', 'xvideos'];

function detectURL(urlStr, mode) {
  let urlObj;
  try {
    urlObj = new URL(urlStr);
  } catch (e) {
    return 'block';
  }

  const isHttps = urlObj.protocol === 'https:';
  const isHttp = urlObj.protocol === 'http:';
  const isSuspicious = urlStr.includes('@') || urlStr.length > 80 || (urlStr.match(/-/g) || []).length > 4 || /^(\d{1,3}\.){3}\d{1,3}$/.test(urlObj.hostname);
  const hasAdult = adultKeywords.some(kw => urlStr.toLowerCase().includes(kw));

  if (mode === 'safe') {
    if (isSuspicious) return 'block';
    return 'allow';
  }

  if (mode === 'safer') {
    if (!isHttps) return 'block';
    if (isSuspicious) return 'block';
    return 'allow';
  }

  if (mode === 'safest') {
    if (!isHttps) return 'block';
    if (isSuspicious) return 'block';
    if (hasAdult) return 'block';
    return 'allow';
  }

  return 'allow';
}

module.exports = { detectURL };
