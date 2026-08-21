"use client";

import React from "react";
import { Breadcrumbs } from "./breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, badge, actions, children }: PageHeaderProps) {
  return (
    <div className="mb-6 space-y-2">
      <Breadcrumbs />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-[#172033] tracking-tight">{title}</h1>
            {badge}
          </div>
          {description && <p className="text-xs md:text-sm text-[#78849A] mt-1 leading-relaxed">{description}</p>}
        </div>

        {actions && <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>}
      </div>

      {children}
    </div>
  );
}
