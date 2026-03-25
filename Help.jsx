function Help() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Help & Support</h1>

      <div style={styles.card}>
        <h3>How do I create a note?</h3>
        <p>
          Go to your Dashboard and click on "Create Note" from the sidebar.
        </p>
      </div>

      <div style={styles.card}>
        <h3>Can I customize note themes?</h3>
        <p>
          Yes. NotesFlow allows you to change background colors,
          themes, and text formatting.
        </p>
      </div>

      <div style={styles.card}>
        <h3>Is my data secure?</h3>
        <p>
          Yes. With authentication and secure storage,
          your notes remain private and protected.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "80px 60px",
    background: "linear-gradient(135deg, #e0e7ff, #ede9fe, #cffafe)",
  },

  title: {
    fontSize: "36px",
    marginBottom: "30px",
    color: "#0f172a",
  },

  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
};

export default Help;
