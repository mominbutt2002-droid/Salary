export function formatSum(value) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(Number(value) || 0));
}

export function formatMoney(value) {
  return `${formatSum(value)} сум`;
}

export function formatDateTime(iso) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDayLabel(iso) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(date, today)) return "Сегодня";
  if (sameDay(date, yesterday)) return "Вчера";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 6) return "Доброй ночи";
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}

export function digitsOnly(value, max = 24) {
  return String(value || "").replace(/\D/g, "").slice(0, max);
}

export function formatCardGroups(digits) {
  return digitsOnly(digits, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function detectBrand(digits) {
  const value = digitsOnly(digits, 16);
  if (value.startsWith("8600")) return "uzcard";
  if (value.startsWith("9860")) return "humo";
  if (value.startsWith("4")) return "visa";
  if (value.startsWith("5")) return "mastercard";
  return value.length ? "local" : "uzcard";
}

export function parseExpiry(value) {
  const match = /^(\d{2})\s*\/?\s*(\d{2})$/.exec(String(value || "").trim());
  if (!match) return null;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return null;
  const end = new Date(year, month, 0, 23, 59, 59);
  if (end < new Date()) return null;
  return `${match[1]}/${match[2]}`;
}

export function formatExpiryInput(value) {
  const digits = digitsOnly(value, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function makeReceipt() {
  return `HM-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function cardLabel(card) {
  const names = {
    uzcard: "Uzcard",
    humo: "Humo",
    visa: "Visa",
    mastercard: "Mastercard",
    local: "Карта",
  };
  return `${names[card.brand] || "Карта"} •• ${card.last4}`;
}

export function externalFee(amount) {
  const value = Math.round(Number(amount) || 0);
  if (value <= 0) return 0;
  return Math.max(1000, Math.round(value * 0.005));
}

export function maskAccount(account, kind) {
  const raw = String(account || "");
  if (kind === "phone") {
    const digits = digitsOnly(raw, 12);
    const local = digits.startsWith("998") ? digits.slice(3) : digits;
    if (local.length !== 9) return raw;
    return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7)}`;
  }
  return raw.trim();
}
