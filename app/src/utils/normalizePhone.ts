export const PHONE_COUNTRY_CODE = '+91';

/** The ONLY place that may build an E.164 phone string. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `${PHONE_COUNTRY_CODE}${digits}`;
  return `${PHONE_COUNTRY_CODE}${digits}`;
}
