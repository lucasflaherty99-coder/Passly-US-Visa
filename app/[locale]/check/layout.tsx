import type { ReactNode } from "react";
import { CheckProvider } from "./CheckContext";

export default function CheckLayout({ children }: { children: ReactNode }) {
  return <CheckProvider>{children}</CheckProvider>;
}
