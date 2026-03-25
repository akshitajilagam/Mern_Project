import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [trash, setTrash] = useState([]);
  const [activeSection, setActiveSection] = useState("notes");
  const [menuOpen, setMenuOpen] = useState(null);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark");
  const user = JSON.parse(localStorage.getItem("user"));
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /* ---------- LOAD NOTES ---------- */
useEffect(() => {
  const fetchNotes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const url =
        activeSection === "trash"
          ? `http://localhost:5000/api/notes/trash/all/${user.id}`
          : `http://localhost:5000/api/notes/user/${user.id}`;

      const res = await fetch(url);
      const data = await res.json();

      if (activeSection === "trash") {
        setTrash(data);
      } else {
        setNotes(data);
      }
    } catch (err) {
      console.log("Error fetching notes:", err);
    }
  };

  fetchNotes();
}, [location, activeSection]);

  useEffect(() => {
  const handleClickOutside = (event) => {

    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setMenuOpen(null);
    }

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

}, []);
useEffect(() => {
  localStorage.setItem(
    "theme",
    darkMode ? "dark" : "light"
  );
}, [darkMode]);

  /* ---------- ACTIONS ---------- */

  const moveToTrash = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await fetch(
      `http://localhost:5000/api/notes/${id}/trash`,
      { method: "PATCH" }
    );

    // ✅ reload notes from backend
    const res = await fetch(
      `http://localhost:5000/api/notes/user/${user.id}`
    );

    const data = await res.json();
    setNotes(data);

    setMenuOpen(null);
  } catch (err) {
    console.log("Trash failed:", err);
  }
};
  const restoreNote = async (id) => {
  try {
    await fetch(
      `http://localhost:5000/api/notes/${id}/restore`,
      {
        method: "PATCH",
      }
    );

    setTrash(trash.filter((note) => note._id !== id));
  } catch (err) {
    console.log("Restore failed:", err);
  }
};

  const deleteForever = async (id) => {
  try {
    await fetch(
      `http://localhost:5000/api/notes/${id}`,
      {
        method: "DELETE",
      }
    );

    setTrash(trash.filter((note) => note._id !== id));
  } catch (err) {
    console.log("Delete failed:", err);
  }
};

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString();
  };

  /* ---------- AUTO TEXT COLOR ---------- */
const getTextColor = (bgColor) => {
  if (!bgColor) return darkMode ? "white" : "black";

  const color = bgColor.replace("#", "");

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // light background → dark text
  return brightness > 150 ? "#0f172a" : "#ffffff";
};
  /* ---------- UI ---------- */

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
      }}
    >
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Digital Notes Manager</h2>

        <button
          style={styles.createBtn}
          onClick={() => navigate("/editor/new")}
        >
          + Create Note
        </button>

        <div
  style={{
    ...styles.sideItem,
    backgroundColor:
      activeSection === "notes" ? "#334155" : "transparent",
     }}
    onClick={() => setActiveSection("notes")}
>
  📝 Notes
  </div>

<div
  style={{
    ...styles.sideItem,
    backgroundColor:
      activeSection === "trash" ? "#334155" : "transparent",
  }}
  onClick={() => setActiveSection("trash")}
>
  🗑 Trash
</div>
<div style={styles.sideItem}
  onClick={() => alert("Favorites feature coming soon")}
>
  ⭐ Favorites
</div>

<div
  style={styles.sideItem}
  onClick={() => navigate("/feedback")}
>
  💬 Feedback
</div>

<div
  style={styles.sideItem}
  onClick={() => alert("Settings coming soon")}
>
  ⚙ Settings
