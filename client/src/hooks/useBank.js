import { useContext } from "react";
import { BankContext } from "../context/bank-context";

export function useBank() {
  const context = useContext(BankContext);
  if (!context) throw new Error("useBank must be used within BankProvider");
  return context;
}
