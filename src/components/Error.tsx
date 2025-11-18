"use client";

export default function E() {
  return (
    <button
      onClick={() => {
        throw Error("Error test");
      }}
    >
      Error
    </button>
  );
}