</div>
      </div>

      {/* Main */}
        <div style={styles.main}>

    <div style={styles.topBar}>
  <div></div>

  <div style={styles.rightControls}>
    
    <div
      style={styles.themeToggle}
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀️" : "🌙"}
    </div>


    <div ref={profileRef} style={styles.profileWrapper}>
      <div
        style={styles.avatar}
        onClick={() => setProfileOpen(!profileOpen)}
      >
        👤
      </div>

      {/* ✅ STEP 3 — ADD HERE */}
    {profileOpen && (
      <div style={styles.profilePanel}>

        <div style={styles.profileTopSection}>
        <div style={styles.profileCenter}>
          <div style={styles.bigAvatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div style={styles.profileTitle}>
            {user?.name}
          </div>

          <div style={styles.profileEmail}>
            {user?.email}
          </div>
        </div>
      </div>

        <div style={styles.profileDivider}></div>

        <div
          style={styles.profileItem}
          onClick={() => alert("Feature coming soon")}
        >
          + Add another account
        </div>

        <div
          style={styles.profileItem}
          onClick={() => alert("Edit profile coming soon")}
        >
          ✏ Edit profile
        </div>

        <div style={styles.profileDivider}></div>

        <div
          style={styles.logoutBtn}
          onClick={(e) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/";
          }}
        >
          Logout
        </div>

      </div>
    )}
    </div>
    </div>
    
    </div>

    <h2
      style={{
        ...styles.heading,
        color: darkMode ? "#f1f5f9" : "#0f172a",
      }}
    >
      {activeSection === "notes" ? "📝 Your Notes" : "🗑 Trash"}
    </h2>

    {activeSection === "notes" && (
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />
    )}
        <div style={styles.grid}>
          {activeSection === "notes" && (
            notes.length === 0 ? (

              <div style={styles.emptyState}>
                <h2
                  style={{
                    fontSize: "30px",
                    marginBottom: "10px",
                    color: darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  ✨ Your workspace is empty
                </h2>

                <p
                  style={{
                    fontSize: "20px",
                    opacity: 0.8,
                    color: darkMode ? "#cbd5f5" : "#334155",
                  }}
                >
                  Start capturing your ideas, thoughts, or plans 🚀
                </p>

                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "20px",
                    opacity: 0.7,
                    color: darkMode ? "#cbd5f5" : "#475569",
                  }}
                >
                  Click <b>+ Create Note</b> to write your first note 📝
                </p>
              </div>

            ) : (

              notes
                .filter((note) => {
                  const query = search.toLowerCase();

                  return (
                    note.title.toLowerCase().includes(query) ||
                    note.content.toLowerCase().includes(query)
                  );
                })
                .map((note) => (
              <div
                key={note._id}
                style={{
                  ...styles.card,
                  backgroundColor: note.color || (darkMode ? "#1e293b" : "white"),
                  color: getTextColor(note.color),
                }}
              ref={menuOpen === note._id ? menuRef : null}
              >
                <div style={styles.cardTop}>
                  <h3>{note.title}</h3>

                  <div
                    style={styles.dots}
                    onClick={(e) => {
                      e.stopPropagation();

                      setMenuOpen(
                        menuOpen === note._id ? null : note._id
                      );
                    }}
                  >
                    ⋮
                  </div>

                  {menuOpen === note._id && (
                    <div  style={styles.dropdown}>
                      <div
                        style={styles.dropdownItem}
                        onClick={() =>
                          navigate(`/note/${note._id}`)
                        }
                      >
                        View
                      </div>

                      <div
                        style={styles.dropdownItem}
                        onClick={() =>
                          navigate(`/editor/${note._id}`)
                        }
                      >
                        Edit
                      </div>

                      <div
                        style={{
                          ...styles.dropdownItem,
                          color: "#ef4444",
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          setMenuOpen(null);        // ✅ close dropdown
                          setConfirmDeleteId(note._id); // ✅ open modal
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>

                <p style={styles.date}>
                  Created: {formatDate(note.createdAt)}
                </p>
              </div>
            ))
          )
        )}

          {activeSection === "trash" && (
            trash.length === 0 ? (

              <div style={styles.emptyState}>
                <h2
                  style={{
                    fontSize: "28px",
                    marginBottom: "10px",
                    color: darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  🗑 Trash is empty
                </h2>

                <p
                  style={{
                    fontSize: "18px",
                    opacity: 0.8,
                    color: darkMode ? "#cbd5f5" : "#475569",
                  }}
                >
                  Deleted notes will appear here.
                </p>
              </div>

            ) : (
            trash.map((note) => (
              <div key={note._id} style={styles.card}>
                <h3>{note.title}</h3>

                <button
                  style={styles.restoreBtn}
                  onClick={() => restoreNote(note._id)}
                >
                  Restore
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteForever(note._id)}
                >
                  Delete Forever
                </button>
              </div>
            ))
          )
        )}
        </div>
        </div>

        {/* ✅ DELETE CONFIRM MODAL */}
        {confirmDeleteId && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
              <h3>Delete this note?</h3>

              <p>This note will be moved to Trash.</p>

              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>

                <button
                  style={styles.confirmDeleteBtn}
                  onClick={() => {
                    moveToTrash(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
  width: "240px",
  backgroundColor: "#0b1220",
  color: "#c7d2fe",
  padding: "30px 20px",
},
  emptyState: {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "80px 20px",
  color: "#000000",
},
  logo: { marginBottom: "30px" },
  createBtn: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
  sideBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#334155",
    color: "white",
    cursor: "pointer",
  },
  main: { flex: 1, padding: "40px" },
  heading: {
  marginBottom: "30px",
  color: "#0f172a", // default (light mode)
},
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "25px",
  },
  card: {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  position: "relative",
  overflow: "visible", // ✅ ADD THIS
},
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dots: { cursor: "pointer" },
  dropdown: {
  position: "absolute",
  top: "40px",
  right: "20px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  zIndex: 9999, // ✅ ADD THIS
  
},
  dropdownItem: { padding: "10px 15px", cursor: "pointer" },
  date: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "10px",
  },
  restoreBtn: {
    marginTop: "10px",
    padding: "6px 10px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
  },
  deleteBtn: {
    marginTop: "10px",
    marginLeft: "10px",
    padding: "6px 10px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
  },
    search: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
    topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    cursor: "pointer",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    backgroundColor: "#e2e8f0",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  profileName: {
    fontSize: "14px",
    fontWeight: "500",
  },

    profilePanel: {
    position: "absolute",
    top: "60px",
    right: "0",
    width: "260px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    padding: "15px",
    zIndex: 10,
  },

  profileHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  profileDivider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "12px 0",
  },

  profileItem: {
    padding: "10px 16px",
    cursor: "pointer",
  },
  profileCenter: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
},

bigAvatar: {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  backgroundColor: "#01327c",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "10px",
  },

  profileTitle: {
    fontSize: "16px",
    fontWeight: "600",
  },

  profileEmail: {
    fontSize: "14px",
    color: "#64748b",
  },

  logoutBtn: {
    textAlign: "center",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#01327c",
    borderRadius: "8px",
    marginTop: "8px",
  },
    profileWrapper: {
    position: "relative",
  },
  profileTopSection: {
    backgroundColor: "#f1f5f9", // soft section background
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  themeToggle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  rightControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sideItem: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "0.2s",
    width: "100%",          // ✅ FIX
    boxSizing: "border-box" // ✅ FIX
  },
    modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalBox: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },

  cancelBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#e2e8f0",
    cursor: "pointer",
  },

  confirmDeleteBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};


export default Dashboard;
