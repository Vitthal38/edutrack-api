export const validators = {
  required: (v) => (v == null || String(v).trim() === '' ? 'Required' : null),
  email:    (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email'),
  minLength: (n) => (v) => (!v || String(v).length >= n ? null : `Min ${n} chars`),
  maxLength: (n) => (v) => (!v || String(v).length <= n ? null : `Max ${n} chars`),
  min: (n) => (v) => (v == null || Number(v) >= n ? null : `Min ${n}`),
  max: (n) => (v) => (v == null || Number(v) <= n ? null : `Max ${n}`),
};

export function validate(values, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const err = rule(values[field]);
      if (err) { errors[field] = err; break; }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}