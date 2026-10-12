import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "..");
const schemaPath = path.resolve(serverRoot, "src/db/hamyon.sql");
const local = process.argv.includes("--local");

loadEnv(path.resolve(serverRoot, ".env"));

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!local && (!url || !authToken)) {
  console.error("Не хватает TURSO_DATABASE_URL или TURSO_AUTH_TOKEN.");
  console.error("Скопируйте server/.env.example в server/.env и заполните оба значения.");
  console.error("Локальная проверка без Turso: npm run db:push -- --local");
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, "utf8");
const statements = buildSeed();

if (local) {
  const { DatabaseSync } = await import("node:sqlite");
  const file = path.resolve(serverRoot, "data/hamyon.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(schema);
  const count = db.prepare("SELECT COUNT(*) AS n FROM profiles").get().n;
  if (Number(count) === 0) {
    db.exec("BEGIN");
    try {
      for (const statement of statements) {
        db.prepare(statement.sql).run(...statement.args);
      }
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  const summary = summarize(db);
  db.close();
  console.log(`Локальная база: ${file}`);
  console.log(summary);
} else {
  const client = createClient({ url, authToken });
  await client.executeMultiple(schema);
  const existing = await client.execute("SELECT COUNT(*) AS n FROM profiles");
  if (Number(existing.rows[0].n) === 0) {
    await client.batch(
      statements.map((statement) => ({ sql: statement.sql, args: statement.args })),
      "write",
    );
  }
  const profiles = await client.execute("SELECT COUNT(*) AS n FROM profiles");
  const cards = await client.execute("SELECT COUNT(*) AS n FROM cards");
  const transactions = await client.execute("SELECT COUNT(*) AS n FROM transactions");
  const saved = await client.execute("SELECT COUNT(*) AS n FROM saved_payments");
  console.log(`Turso: ${url}`);
  console.log(`profiles=${profiles.rows[0].n} cards=${cards.rows[0].n} transactions=${transactions.rows[0].n} saved_payments=${saved.rows[0].n}`);
}

function summarize(db) {
  const row = (sql) => db.prepare(sql).get().n;
  return `profiles=${row("SELECT COUNT(*) AS n FROM profiles")} cards=${row("SELECT COUNT(*) AS n FROM cards")} transactions=${row("SELECT COUNT(*) AS n FROM transactions")} saved_payments=${row("SELECT COUNT(*) AS n FROM saved_payments")}`;
}

function loadEnv(file) {
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

function at(daysAgo, hours, minutes) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function buildSeed() {
  const profile = "profile_malika";
  const statements = [
    {
      sql: `INSERT INTO profiles (id, name, short_name, phone, initials, theme_mode, balance_hidden)
            VALUES (?, ?, ?, ?, ?, 'system', 0)`,
      args: [profile, "Малика Юсупова", "Малика", "+998 90 312 44 18", "МЮ"],
    },
  ];

  const cards = [
    ["card_uz", "uzcard", "8600123456784412", "4412", "MALIKA YUSUPOVA", "09/28", 8450000, 0, 1],
    ["card_humo", "humo", "9860091233447781", "7781", "MALIKA YUSUPOVA", "03/27", 2180000, 0, 0],
    ["card_visa", "visa", "4278320011905520", "5520", "MALIKA YUSUPOVA", "12/28", 6750000, 0, 0],
  ];
  for (const card of cards) {
    statements.push({
      sql: `INSERT INTO cards (id, profile_id, brand, number, last4, holder, expiry, balance, frozen, is_primary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [card[0], profile, ...card.slice(1)],
    });
  }

  const saved = [
    ["save_beeline", "beeline", "90 312 44 18", "Мой Beeline"],
    ["save_power", "power", "452190881", "Свет, дом"],
    ["save_net", "uztelecom", "100245778", "Домашний интернет"],
  ];
  for (const item of saved) {
    statements.push({
      sql: `INSERT INTO saved_payments (id, profile_id, service_id, account, label) VALUES (?, ?, ?, ?, ?)`,
      args: [item[0], profile, item[1], item[2], item[3]],
    });
  }

  const transactions = [
    tx("tx_evos", "HM-240181", "merchant", "", "Evos", "Мирабад", -45000, 0, 450, "", "card_humo", "Humo •• 7781", at(0, 10, 24), "food"),
    tx("tx_atto", "HM-240176", "payment", "atto", "ATTO", "Транспорт", -5000, 0, 0, "9988 1200 4412", "card_uz", "Uzcard •• 4412", at(0, 8, 41), "transport"),
    tx("tx_beeline", "HM-240102", "payment", "beeline", "Beeline", "Мобильная связь", -50000, 0, 0, "90 312 44 18", "card_uz", "Uzcard •• 4412", at(1, 19, 5), "mobile"),
    tx("tx_korzinka", "HM-239994", "merchant", "", "Korzinka", "Юнусабад", -186000, 0, 1860, "", "card_visa", "Visa •• 5520", at(1, 13, 12), "shopping"),
    tx("tx_cashback", "HM-239995", "cashback", "", "Кешбэк Korzinka", "1% за оплату Go", 1860, 0, 0, "", "card_visa", "Visa •• 5520", at(1, 13, 12), "cashback"),
    tx("tx_power", "HM-239880", "payment", "power", "Электричество", "Коммунальные", -87400, 0, 0, "452190881", "card_uz", "Uzcard •• 4412", at(2, 18, 20), "utilities"),
    tx("tx_salary", "HM-239701", "income", "", "Зарплата", "Поступление на Uzcard", 2400000, 0, 0, "", "card_uz", "Uzcard •• 4412", at(3, 9, 2), "income"),
    tx("tx_coffee", "HM-239640", "merchant", "", "Bean & Co", "Шайхантахур", -28000, 0, 280, "", "card_visa", "Visa •• 5520", at(3, 16, 48), "food"),
    tx("tx_p2p", "HM-239510", "transfer", "", "Жасур Алиев", "Перевод по номеру", -201000, 1000, 0, "+998 93 700 12 44", "card_humo", "Humo •• 7781", at(4, 21, 16), "transfer"),
    tx("tx_net", "HM-239330", "payment", "uztelecom", "Uztelecom", "Интернет", -99000, 0, 0, "100245778", "card_uz", "Uzcard •• 4412", at(5, 11, 4), "internet"),
    tx("tx_gas", "HM-239210", "payment", "gas", "Hududgaz", "Коммунальные", -41200, 0, 0, "88332011", "card_uz", "Uzcard •• 4412", at(6, 17, 36), "utilities"),
  ];
  for (const item of transactions) {
    statements.push({
      sql: `INSERT INTO transactions
        (id, profile_id, receipt, type, service_id, title, subtitle, amount, fee, cashback, account, card_id, card_label, created_at, status, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'success', ?)`,
      args: [item.id, profile, item.receipt, item.type, item.serviceId, item.title, item.subtitle, item.amount, item.fee, item.cashback, item.account, item.cardId, item.cardLabel, item.createdAt, item.category],
    });
  }
  return statements;
}

function tx(id, receipt, type, serviceId, title, subtitle, amount, fee, cashback, account, cardId, cardLabel, createdAt, category) {
  return { id, receipt, type, serviceId, title, subtitle, amount, fee, cashback, account, cardId, cardLabel, createdAt, category };
}
