import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function ManageContent() {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);

  const [selectedCat, setSelectedCat] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    examples: "",
    notes: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.categories));
  }, []);

  const loadTopics = () => {
    if (!selectedCat) return;
    api.get(`/topics/${selectedCat}`).then((res) => setTopics(res.data.topics));
  };

  const loadSubtopics = () => {
    if (!selectedTopic) return;
    api.get(`/subtopics/${selectedTopic}`).then((res) => setSubtopics(res.data.subtopics));
  };

  useEffect(loadTopics, [selectedCat]);
  useEffect(loadSubtopics, [selectedTopic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSub) return toast.error("Select a subtopic");

    try {
      const fd = new FormData();
      fd.append("subtopicId", selectedSub);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("code", form.code);
      fd.append("examples", form.examples);
      fd.append("notes", form.notes);

      for (let img of images) fd.append("images", img);

      const res = await api.post("/content/add", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success("Content added successfully");
        setForm({ title: "", description: "", code: "", examples: "", notes: "" });
        setImages([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error adding content");
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Content</h2>

      {/* Category Select */}
      <select
        className="admin-select"
        value={selectedCat}
        onChange={(e) => setSelectedCat(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option value={c._id} key={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Topic Select */}
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

      {/* Subtopic Select */}
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

      {/* Add Content Form */}
      {selectedSub && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Content Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <textarea
            placeholder="Code"
            rows={4}
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <textarea
            placeholder="Examples"
            rows={3}
            value={form.examples}
            onChange={(e) => setForm({ ...form, examples: e.target.value })}
          />

          <textarea
            placeholder="Notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <label style={{ marginTop: "1rem", color: "#e5e7eb" }}>
            Upload Images:
          </label>

          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            accept="image/*"
          />

          <button type="submit">Add Content</button>
        </form>
      )}
    </div>
  );
}

export default ManageContent;
