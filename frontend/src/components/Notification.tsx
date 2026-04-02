// src/components/Notification.tsx
import { useEffect } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Notification({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return <div className={`notification ${type} show`}>{message}</div>;
}