import TodoApp from "../components/Todo/TodoApp";

export default function TodoPage() {
  return (
    <div>
      <h2>Task 1: Todo App</h2>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Core features: add, list, delete, mark complete.
      </p>

      <div style={{ marginTop: 16 }}>
        <TodoApp />
      </div>
    </div>
  );
}
