import { useEffect, useState } from "react";
import API from "../api/api";

export default function TodoList({ refresh }: any) {
  const [todos, setTodos] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTodos();
  }, [refresh]);

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.log("Error fetching todos", err);
    }
  };

  const handleDelete = async (id: number) => {
    await API.delete(`/todos/${id}`);
    fetchTodos();
  };

  const handleEdit = (todo: any) => {
    setEditId(todo.id);
    setTitle(todo.title);
    setCategory(todo.category);
    setDueDate(todo.due_date);
  };

  const handleUpdate = async (id: number) => {
    try {
      await API.put(`/todos/${id}`, {
        title: title,
        category: category,
        due_date: dueDate,
        completed: false
      });

      setEditId(null);
      fetchTodos();
    } catch (err) {
      console.log("Error updating todo", err);
    }
  };
return (
    <div className="card">

      <h3>Todo List</h3>

      {/* SCROLL CONTAINER */}
      <div className="todo-list">
        <div className="todo-text">
        </ div>
      </div>
        {todos.length === 0 ? (
          <p>No todos yet</p>
        ) : (
          todos.map((todo) => (

            <div key={todo.id} className="todo-item">

              {editId === todo.id ? (

                <div>

                  <input
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <input
                    id="category"
                    name="category"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />

                  <input
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />

                  <br /><br />

                  <button onClick={() => handleUpdate(todo.id)}>
                    Update
                  </button>

                  <button onClick={() => setEditId(null)}>
                    Cancel
                  </button>

                </div>

              ) : (

                <div>

                  <strong>{todo.title}</strong>
                  {" | "}
                  {todo.category}
                  {" | "}
                  {todo.due_date}

                  <br />

                  <button onClick={() => handleEdit(todo)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(todo.id)}>
                    Delete
                  </button>

                </div>

              )}

            </div>

          ))
        )}

      </div>
    );
}

  