import React from "react";
import { Button } from "@servicenow/react-components/Button";
import { Badge } from "@servicenow/react-components/Badge";
import "./Sidebar.css";

interface SidebarProps {
  currentView: string;
  navigateToView: (view: string, id?: string | null, opts?: { title?: string }) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home-fill" },
  { id: "scopes", label: "Scope Manager", icon: "tree-view-long-outline" },
  { id: "debugger", label: "Process Debugger", icon: "bug-outline" },
  { id: "specs", label: "Spec Generator", icon: "document-outline" },
  { id: "stacktrace", label: "Stack Trace", icon: "code-outline" },
  { id: "performance", label: "Performance", icon: "chart-line-outline" },
  { id: "ai-assistant", label: "AI Assistant", icon: "star-outline" },
  { id: "documentation", label: "Documentation", icon: "book-outline" },
];

export default function Sidebar({ currentView, navigateToView }: SidebarProps) {
  return (
    <aside className="sacc-sidebar">
      <div className="sacc-sidebar__header">
        <h1 className="sacc-sidebar__title">SACC</h1>
        <span className="sacc-sidebar__subtitle">Command Center</span>
      </div>
      <nav className="sacc-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`sacc-sidebar__item ${currentView === item.id ? "sacc-sidebar__item--active" : ""}`}
          >
            <Button
              label={item.label}
              icon={item.icon as any}
              variant={currentView === item.id ? "primary" : "tertiary"}
              size="md"
              onClicked={() => navigateToView(item.id, null, { title: `SACC - ${item.label}` })}
            />
          </div>
        ))}
      </nav>
      <div className="sacc-sidebar__footer">
        <Badge value={8} color="info" variant="primary" />
        <span className="sacc-sidebar__footer-text">Active Scopes</span>
      </div>
    </aside>
  );
}
