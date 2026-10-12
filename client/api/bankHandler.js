import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";

const PROFILE_ID = "profile_malika";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let client;

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function ensureEnv() {
  loadEnvFile(path.resolve(__dirname, "../.env"));
  loadEnvFile(path.resolve(__dirname, "../../server/.env"));
}

function database() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

function integer(value) {
  return typeof value === "bigint" ? Number(value) : Number(value);
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body) return JSON.parse(req.body);
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function handleBank(req, res) {
  try {
    ensureEnv();
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      send(res, 500, { error: "Не заданы TURSO_DATABASE_URL и TURSO_AUTH_TOKEN" });
      return;
    }
    const db = database();
    if (req.method === "GET") {
      send(res, 200, await loadBank(db));
      return;
    }
    if (req.method === "PUT") {
      const body = await readBody(req);
      const state = validateState(body);
      await saveBank(db, state);
      send(res, 200, { ok: true });
      return;
    }
    send(res, 405, { error: "Метод не поддерживается" });
  } catch (error) {
    const status = error.status || 500;
    send(res, status, { error: status === 400 ? error.message : "Не удалось обратиться к базе" });
  }
}

async function loadBank(db) {
  const profile = await db.execute({
    sql: "SELECT theme_mode, balance_hidden FROM profiles WHERE id = ?",
    args: [PROFILE_ID],
  });
  if (profile.rows.length === 0) {
    const missing = new Error("Профиль в базе не найден");
    missing.status = 500;
    throw missing;
  }
  const cards = await db.execute({
    sql: "SELECT id, brand, number, last4, holder, expiry, balance, frozen, is_primary FROM cards WHERE profile_id = ? ORDER BY rowid",
    args: [PROFILE_ID],
  });
  const saved = await db.execute({
    sql: "SELECT id, service_id, account, label FROM saved_payments WHERE profile_id = ? ORDER BY rowid",
    args: [PROFILE_ID],
  });
  const transactions = await db.execute({
    sql: `SELECT id, receipt, type, service_id, title, subtitle, amount, fee, cashback, account, card_id, card_label, created_at, status, category
          FROM transactions WHERE profile_id = ? ORDER BY rowid`,
    args: [PROFILE_ID],
  });
  const row = profile.rows[0];
  return {
    version: 1,
    themeMode: row.theme_mode,
    balanceHidden: integer(row.balance_hidden) === 1,
    cards: cards.rows.map((card) => ({
      id: card.id,
      brand: card.brand,
      number: card.number,
      last4: card.last4,
      holder: card.holder,
      expiry: card.expiry,
      balance: integer(card.balance),
      frozen: integer(card.frozen) === 1,
      isPrimary: integer(card.is_primary) === 1,
    })),
    saved: saved.rows.map((item) => ({
      id: item.id,
      serviceId: item.service_id,
      account: item.account,
      label: item.label,
    })),
    transactions: transactions.rows.map((item) => ({
      id: item.id,
      receipt: item.receipt,
      type: item.type,
      serviceId: item.service_id || "",
      title: item.title,
      subtitle: item.subtitle || "",
      amount: integer(item.amount),
      fee: integer(item.fee),
      cashback: integer(item.cashback),
      account: item.account || "",
      cardId: item.card_id,
      cardLabel: item.card_label || "",
      createdAt: item.created_at,
      status: item.status,
      category: item.category || "",
    })),
  };
}

