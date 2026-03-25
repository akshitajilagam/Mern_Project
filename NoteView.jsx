import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function NoteView() {
  const { id } = useParams();
  console.log("NOTE VIEW ID =", id);
  const navigate = useNavigate();

  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/notes/${id}`
        );

        const data = await res.json();
        setNote(data);
      } catch (err) {
        console.log("Failed to load note", err);
      }
    };

    fetchNote();
  }, [id]);

  if (!note) return <p style={{ padding: 40 }}>Loading...</p>;
  console.log("NOTE DATA =", note);
  return (
    <div style={styles.container}>
      <button
        style={styles.backBtn}
        onClick={() => navigate("/dashboard")}
      >
        ← Back
      </button>

      <h1 style={styles.title}>{note.title}</h1>

      <div
        style={{
          ...styles.content,
          backgroundColor: note.color || "white",
        }}
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 80px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  backBtn: {
    marginBottom: "20px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  title: {
    marginBottom: "20px",
  },
  content: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },
};

export default NoteView;
