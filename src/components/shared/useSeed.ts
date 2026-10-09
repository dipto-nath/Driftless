import { useContext } from "react";
import { SeedContext } from "./SeedContext";

export function useSeed() {
  const context = useContext(SeedContext);
  if (!context) {
    throw new Error("useSeed must be used within a SeedProvider");
  }
  return context;
}
