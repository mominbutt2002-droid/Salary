-- Учебная база Hamyon. Номера карт в сиде выдуманы.

CREATE TABLE IF NOT EXISTS profiles (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  short_name      TEXT NOT NULL,
  phone           TEXT NOT NULL,
  initials        TEXT NOT NULL,
  theme_mode      TEXT NOT NULL DEFAULT 'system',
  balance_hidden  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cards (
  id          TEXT PRIMARY KEY,
  profile_id  TEXT NOT NULL,
  brand       TEXT NOT NULL,
  number      TEXT NOT NULL,
  last4       TEXT NOT NULL,
  holder      TEXT NOT NULL,
  expiry      TEXT NOT NULL,
  balance     INTEGER NOT NULL,
  frozen      INTEGER NOT NULL DEFAULT 0,
  is_primary  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS saved_payments (
  id          TEXT PRIMARY KEY,
  profile_id  TEXT NOT NULL,
  service_id  TEXT NOT NULL,
  account     TEXT NOT NULL,
  label       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT PRIMARY KEY,
  profile_id  TEXT NOT NULL,
  receipt     TEXT NOT NULL,
  type        TEXT NOT NULL,
  service_id  TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL,
  subtitle    TEXT NOT NULL DEFAULT '',
  amount      INTEGER NOT NULL,
  fee         INTEGER NOT NULL DEFAULT 0,
  cashback    INTEGER NOT NULL DEFAULT 0,
  account     TEXT NOT NULL DEFAULT '',
  card_id     TEXT,
  card_label  TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'success',
  category    TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_cards_profile ON cards(profile_id);
CREATE INDEX IF NOT EXISTS idx_saved_profile ON saved_payments(profile_id);
CREATE INDEX IF NOT EXISTS idx_transactions_profile_created ON transactions(profile_id, created_at);
