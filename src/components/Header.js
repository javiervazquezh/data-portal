import React from "react";
import { cls } from "../helpers";

export default function Header({ onCreate }) {
  return (
    <header className={`w-full ${cls.header}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold">TD</div>
          <div>
            <h1 className="text-lg font-semibold">TD Streaming Data Portal</h1>
            <p className="text-white/80 text-sm">Demo • In-memory • No auth</p>
          </div>
        </div>
        <button onClick={onCreate} className={`px-4 py-2 rounded-xl ${cls.primaryBtn}`}>
          Create Data Product
        </button>
      </div>
    </header>
  );
}