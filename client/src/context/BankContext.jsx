import { useEffect, useRef, useState } from "react";
import { BankContext } from "./bank-context";
import { createSeed, userProfile } from "../data/catalog";
import { applyAddCard, applyFreeze, applyMerchant, applyPay, applyPrimary, applyRemoveCard, applyTopUp, applyTransfer } from "../state/ops";
import { makeId, makeReceipt } from "../utils/format";

export function BankProvider({ children }) {
  const [state, setState] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [toast, setToast] = useState(null);
  const hydrated = useRef(false);
  const saveChain = useRef(Promise.resolve());

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/bank", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "База недоступна");
        if (!active) return;
        hydrated.current = false;
        setState(data);
        setError("");
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "База недоступна");
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(() => {
    if (!state) return undefined;
    if (!hydrated.current) {
      hydrated.current = true;
      return undefined;
    }
    const snapshot = snapshotBank(state);
    saveChain.current = saveChain.current.then(async () => {
      const response = await fetch("/api/bank", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Не удалось записать в базу");
      }
    }).catch((saveError) => {
      setToast({ id: Date.now(), message: saveError.message || "Не удалось записать в базу", tone: "bad" });
    });
    return undefined;
  }, [state]);

  const theme = !state ? "light" : state.themeMode === "system" ? (systemDark ? "dark" : "light") : state.themeMode;

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

  if (error) {
    return (
      <div className="boot">
        <div>
          <h1>Hamyon</h1>
          <p className="error">{error}</p>
          <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setError(""); setAttempt((value) => value + 1); }}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="boot">
        <div>
          <h1>Hamyon</h1>
          <p className="muted">Загружаем счета из базы…</p>
        </div>
      </div>
    );
  }

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

function snapshotBank(state) {
  return {
    themeMode: state.themeMode,
    balanceHidden: state.balanceHidden,
    cards: state.cards,
    saved: state.saved,
    transactions: state.transactions,
  };
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
