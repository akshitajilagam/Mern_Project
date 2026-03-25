import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AuthModal({ isOpen, onClose, type }) {
  const navigate = useNavigate();

  const [agree, setAgree] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  /* ---------- CLEAR FORM ---------- */
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAgree(false);
  };

  /* ---------- SUBMIT HANDLER ---------- */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      /* ===== SIGNUP ===== */
if (type === "signup") {
  if (!agree) {
    alert("Please agree to Terms & Conditions");
    setLoading(false);
    return;
  }

  const res = await fetch(
    "http://localhost:5000/api/auth/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    setLoading(false);
    return;
  }

  alert("Account created ✅ Please login");

  resetForm();
  onClose();
  return; // ⭐ important
}

      /* ===== LOGIN ===== */
      if (type === "login") {
        const res = await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          setLoading(false);
          return;
        }

        // ✅ store auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful ✅");
      }

      /* ✅ RESET + NAVIGATE */
      resetForm();
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>

        <h2 style={styles.logo}>Digital Notes Manager</h2>

        <h3 style={styles.heading}>
          {type === "login"
            ? "Welcome back 👋"
            : "Create your account"}
        </h3>

        {type === "signup" && (
          <input
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {type === "login" && (
          <p style={styles.forgot}>Forgot Password?</p>
        )}

        {type === "signup" && (
          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />

            I agree to the{" "}
            <span
   
   style={{ color: "#4f46e5", cursor: "pointer", fontWeight: 500 }}
              onClick={() => alert("Terms page coming soon")}
            >
              Terms & Conditions
            </span>
          </label>
        )}

        <button
          style={styles.primaryBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : type === "login"
            ? "Login"
            : "Create Account"}
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15,23,42,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "420px",
    padding: "40px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "relative",
  },

  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "16px",
    border: "none",
    background: "none",
    fontSize: "22px",
    cursor: "pointer",
  },

  logo: {
    textAlign: "center",
    color: "#4f46e5",
  },

  heading: {
    textAlign: "center",
    color: "#1e293b",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
  },

  forgot: {
    fontSize: "13px",
    color: "#4f46e5",
    textAlign: "right",
    cursor: "pointer",
  },

  checkboxRow: {
    fontSize: "14px",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  primaryBtn: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AuthModal;
