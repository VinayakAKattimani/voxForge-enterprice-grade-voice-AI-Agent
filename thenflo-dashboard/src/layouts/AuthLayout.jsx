import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-signal to-pulse">
            <span className="font-data text-sm font-extrabold text-[#04141B]">TF</span>
          </div>
          <div className="text-lg font-bold text-ink">ThenFLo</div>
          <div className="text-[12.5px] text-ink3">AI Demo Engineer</div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
