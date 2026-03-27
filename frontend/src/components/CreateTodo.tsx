import { useState } from "react";
import API from "../api/api";
import type { TodoCreate } from "../types/Types";

type CreateTodoProps = { 
  onCreateTodoSuccess: () => void 
};

export default function CreateTodo({ onCreateTodoSuccess }: CreateTodoProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo = { title, category, due_date: dueDate};
    try {
      await API.post("/todos", newTodo);
      setMessage("Todo created successfully");
      onCreateTodoSuccess();
      setTitle(""); 
      setCategory(""); 
      setDueDate("");
    } catch (error: any) {
        const err = error.response?.data?.detail;

        if (Array.isArray(err)) {
          setMessage(err[0].msg);
        } else if (typeof err === "string") {
          setMessage(err);
        } else {
          setMessage("Error creating todo");
        }
      }
};

  return (
    <div>
      <h2>Create Todo</h2>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        <button type="submit">Create Todo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}