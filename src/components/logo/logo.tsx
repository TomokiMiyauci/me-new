import type { JSX } from "react";

export default function Logo(): JSX.Element {
  return (
    <span className="inline-flex items-center gap-2">
      <img width={32} height={32} src="/logo.svg" alt="logo" />

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
