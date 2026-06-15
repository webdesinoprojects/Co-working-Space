"use client";

import { createContext, useContext, type ReactNode } from "react";

export type WorkspaceNavItem = {
  slug: string;
  nav_label: string;
};

const WorkspaceNavContext = createContext<WorkspaceNavItem[] | null>(null);

export function WorkspaceNavProvider({
  items,
  children,
}: {
  items: WorkspaceNavItem[];
  children: ReactNode;
}) {
  return (
    <WorkspaceNavContext.Provider value={items}>
      {children}
    </WorkspaceNavContext.Provider>
  );
}

export function useWorkspaceNavItems() {
  return useContext(WorkspaceNavContext);
}
