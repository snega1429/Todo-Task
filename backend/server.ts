import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Create the app
const app = express();
const PORT = 8000;

// Enable CORS for frontend running on port 5174
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(bodyParser.json());

// Temporary in-memory "database"
const users: { email: string; password: string }[] = [];

// Login route
app.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Signup route
app.post("/signup", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const exists = users.some((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ email, password });
  res.status(201).json({ message: "Signup successful" });
});

// Simple dashboard route (protected example)
app.get("/dashboard", (req: Request, res: Response) => {
  res.json({ message: "This is your dashboard" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});