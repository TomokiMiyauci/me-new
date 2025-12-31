import type { JSX } from "react";
import logo from "@/assets/logo.svg?url";

export default function Logo(): JSX.Element {
  return (
    <span className="inline-flex items-center gap-2">
      <img width={32} height={32} src={logo} alt="logo" />

      <span
        className="text-2xl"
        style={{
          fontFamily: `"Anton"`,
          color: "#535743",
        }}
      >
        Miyauchi
      </span>
    </span>
  );
}
