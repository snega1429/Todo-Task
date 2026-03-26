import { useEffect, useState } from "react";
import API from "../api/api";

interface Todo {
  id: number;
  title: string;
  category: string;
  due_date: string;
  completed?: boolean;
}

export default function TodoList({ refresh }: { refresh: boolean }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  
  useEffect(() => {
    fetchTodos();
  }, [refresh]);

  
  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  
  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN");
  };

  
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/todos/${id}`);
      fetchTodos();
    } catch {
      console.log("Delete failed");
    }
  };

  
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditCategory(todo.category);
    setEditDueDate(
      todo.due_date ? todo.due_date.split("T")[0] : ""
    );
  };

  const saveEdit = async (id: number) => {
    try {
      await API.put(`/todos/${id}`, {
        title: editTitle,
        category: editCategory,
        due_date: editDueDate,
        owner_id: 1,
      });

      setEditingId(null);
      fetchTodos();
    } catch {
      console.log("Update failed");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h2>Todo List</h2>

      {todos.length === 0 && <p>No todos found</p>}

      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            marginBottom: "10px",
            border: "1px solid #e26464",
            padding: "10px",
          }}
        >
          {editingId === todo.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />

              <input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Category"
              />

              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />

              <button
                onClick={() => saveEdit(todo.id)}
                style={{ color: "green", marginLeft: "10px" }}
              >
                Save
              </button>

              <button
                onClick={cancelEdit}
                style={{ color: "gray", marginLeft: "10px" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <strong>{todo.title}</strong> | {todo.category} —{" "}
              {formatDate(todo.due_date)}

              <button
                onClick={() => handleDelete(todo.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>

              <button
                onClick={() => startEditing(todo)}
                style={{ marginLeft: "10px", color: "green" }}
              >
                Update
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}