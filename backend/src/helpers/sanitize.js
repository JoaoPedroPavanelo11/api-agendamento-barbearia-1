function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
}

function sanitizeObj(obj, fields) {
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    if (fields.includes(key)) {
      sanitized[key] = stripHtml(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}

module.exports = { stripHtml, sanitizeObj };