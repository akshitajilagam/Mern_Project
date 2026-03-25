import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

/* ---------- FONT SETUP ---------- */

const Font = Quill.import("formats/font");

Font.whitelist = [
  "arial",
  "times",
  "georgia",
  "courier",
  "verdana",
  "tahoma",
  "trebuchet",
  "garamond",
  "roboto",
  "poppins",
];

Quill.register(Font, true);

/* ---------- SIZE SETUP ---------- */

const Size = Quill.import("formats/size");

Size.whitelist = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
];

Quill.register(Size, true);

/* ---------- CUSTOM ALIGN ICONS ---------- */

const icons = Quill.import("ui/icons");

icons["align-left"] = `
<svg viewBox="0 0 18 18">
  <line class="ql-stroke" x1="3" x2="15" y1="6" y2="6"></line>
  <line class="ql-stroke" x1="3" x2="12" y1="10" y2="10"></line>
  <line class="ql-stroke" x1="3" x2="9" y1="14" y2="14"></line>
</svg>`;

icons["align-center"] = `
<svg viewBox="0 0 18 18">
  <line class="ql-stroke" x1="3" x2="15" y1="6" y2="6"></line>
  <line class="ql-stroke" x1="5" x2="13" y1="10" y2="10"></line>
  <line class="ql-stroke" x1="7" x2="11" y1="14" y2="14"></line>
</svg>`;

icons["align-right"] = `
<svg viewBox="0 0 18 18">
  <line class="ql-stroke" x1="3" x2="15" y1="6" y2="6"></line>
  <line class="ql-stroke" x1="6" x2="15" y1="10" y2="10"></line>
  <line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"></line>
</svg>`;

/* ---------- EDITOR COMPONENT ---------- */

function Editor() {
  const navigate = useNavigate();
  const { id } = useParams();

console.log("PARAM ID =", id);
console.log("CURRENT URL =", window.location.pathname);

  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffff");
  

  /* ---------- LOAD NOTE WHEN EDITING ---------- */

  useEffect(() => {
  if (isNew) return;

  const fetchNote = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${id}`
      );

      const data = await res.json();

      setTitle(data.title);
      setContent(data.content);
      setColor(data.color || "#ffffff");
    } catch (err) {
      console.log("Failed to load note:", err);
    }
  };

  fetchNote();
}, [id, isNew]);

  /* ---------- TOOLBAR ---------- */

  const modules = {
    toolbar: {
      container: [
        [{ font: Font.whitelist }],
        [{ size: Size.whitelist }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        ["align-left", "align-center", "align-right"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ],
      handlers: {
        "align-left": function () {
          this.quill.format("align", "");
        },
        "align-center": function () {
          this.quill.format("align", "center");
        },
        "align-right": function () {
          this.quill.format("align", "right");
        },
      },
    },
    keyboard: {
    bindings: {
      persistFormat: {
        key: 13, // ENTER key
        handler: function (range) {
          const formats = this.quill.getFormat(range.index - 1);
          setTimeout(() => {
            this.quill.formatLine(range.index + 1, 1, formats);
          }, 0);
          return true;
        },
      },
    },
  },
};
  

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "align",
    "list",
    "link",
    "image",
  ];

  /* ---------- SAVE NOTE (FIXED) ---------- */
  const handleSave = async () => {
    console.log("SAVE CLICKED");
    console.log("TITLE:", title);
    console.log("HANDLE SAVE STARTED");

  const plainText = content
    .replace(/<(.|\n)*?>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();

  if (!title.trim() || plainText.length === 0) {
    alert("Title and content cannot be empty");
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ CREATE NEW NOTE
    if (isNew) {
      const res = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id || user._id,
            title: title.trim(),
            content,
            color,
          }),
        }
      );

      const data = await res.json();
      console.log("NOTE CREATED:", data);
    }

    // ✅ UPDATE EXISTING NOTE
    else {
      const res = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content,
            color,
          }),
        }
      );

      const data = await res.json();
      console.log("NOTE UPDATED:", data);
    }

    navigate("/dashboard" , { replace: true });
  } catch (err) {
    console.log("Save failed:", err);
  }
};

  /* ---------- UI ---------- */

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <button style={styles.saveBtn} onClick={handleSave}>
          Save Note
        </button>
      </div>

      <input
        style={styles.titleInput}
        placeholder="Enter note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div style={styles.colorPicker}>
        <span>🎨 Note Color:</span>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={styles.colorInput}
        />
      </div>

      <div
        style={{
          ...styles.editorWrapper,
          backgroundColor: color,
        }}
      >
        <div style={styles.quillContainerFix}>
          <ReactQuill
            spellCheck={false}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            style={styles.quillEditor}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    padding: "30px 60px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  backBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#e2e8f0",
  },
  saveBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "bold",
  },
  titleInput: {
    width: "100%",
    padding: "14px",
    fontSize: "24px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  editorWrapper: {
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    padding: "10px",
  },
  quillEditor: {
  backgroundColor: "transparent",
},
quillContainerFix: {
  backgroundColor: "transparent",
},
  colorPicker: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    fontWeight: "500",
  },

  colorInput: {
    width: "40px",
    height: "40px",
    border: "none",
    cursor: "pointer",
    background: "none",
  },
};

export default Editor;
