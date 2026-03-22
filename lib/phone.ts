/**
 * Moroccan WhatsApp / mobile numbers only:
 * - Local: 10 digits starting with 06 or 07 (e.g. 0612345678)
 * - International: 12 digits 212[67] + 8 digits (e.g. +212 612 345 678 → 212612345678)
 *
 * Stored as digits only (no +), suitable for wa.me and `shops.whatsapp_number`.
 */
export type WhatsAppParseResult =
  | { ok: true; digits: string }
  | { ok: false }

export function parseMoroccanWhatsApp(input: string): WhatsAppParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false };

  let d = trimmed.replace(/\D/g, '');
  if (!d) return { ok: false };

  if (d.startsWith('00')) {
    d = d.slice(2);
  }

  // Local: 06XXXXXXXX / 07XXXXXXXX (10 digits)
  if (d.length === 10 && /^0[67]\d{8}$/.test(d)) {
    return { ok: true, digits: `212${d.slice(1)}` };
  }

  // +2126… / +2127… → 212[67] + 8 digits (12 digits total)
  if (d.length === 12 && /^212[67]\d{8}$/.test(d)) {
    return { ok: true, digits: d };
  }

  return { ok: false };
}

/** Client-side guard: same rules as `parseMoroccanWhatsApp`. */
export function isValidMoroccanWhatsAppInput(input: string): boolean {
  return parseMoroccanWhatsApp(input).ok;
}

/** Alias for the Moroccan WhatsApp parser (signup / live validation). */
export const parseWhatsAppNumber = parseMoroccanWhatsApp;
