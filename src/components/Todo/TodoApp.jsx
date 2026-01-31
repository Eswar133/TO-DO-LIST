import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "react_intern_assignment_tasks_v1";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const [filter, setFilter] = useState("all");
  const [sortByPriority, setSortByPriority] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const remainingCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const visibleTasks = useMemo(() => {
    if (!sortByPriority) return filteredTasks;

    // high > medium > low, then newest first
    const rank = { high: 3, medium: 2, low: 1 };
    return [...filteredTasks].sort((a, b) => {
      const pr = (rank[b.priority] ?? 0) - (rank[a.priority] ?? 0);
      if (pr !== 0) return pr;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
  }, [filteredTasks, sortByPriority]);

  function handleAddTask(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
    setPriority("medium");
  }

  function handleToggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleClearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div>
          <h3 style={styles.heading}>Todo</h3>
          <p style={styles.subtext}>
            {tasks.length === 0
              ? "No tasks yet. Add your first one!"
              : `${remainingCount} remaining out of ${tasks.length}`}
          </p>
        </div>

        <div style={styles.headerRight}>
          <label style={styles.sortToggle}>
            <input
              type="checkbox"
              checked={sortByPriority}
              onChange={(e) => setSortByPriority(e.target.checked)}
            />
            <span>Sort by priority</span>
          </label>

          <button
            onClick={handleClearCompleted}
            style={styles.secondaryBtn}
            disabled={tasks.every((t) => !t.completed)}
            title="Remove all completed tasks"
          >
            Clear completed
          </button>
        </div>
      </header>

      <form onSubmit={handleAddTask} style={styles.form}>
        <input
          type="text"
          placeholder="Add a task (e.g., Finish assignment)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              Priority: {p.label}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.primaryBtn}>
          Add
        </button>
      </form>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <span style={styles.filtersLabel}>Filter:</span>
        <div style={styles.filters}>
          {FILTERS.map((f) => {
            const isActive = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                style={{
                  ...styles.filterBtn,
                  ...(isActive ? styles.filterBtnActive : {}),
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <ul style={styles.list}>
        {visibleTasks.map((task) => (
          <li key={task.id} style={styles.item}>
            <label style={styles.left}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
                style={styles.checkbox}
              />
              <span
                style={{
                  ...styles.title,
                  ...(task.completed ? styles.titleCompleted : {}),
                }}
              >
                {task.title}
              </span>
            </label>

            <div style={styles.right}>
              <span style={{ ...styles.badge, ...getPriorityBadge(task.priority) }}>
                {task.priority.toUpperCase()}
              </span>

              <button
                onClick={() => handleDelete(task.id)}
                style={styles.dangerBtn}
                aria-label={`Delete ${task.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {visibleTasks.length === 0 && (
        <div style={styles.emptyState}>
          {filter === "all" ? "No tasks yet." : "No tasks for this filter."}
        </div>
      )}

      <div style={styles.note}>
        ✅ Saved to localStorage. Refresh the page — tasks should remain.
      </div>
    </div>
  );
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // basic validation
    return parsed
      .filter((t) => t && typeof t.id === "string" && typeof t.title === "string")
      .map((t) => ({
        id: t.id,
        title: t.title,
        completed: Boolean(t.completed),
        priority: ["low", "medium", "high"].includes(t.priority) ? t.priority : "medium",
        createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
      }));
  } catch {
    return [];
  }
}

function getPriorityBadge(priority) {
  if (priority === "high")
    return {
      background: "rgba(239, 68, 68, 0.18)",
      borderColor: "rgba(239, 68, 68, 0.45)",
    };
  if (priority === "low")
    return {
      background: "rgba(34, 197, 94, 0.18)",
      borderColor: "rgba(34, 197, 94, 0.45)",
    };
  return {
    background: "rgba(245, 158, 11, 0.18)",
    borderColor: "rgba(245, 158, 11, 0.45)",
  };
}

const styles = {
  wrapper: { display: "grid", gap: 14 },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  heading: { margin: 0, fontSize: 18 },
  subtext: { margin: "6px 0 0", opacity: 0.85, fontSize: 13 },

  headerRight: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  sortToggle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, opacity: 0.9 },

  form: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 10,
  },
  input: {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    outline: "none",
  },
  select: {
    padding: "12px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    outline: "none",
    cursor: "pointer",
  },

  filtersRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  filtersLabel: { fontSize: 13, opacity: 0.85 },
  filters: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterBtn: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
    fontSize: 13,
  },
  filterBtnActive: {
    background: "rgba(99, 102, 241, 0.25)",
    borderColor: "rgba(99, 102, 241, 0.55)",
  },

  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: 10,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },
  left: { display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 },
  checkbox: { width: 16, height: 16, cursor: "pointer" },
  title: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  titleCompleted: { textDecoration: "line-through", opacity: 0.65 },

  right: { display: "flex", alignItems: "center", gap: 10 },
  badge: {
    fontSize: 11,
    padding: "6px 8px",
    borderRadius: 999,
    border: "1px solid",
    letterSpacing: 0.3,
  },

  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(99, 102, 241, 0.55)",
    background: "rgba(99, 102, 241, 0.25)",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
  },

  emptyState: { opacity: 0.75, fontSize: 13, padding: "6px 2px" },
  note: { opacity: 0.8, fontSize: 12, paddingTop: 6 },
};
