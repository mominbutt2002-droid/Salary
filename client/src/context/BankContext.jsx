import { useEffect, useState } from "react";
import { BankContext } from "./bank-context";
import { STORAGE_KEY, createSeed, userProfile } from "../data/catalog";
import { applyAddCard, applyFreeze, applyMerchant, applyPay, applyPrimary, applyRemoveCard, applyTopUp, applyTransfer } from "../state/ops";
import { makeId, makeReceipt } from "../utils/format";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeed();
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.cards) || data.cards.length === 0) return createSeed();
    return {
      ...createSeed(),
      ...data,
      cards: data.cards,
      transactions: Array.isArray(data.transactions) ? data.transactions : [],
      saved: Array.isArray(data.saved) ? data.saved : [],
    };
  } catch {
    return createSeed();
  }
}

export function BankProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const theme = state.themeMode === "system" ? (systemDark ? "dark" : "light") : state.themeMode;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#10130f" : "#efe8dc",
    );
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (message, tone = "ok") => setToast({ id: Date.now(), message, tone });

  const stamp = () => ({
    id: makeId("tx"),
    receipt: makeReceipt(),
    createdAt: new Date().toISOString(),
  });

  const value = {
    user: userProfile,
    cards: state.cards,
    transactions: state.transactions,
    saved: state.saved,
    theme,
    themeMode: state.themeMode,
    balanceHidden: state.balanceHidden,
    totalBalance: state.cards.reduce((sum, card) => sum + card.balance, 0),
    setThemeMode: (themeMode) => setState((prev) => ({ ...prev, themeMode })),
    toggleTheme: () =>
      setState((prev) => ({
        ...prev,
        themeMode: theme === "dark" ? "light" : "dark",
      })),
    toggleBalance: () => setState((prev) => ({ ...prev, balanceHidden: !prev.balanceHidden })),
    pay: (input) => applyNow(setState, applyPay, { ...stamp(), ...input }),
    transfer: (input) => applyNow(setState, applyTransfer, { ...stamp(), ...input }),
    payMerchant: (input) => applyNow(setState, applyMerchant, { ...stamp(), ...input }),
    topUp: (input) => applyNow(setState, applyTopUp, { ...stamp(), ...input }),
    addCard: (input) => applyNow(setState, applyAddCard, { ...input, id: makeId("card") }),
    removeCard: (cardId) => applyNow(setState, applyRemoveCard, cardId),
    toggleFreeze: (cardId) => setState((prev) => applyFreeze(prev, cardId)),
    setPrimary: (cardId) => setState((prev) => applyPrimary(prev, cardId)),
    resetDemo: () =>
      setState((prev) => ({
        ...createSeed(),
        themeMode: prev.themeMode,
      })),
    notify,
  };

  return (
    <BankContext.Provider value={value}>
      {children}
      {toast ? (
        <div className={`toast toast--${toast.tone}`} role="status">
          {toast.message}
        </div>
      ) : null}
    </BankContext.Provider>
  );
}

function applyNow(setState, recipe, draft) {
  let result = { ok: false, error: "Не удалось выполнить операцию" };
  setState((prev) => {
    const applied = recipe(prev, draft);
    result = applied.result;
    return applied.result.ok ? applied.state : prev;
  });
  return result;
}
