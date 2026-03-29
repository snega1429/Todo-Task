import { useState } from "react";
import API from "../api/api"


export default function CreateTodo({ onCreateTodoSuccess }: any) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e: any) => {
    e.preventDefault();
    const newTodo = { title:title , category:category, due_date: dueDate};
    try {
      await API.post("/todos", newTodo);
      setMessage("Todo created successfully");
      onCreateTodoSuccess();
      setTitle(""); 
      setCategory(""); 
      setDueDate("");
    } catch (error: any) {
      setMessage("Error creating todos");
        console.log(error);

        if (Array.isArray(error)) {
          setMessage(error[0].msg);
        } else if (typeof error === "string") {
          setMessage(error);
        } else {
          setMessage("Error creating todo");
        }
      }
};

  return (
    <div className="todo-list" >
      <h3>Create Todo</h3>

      <form onSubmit={handleCreate}>
        
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

      <button type ="submit">Add Todo</button>
      </form>

      {message && <p>{message}</p>}
      </div>
  );
}



      