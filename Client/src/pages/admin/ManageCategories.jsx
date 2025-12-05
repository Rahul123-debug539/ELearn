import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import Prism from "prismjs";
// import "prismjs/themes/prism-tomorrow.css";

import "./ManageContent.css";

function ManageContent() {
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

  /* LOAD CATEGORIES */
  useEffect(() => {
    api.get("/categories").then((res) => {
      if (res.data.status) setCategories(res.data.categories);
    });
  }, []);

  /* LOAD TOPICS */
  useEffect(() => {
    if (!selectedCat) return;
    api.get(`/topics/${selectedCat}`).then((res) => {
      if (res.data.status) setTopics(res.data.topics);
    });
  }, [selectedCat]);

  /* LOAD SUBTOPICS */
  useEffect(() => {
    if (!selectedTopic) return;
    api.get(`/subtopics/${selectedTopic}`).then((res) => {
      if (res.data.status) setSubtopics(res.data.subtopics);
    });
  }, [selectedTopic]);

  /* SUBMIT CONTENT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSub) return toast.error("Select a Subtopic");
    if (!title.trim()) return toast.error("Title is required");
    if (!fullContent.trim()) return toast.error("Content cannot be empty");

    try {
      const fd = new FormData();

      fd.append("subtopicId", selectedSub);
      fd.append("title", title);
      fd.append("fullContent", fullContent);

      images.forEach((img) => fd.append("images", img));

      if (adImage) fd.append("adImage", adImage);

      if (videoUrl.trim()) fd.append("videoUrl", videoUrl.trim());

      const res = await api.post("/content/add", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.status) {
        toast.success("Content Added Successfully!");

        setTitle("");
        setFullContent("");
        setImages([]);
        setAdImage(null);
        setVideoUrl("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Add content error:", err);
      toast.error("Failed to add content");
    }
  };

  /* SAFE VIDEO PREVIEW */
  const getEmbedPreview = () => {
    if (!videoUrl) return "";

    const regExp = /(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/;
    const match = videoUrl.match(regExp);

    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  /* 🔥 ReactQuill with Syntax Highlighting */
  const quillModules = {
    syntax: {
      highlight: (text) =>
        Prism.highlight(text, Prism.languages.javascript, "javascript")
    },
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ color: [] }],
      ["blockquote", "code-block"], // CODE BLOCK RESTORED
      ["link", "image"],
      ["clean"]
    ]
  };

  return (
    <div className="admin-page">
      <h2>Add New Content</h2>

      {/* CATEGORY SELECT */}
      <select
        className="admin-select"
        value={selectedCat}
        onChange={(e) => {
          setSelectedCat(e.target.value);
          setSelectedTopic("");
          setSelectedSub("");
        }}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* TOPIC SELECT */}
      {selectedCat && (
        <select
          className="admin-select"
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setSelectedSub("");
          }}
        >
          <option value="">Select Topic</option>
          {topics.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      )}

      {/* SUBTOPIC SELECT */}
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

      {/* FORM START */}
      {selectedSub && (
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* TITLE */}
          <input
            type="text"
            placeholder="Content Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* ReactQuill Editor */}
          <ReactQuill
            value={fullContent}
            onChange={setFullContent}
            theme="snow"
            modules={quillModules}
            style={{ height: "300px", marginBottom: "80px" }}
          />

          {/* IMAGE UPLOAD */}
          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
          />

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="preview-box">
              {images.map((img, idx) => (
                <div key={idx} className="preview-item">
                  <img src={URL.createObjectURL(img)} alt="preview" />
                  <button
                    type="button"
                    className="remove-btn"
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

          {/* VIDEO URL */}
          <input
            type="text"
            placeholder="YouTube URL (NOT iframe)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          {/* VIDEO PREVIEW */}
          {getEmbedPreview() && (
            <div className="preview-item">
              <iframe
                width="300"
                height="180"
                src={getEmbedPreview()}
                allowFullScreen
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

          {/* AD IMAGE */}
          <label>Upload Ad Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAdImage(e.target.files[0])}
          />

          {/* AD PREVIEW */}
          {adImage && (
            <div className="preview-item">
              <img src={URL.createObjectURL(adImage)} alt="ad" />
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
