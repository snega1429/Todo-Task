import  { useState } from "react";
import API from "../api/api";
import type { TodoCreate } from "../Types";
import '../App.css';

  
type CreateTodoProps = {
  onCreateTodoSuccess: () => void;
}

export default function CreateTodo({ onCreateTodoSuccess } : CreateTodoProps) {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTodo: TodoCreate = {
      title,
      category,
      due_date: dueDate,
      owner_id: 1, //number
  
    };
      
    try {
      const res = await API.post("/todos", newTodo); 
      console.log(res.data);

      setMessage("Todo created successfully");
      onCreateTodoSuccess();

      setTitle("");
      setCategory("");
      setDueDate("");

    } catch (error: any) {
  if (error.response) {
    setMessage(error.response.data.detail || "Error creating todo ❌");
  } else {
    setMessage("Server error ❌");
  }
}
  };

  return (
    <div>
      <h2>Create Todo</h2>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <br />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <br />
        <button type="submit" disabled={!title || !category || !dueDate}>
          Create Todo
        </button>

      </form>
      {message && <p>{message}</p>}
    </div>
  );
}