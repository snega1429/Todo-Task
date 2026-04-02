import { useState, useEffect } from "react";
import API from "../api/api";
import Logo from "../components/Logo";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [type, setType] = useState<
    "success" | "error" | "info" >("info");

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");

        setUsername(res.data.username);
        setEmail(res.data.email);

      } catch (err: any) {
        console.log(
          "PROFILE LOAD ERROR:",
          JSON.stringify(
            err.response?.data,
            null,
            2
          )
        );

        setMessage("Failed to load profile");
        setType("error");
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (username.trim().length < 3) {
      setMessage(
        "Username must be at least 3 characters"
      );
      setType("error");
      return;
    }

    try {
      await API.put("/profile", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
      });

      setMessage(
        "Profile updated successfully"
      );
      setType("success");

    } catch (err: any) {
      console.log(
        "PROFILE UPDATE ERROR:",
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );

      if (
        Array.isArray(
          err.response?.data?.detail
        )
      ) {
        setMessage(
          err.response?.data?.detail[0]?.msg
        );
      } else {
        setMessage(
          err.response?.data?.detail ||
          "Update failed"
        );
      }

      setType("error");
    }
  };

  return (
    <>
      <Logo size={115} />

      <div className="form-container">
        <h2>Profile</h2>

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <br />
          <br />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <br />
          <br />

          <button type="submit">
            Update Profile
          </button>

          {message && (
            <p
              style={{
                marginTop: "10px",
                color:
                  type === "success"
                    ? "green"
                    : "red",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}