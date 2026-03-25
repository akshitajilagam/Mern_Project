function Login() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2>Digital Notes Manager Login</h2>

        <input
          type="email"
          placeholder="Enter your email"
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter your password"
          style={styles.input}
        />

        <button style={styles.button}>Login</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    gap: "15px",
    padding: "30px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;
