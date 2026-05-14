export function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

export function fail(res, status, message, details) {
  return res.status(status).json({ error: { message, details } });
}

export function requireFields(body, fields) {
  return fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
}
