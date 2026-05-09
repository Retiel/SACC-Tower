import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ScopeManager from "./components/ScopeManager";
import ProcessDebugger from "./components/ProcessDebugger";
import SpecGenerator from "./components/SpecGenerator";
import StackTrace from "./components/StackTrace";
import Performance from "./components/Performance";
import AIAssistant from "./components/AIAssistant";
import Documentation from "./components/Documentation";

interface ViewState {
  view: string;
  id: string | null;
}

function getViewFromUrl(): ViewState {
  const params = new URLSearchParams(window.location.search);
  return {
    view: params.get("view") || "dashboard",
    id: params.get("id") || null,
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(getViewFromUrl);

  useEffect(() => {
    const onPopState = () => setCurrentView(getViewFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateToView = useCallback(
    (viewName: string, id?: string | null, opts?: { title?: string }) => {
      const params = new URLSearchParams({ view: viewName });
      if (id) params.set("id", id);
      const relativePath = `${window.location.pathname}?${params}`;
      const pageTitle = opts?.title || `SACC - ${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`;

      if (window.self !== window.top) {
        (window as any).CustomEvent.fireTop("magellanNavigator.permalink.set", {
          relativePath,
          title: pageTitle,
        });
      }
      window.history.pushState({ viewName, id }, "", relativePath);
      document.title = pageTitle;
      setCurrentView({ view: viewName, id: id || null });
    },
    []
  );

  const renderView = () => {
    switch (currentView.view) {
      case "scopes":
        return <ScopeManager navigateToView={navigateToView} />;
      case "debugger":
        return <ProcessDebugger />;
      case "specs":
        return <SpecGenerator />;
      case "stacktrace":
        return <StackTrace />;
      case "performance":
        return <Performance />;
      case "ai-assistant":
        return <AIAssistant />;
      case "documentation":
        return <Documentation />;
      default:
        return <Dashboard navigateToView={navigateToView} />;
    }
  };

  return (
    <div className="sacc-layout">
      <Sidebar currentView={currentView.view} navigateToView={navigateToView} />
      <main className="sacc-main">{renderView()}</main>
    </div>
  );
}
