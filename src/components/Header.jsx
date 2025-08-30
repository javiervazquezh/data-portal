import React from "react";
import { cls } from "../helpers";

export default function Header({ onCreate }) {
  return (
    <header className={`w-full ${cls.header} backdrop-blur supports-[backdrop-filter]:bg-white/5`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold shadow-sm">
            TD
          </div>
          <h1 className="text-[15px] sm:text-base font-semibold tracking-tight">
            TD Streaming Data Portal
          </h1>
        </div>
        <button
          onClick={onCreate}
          className={`px-4 py-2 rounded-xl ${cls.primaryBtn} hover:shadow-md active:scale-[0.99]`}
        >
          Create Data Product
        </button>
      </div>
    </header>
  );
}
