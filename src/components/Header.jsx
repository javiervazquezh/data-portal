import React from "react";
import { cls } from "../helpers";
import { HiPlus, HiDatabase } from "react-icons/hi";

export default function Header({ onCreate }) {
  return (
    <header className={`w-full ${cls.header} backdrop-blur supports-[backdrop-filter]:bg-white/5 shadow-lg border-b border-white/10`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold shadow-lg border border-white/20 backdrop-blur-sm">
            <HiDatabase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              TD Streaming Data Portal
            </h1>
            <p className="text-xs text-white/80 mt-0.5">
              Manage and discover your data products
            </p>
          </div>
        </div>
        <button
          onClick={onCreate}
          className={`px-5 py-2.5 rounded-xl ${cls.primaryBtn} hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center gap-2 font-medium`}
        >
          <HiPlus className="w-4 h-4" />
          Create Data Product
        </button>
      </div>
    </header>
  );
}
