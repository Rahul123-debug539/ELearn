import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ManageContent.css"

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

  // Load categories
  useEffect(() => {
    api.get("/categories").then((res) => {
      if (res.data.status) setCategories(res.data.categories);
    });
  }, []);

  // Load topics
  useEffect(() => {
    if (!selectedCat) return;
    api.get(`/topics/${selectedCat}`).then((res) => {
      if (res.data.status) setTopics(res.data.topics);
    });
  }, [selectedCat]);

  // Load subtopics
  useEffect(() => {
    if (!selectedTopic) return;
    api.get(`/subtopics/${selectedTopic}`).then((res) => {
      if (res.data.status) setSubtopics(res.data.subtopics);
    });
  }, [selectedTopic]);

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

      // Append images
      images.forEach((img) => fd.append("images", img));

      // Append ad image
      if (adImage) fd.append("adImage", adImage);

      // Add safe YouTube link (not iframe)
      if (videoUrl) fd.append("videoUrl", videoUrl);

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
      console.error(err);
      toast.error("Failed to add content");
    }
  };

  return (
    <div className="admin-page">
      <h2>Add New Content</h2>

      {/* CATEGORY */}
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

      {/* TOPIC */}
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

      {/* SUBTOPIC */}
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

      {/* FORM */}
      {selectedSub && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Content Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* FULL CONTENT EDITOR */}
          <ReactQuill
            value={fullContent}
            onChange={setFullContent}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline"],
                [{ color: [] }],
                ["blockquote", "code-block", ],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"]
              ]
            }}
            style={{ height: "300px", marginBottom: "80px" }}
          />

          {/* IMAGE UPLOAD */}
          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            accept="image/*"
          />

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="preview-box">
              {images.map((img, idx) => (
                <div key={idx} className="preview-item">
                  <img src={URL.createObjectURL(img)} alt="preview" />
                  <button
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

          {/* VIDEO URL INPUT */}
          <input
            type="text"
            placeholder="YouTube Video Link (not iframe)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          {/* VIDEO PREVIEW */}
          {videoUrl && (
            <div className="preview-item">
              <iframe
                width="300"
                height="180"
                src={videoUrl.replace("youtu.be/", "youtube.com/embed/")}
              ></iframe>
              <button
                className="remove-btn"
                onClick={() => setVideoUrl("")}
              >
                ✖
              </button>
            </div>
          )}

          {/* AD IMAGE UPLOAD */}
          <label>Upload Ad Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAdImage(e.target.files[0])}
          />

          {/* AD IMAGE PREVIEW */}
          {adImage && (
            <div className="preview-item">
              <img src={URL.createObjectURL(adImage)} alt="Ad" />
              <button className="remove-btn" onClick={() => setAdImage(null)}>
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
