import { useEffect, useState, useRef, useMemo } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ManageContent.css";
import { useNavigate } from "react-router-dom";
import ImageResize from "quill-image-resize-module-react";
import Quill from "quill";

Quill.register("modules/imageResize", ImageResize);

function ManageContent() {
  const quillRef = useRef(null);
  const navigate = useNavigate();

  // ✅ IMAGE HANDLER (MUST BE BEFORE useMemo)
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
        if (!quill) return;

        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", imageUrl);
        quill.setSelection(range.index + 1);
      } catch (err) {
        console.error("Image upload failed", err);
        toast.error("Image upload failed");
      }
    };
  };

  // ✅ STABLE MODULES (useMemo FIX)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ color: [] }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"]
      ],
      handlers: {
        image: imageHandler
      }
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"]
    }
  }), []);

  // ✅ STATES
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);

  const [selectedCat, setSelectedCat] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [title, setTitle] = useState("");
  const [fullContent, setFullContent] = useState("");

  const [images, setImages] = useState([]);
  const [adImage, setAdImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  // ✅ LOAD CATEGORIES
  useEffect(() => {
    api.get("/api/categories").then((res) => {
      if (res.data.status) setCategories(res.data.categories);
    });
  }, []);

  // ✅ LOAD TOPICS
  useEffect(() => {
    if (!selectedCat) return;
    api.get(`/api/topics/${selectedCat}`).then((res) => {
      if (res.data.status) setTopics(res.data.topics);
    });
  }, [selectedCat]);

  // ✅ LOAD SUBTOPICS
  useEffect(() => {
    if (!selectedTopic) return;
    api.get(`/api/subtopics/${selectedTopic}`).then((res) => {
      if (res.data.status) setSubtopics(res.data.subtopics);
    });
  }, [selectedTopic]);

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSub) return toast.error("Select a Subtopic");
    if (!title.trim()) return toast.error("Title is required");
    if (!fullContent.trim()) return toast.error("Content is empty");

    try {
      const fd = new FormData();
      fd.append("subtopicId", selectedSub);
      fd.append("title", title);
      fd.append("fullContent", fullContent);

      images.forEach((img) => fd.append("images", img));
      if (adImage) fd.append("adImage", adImage);
      if (videoUrl) fd.append("videoUrl", videoUrl);

      const res = await api.post("/api/content/add", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.status) {
        toast.success("Content Added Successfully!");
        navigate("/admin");
        setTitle("");
        setFullContent("");
        setImages([]);
        setAdImage(null);
        setVideoUrl("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add content");
    }
  };

  return (
    <div className="admin-page">
      <h2>Add New Content</h2>

      <select
        className="admin-select"
        value={selectedCat}
        onChange={(e) => setSelectedCat(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {selectedCat && (
        <select
          className="admin-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">Select Topic</option>
          {topics.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      )}

      {selectedTopic && (
        <select
          className="admin-select"
          value={selectedSub}
          onChange={(e) => setSelectedSub(e.target.value)}
        >
          <option value="">Select Subtopic</option>
          {subtopics.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {selectedSub && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Content Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <ReactQuill
            ref={quillRef}
            value={fullContent}
            onChange={setFullContent}
            theme="snow"
            modules={modules}
            style={{ height: "300px", marginBottom: "80px" }}
          />

          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            accept="image/*"
          />

          {images.length > 0 && (
            <div className="preview-box">
              {images.map((img, idx) => (
                <div key={idx} className="preview-item">
                  <img src={URL.createObjectURL(img)} alt="preview" />
                  <button
                    className="remove-btn"
                    type="button"
                    onClick={() => {
                      const arr = [...images];
                      arr.splice(idx, 1);
                      setImages(arr);
                    }}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="YouTube Video Link (not iframe)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          {videoUrl && (
            <div className="preview-item">
              <iframe
                width="300"
                height="180"
                src={videoUrl.replace("youtu.be/", "youtube.com/embed/")}
              ></iframe>
              <button
                type="button"
                className="remove-btn"
                onClick={() => setVideoUrl("")}
              >
                ✖
              </button>
            </div>
          )}

          <label>Upload Ad Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAdImage(e.target.files[0])}
          />

          {adImage && (
            <div className="preview-item">
              <img src={URL.createObjectURL(adImage)} alt="Ad" />
              <button
                type="button"
                className="remove-btn"
                onClick={() => setAdImage(null)}
              >
                ✖
              </button>
            </div>
          )}

          <button type="submit" className="admin-btn">
            Add Content
          </button>
        </form>
      )}
    </div>
  );
}

export default ManageContent;
