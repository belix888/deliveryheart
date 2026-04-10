"use client";

import React from "react";
import { FileText } from "lucide-react";

const LogsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Логи системы</h1>
      <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-12 text-center opacity-60">
        <FileText className="w-12 h-12 mx-auto mb-4" />
        <p>Логи будут доступны после настройки</p>
      </div>
    </div>
  );
};

export default LogsPage;