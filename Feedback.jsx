import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Feedback() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Please enter feedback");
      return;
    }

    alert("Thank you for your feedback ❤️");
    setMessage("");
  };

  return (
    <div style={styles.container}>
        <div style={styles.card}>
      <button
        style={styles.backBtn}
        onClick={() => navigate("/dashboard")}
      >
        ← Back
      </button>

      <h1 style={styles.title}>Feedback</h1>

      <p style={styles.subtitle}>
        Help us improve NotesFlow by sharing your thoughts.
      </p>

      <textarea
        style={styles.textarea}
        placeholder="Write your feedback here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button style={styles.submitBtn} onClick={handleSubmit}>
        Submit Feedback
      </button>

    </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#e0e7ff,#ede9fe,#cffafe)",
    padding: "40px 80px",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#e2e8f0",
  },

  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  subtitle: {
    marginBottom: "25px",
    color: "#64748b",
  },

  textarea: {
    width: "100%",
    height: "180px",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    resize: "none",
    marginBottom: "20px",
  },

  submitBtn: {
    padding: "10px 18px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  card: {
  maxWidth: "700px",
  background: "white",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
 },
 
};

export default Feedback;