function validateState(body) {
  if (!body || typeof body !== "object") fail("Пустое тело запроса");
  if (!["light", "dark", "system"].includes(body.themeMode)) fail("Неизвестная тема");
  if (!Array.isArray(body.cards) || body.cards.length < 1 || body.cards.length > 12) fail("Нужна хотя бы одна карта");
  if (!Array.isArray(body.transactions) || body.transactions.length > 300) fail("Слишком много операций");
  if (!Array.isArray(body.saved) || body.saved.length > 40) fail("Слишком много сохранённых платежей");

  const cards = body.cards.map((card) => ({
    id: required(card.id, 40),
    brand: required(card.brand, 20),
    number: digits(card.number, 16),
    last4: digits(card.last4, 4),
    holder: required(card.holder, 40),
    expiry: required(card.expiry, 7),
    balance: money(card.balance),
    frozen: Boolean(card.frozen),
    isPrimary: Boolean(card.isPrimary),
  }));
  if (new Set(cards.map((card) => card.id)).size !== cards.length) fail("Повторяется карта");
  if (!cards.some((card) => card.isPrimary)) cards[0].isPrimary = true;

  const transactions = body.transactions.map((item) => ({
    id: required(item.id, 40),
    receipt: required(item.receipt, 40),
    type: required(item.type, 20),
    serviceId: optional(item.serviceId, 40),
    title: required(item.title, 80),
    subtitle: optional(item.subtitle, 120),
    amount: money(item.amount),
    fee: money(item.fee || 0),
    cashback: money(item.cashback || 0),
    account: optional(item.account, 40),
    cardId: item.cardId ? required(item.cardId, 40) : null,
    cardLabel: optional(item.cardLabel, 40),
    createdAt: required(item.createdAt, 40),
    status: required(item.status || "success", 20),
    category: optional(item.category, 20),
  }));
  if (new Set(transactions.map((item) => item.id)).size !== transactions.length) fail("Повторяется операция");

  return {
    themeMode: body.themeMode,
    balanceHidden: Boolean(body.balanceHidden),
    cards,
    saved: body.saved.map((item) => ({
      id: required(item.id, 40),
      serviceId: required(item.serviceId, 40),
      account: required(item.account, 40),
      label: required(item.label, 80),
    })),
    transactions,
  };
}

async function saveBank(db, state) {
  const statements = [
    {
      sql: `INSERT INTO profiles (id, name, short_name, phone, initials, theme_mode, balance_hidden)
            VALUES (?, 'Малика Юсупова', 'Малика', '+998 90 312 44 18', 'МЮ', ?, ?)
            ON CONFLICT(id) DO UPDATE SET theme_mode = excluded.theme_mode, balance_hidden = excluded.balance_hidden`,
      args: [PROFILE_ID, state.themeMode, state.balanceHidden ? 1 : 0],
    },
    { sql: "DELETE FROM cards WHERE profile_id = ?", args: [PROFILE_ID] },
    { sql: "DELETE FROM saved_payments WHERE profile_id = ?", args: [PROFILE_ID] },
    { sql: "DELETE FROM transactions WHERE profile_id = ?", args: [PROFILE_ID] },
  ];
  for (const card of state.cards) {
    statements.push({
      sql: `INSERT INTO cards (id, profile_id, brand, number, last4, holder, expiry, balance, frozen, is_primary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [card.id, PROFILE_ID, card.brand, card.number, card.last4, card.holder, card.expiry, card.balance, card.frozen ? 1 : 0, card.isPrimary ? 1 : 0],
    });
  }
  for (const item of state.saved) {
    statements.push({
      sql: "INSERT INTO saved_payments (id, profile_id, service_id, account, label) VALUES (?, ?, ?, ?, ?)",
      args: [item.id, PROFILE_ID, item.serviceId, item.account, item.label],
    });
  }
  for (const item of state.transactions) {
    statements.push({
      sql: `INSERT INTO transactions
            (id, profile_id, receipt, type, service_id, title, subtitle, amount, fee, cashback, account, card_id, card_label, created_at, status, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        item.id, PROFILE_ID, item.receipt, item.type, item.serviceId, item.title, item.subtitle,
        item.amount, item.fee, item.cashback, item.account, item.cardId, item.cardLabel,
        item.createdAt, item.status, item.category,
      ],
    });
  }
  await db.batch(statements, "write");
}

function required(value, max) {
  const string = String(value ?? "").trim();
  if (!string || string.length > max) fail("Неверное поле");
  return string;
}

function optional(value, max) {
  const string = String(value ?? "").trim();
  if (string.length > max) fail("Слишком длинное поле");
  return string;
}

function digits(value, size) {
  const string = String(value ?? "").replace(/\D/g, "");
  if (string.length !== size) fail("Неверный номер карты");
  return string;
}

function money(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number > 100000000000 || number < -100000000000) fail("Неверная сумма");
  return number;
}

function fail(message) {
  const error = new Error(message);
  error.status = 400;
  throw error;
}
