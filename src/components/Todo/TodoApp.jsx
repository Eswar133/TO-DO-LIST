import { useMemo, useState } from "react";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const remainingCount = useMemo(() => {
    return tasks.filter((t) => !t.completed).length;
  }, [tasks]);

  function handleAddTask(e) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      priority, // for Day 2 we’ll use it more
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

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h3 style={styles.heading}>Todo</h3>
        <p style={styles.subtext}>
          {tasks.length === 0
            ? "No tasks yet. Add your first one!"
            : `${remainingCount} remaining out of ${tasks.length}`}
        </p>
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

        <button type="submit" style={styles.addBtn}>
          Add
        </button>
      </form>

      <ul style={styles.list}>
        {tasks.map((task) => (
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
                style={styles.deleteBtn}
                aria-label={`Delete ${task.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <div style={styles.hint}>
          Tip: Use checkbox to mark as completed.
        </div>
      )}
    </div>
  );
}

function getPriorityBadge(priority) {
  if (priority === "high") return { background: "rgba(239, 68, 68, 0.18)", borderColor: "rgba(239, 68, 68, 0.45)" };
  if (priority === "low") return { background: "rgba(34, 197, 94, 0.18)", borderColor: "rgba(34, 197, 94, 0.45)" };
  return { background: "rgba(245, 158, 11, 0.18)", borderColor: "rgba(245, 158, 11, 0.45)" }; // medium
}

const styles = {
  wrapper: {
    display: "grid",
    gap: 14,
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  heading: { margin: 0, fontSize: 18 },
  subtext: { margin: 0, opacity: 0.85, fontSize: 13 },

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
  addBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(99, 102, 241, 0.55)",
    background: "rgba(99, 102, 241, 0.25)",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 600,
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
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    flex: 1,
  },
  checkbox: { width: 16, height: 16, cursor: "pointer" },
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  titleCompleted: { textDecoration: "line-through", opacity: 0.65 },

  right: { display: "flex", alignItems: "center", gap: 10 },
  badge: {
    fontSize: 11,
    padding: "6px 8px",
    borderRadius: 999,
    border: "1px solid",
    letterSpacing: 0.3,
  },
  deleteBtn: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
  },

  hint: {
    opacity: 0.75,
    fontSize: 12,
  },
};
