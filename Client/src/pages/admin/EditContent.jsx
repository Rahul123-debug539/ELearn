import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditContent.css";

import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

function EditContent() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    fullContent: "",
    videoUrl: "",
    images: [],
    adImage: ""
  });

  const [newImages, setNewImages] = useState([]);
  const [newAdImage, setNewAdImage] = useState(null);

  // ✅ LOAD EXISTING CONTENT
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const res = await api.get(`/api/content/single/${contentId}`);
      if (res.data.status) {
        const c = res.data.content;
        setForm({
          title: c.title,
          fullContent: c.fullContent,
          videoUrl: c.videoUrl,
          images: c.images || [],
          adImage: c.adImage || ""
        });
      }
    } catch (err) {
      toast.error("Failed to load content");
    }
  };

  // ✅ IMAGE REPLACE / INSERT HANDLER
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const data = new FormData();
      data.append("image", file);

      try {
        const res = await api.post("/api/upload/editor-image", data);
        const imageUrl = res.data.url;

        const quill = quillRef.current?.getEditor();
        const range = quill.getSelection(true);
        const [leaf] = quill.getLeaf(range.index);

        // ✅ IF CURSOR ON IMAGE → REPLACE
        if (leaf?.domNode?.tagName === "IMG") {
          leaf.domNode.src = imageUrl;
        }
        // ✅ ELSE INSERT NEW IMAGE
        else {
          quill.insertEmbed(range.index, "image", imageUrl);
        }

        quill.setSelection(range.index + 1);
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed");
      }
    };
  };

  // ✅ SAFE QUILL MODULES
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3,4,5,6, false] }],
        ["bold", "italic", "underline"],
        [{ color: [] }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
        [{ align: [] }],

      ],
      handlers: {
        image: imageHandler
      }
    },
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"]
    }
  }), []);

  // ✅ SAVE CHANGES
  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("fullContent", form.fullContent);
      fd.append("videoUrl", form.videoUrl);

      newImages.forEach((img) => fd.append("images", img));
      if (newAdImage) fd.append("adImage", newAdImage);

      const res = await api.put(`/api/content/update/${contentId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.status) {
        toast.success("Content Updated!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="admin-page">
      <h2>Edit Content</h2>

      {/* TITLE */}
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* FULL CONTENT (✅ IMAGE EDIT ENABLED) */}
      <ReactQuill
        ref={quillRef}
        value={form.fullContent}
        onChange={(v) => setForm({ ...form, fullContent: v })}
        theme="snow"
        modules={modules}
        style={{ height: "260px", marginBottom: "80px" }}
      />

      {/* EXISTING IMAGES */}
      <h4>Existing Images</h4>
      <div className="preview-box">
        {form.images?.map((img, i) => (
          <img key={i} src={img} className="preview-old" alt="old-img" />
        ))}
      </div>

      {/* ADD NEW IMAGES */}
      <label>Add New Images:</label>
      <input
        type="file"
        multiple
        onChange={(e) => setNewImages([...e.target.files])}
      />

      {newImages.length > 0 && (
        <div className="preview-box">
          {newImages.map((img, idx) => (
            <img key={idx} src={URL.createObjectURL(img)} className="preview-new" />
          ))}
        </div>
      )}

      {/* VIDEO URL */}
      <input
        type="text"
        placeholder="YouTube Video URL"
        value={form.videoUrl}
        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
      />

      {/* AD IMAGE */}
      <h4>Existing Ad Image</h4>
      {form.adImage && <img src={form.adImage} className="preview-old" />}

      <label>Upload New Ad Image:</label>
      <input type="file" onChange={(e) => setNewAdImage(e.target.files[0])} />

      {newAdImage && (
        <img src={URL.createObjectURL(newAdImage)} className="preview-new" />
      )}

      <button className="admin-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default EditContent;
