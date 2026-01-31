import { useMemo, useState } from "react";

import TodoPage from "./pages/TodoPage";
import FormPage from "./pages/FormPage";
import ProgressPage from "./pages/ProgressPage";
import TimerPage from "./pages/TimerPage";
import SearchPage from "./pages/SearchPage";

const TABS = [
  { key: "todo", label: "Todo", component: TodoPage },
  { key: "form", label: "Form", component: FormPage },
  { key: "progress", label: "Progress", component: ProgressPage },
  { key: "timer", label: "Timer", component: TimerPage },
  { key: "search", label: "Search", component: SearchPage },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("todo");

  const ActiveComponent = useMemo(() => {
    return TABS.find((t) => t.key === activeTab)?.component ?? TodoPage;
  }, [activeTab]);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>React Intern Assignment</h1>
          <p style={styles.subtitle}>
            Tasks 1–5 implemented as separate tabs
          </p>
        </div>

        <nav style={styles.nav}>
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...styles.tabButton,
                  ...(isActive ? styles.tabButtonActive : {}),
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <ActiveComponent />
        </div>
      </main>

      <footer style={styles.footer}>
        <span>Built with React + Vite</span>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "#e8eefc",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  header: {
    padding: "20px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  title: { margin: 0, fontSize: 20, letterSpacing: 0.2 },
  subtitle: { margin: "6px 0 0", opacity: 0.8, fontSize: 13 },
  nav: { display: "flex", gap: 10, flexWrap: "wrap" },
  tabButton: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e8eefc",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    transition: "transform 0.06s ease",
  },
  tabButtonActive: {
    background: "rgba(99, 102, 241, 0.25)", // indigo-ish
    borderColor: "rgba(99, 102, 241, 0.55)",
  },
  main: {
    padding: 18,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "min(980px, 100%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  footer: {
    padding: 14,
    opacity: 0.7,
    fontSize: 12,
    textAlign: "center",
  },
};
