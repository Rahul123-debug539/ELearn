import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function ManageSubtopics() {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => {
      if (res.data.status) setCategories(res.data.categories);
    });
  }, []);

  const loadTopics = () => {
    if (!selectedCat) return;
    api.get(`/topics/${selectedCat}`).then((res) => {
      if (res.data.status) setTopics(res.data.topics);
    });
  };

  const loadSubtopics = () => {
    if (!selectedTopic) return;
    api.get(`/subtopics/${selectedTopic}`).then((res) => {
      if (res.data.status) setSubtopics(res.data.subtopics);
    });
  };

  useEffect(loadTopics, [selectedCat]);
  useEffect(loadSubtopics, [selectedTopic]);

  const addSubtopic = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/subtopics/add", {
        topicId: selectedTopic,
        name,
      });
      if (res.data.status) {
        toast.success("Subtopic added");
        setName("");
        loadSubtopics();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding subtopic");
    }
  };

  const deleteSubtopic = async (id) => {
    if (!confirm("Delete this subtopic?")) return;
    const res = await api.delete(`/subtopics/${id}`);
    if (res.data.status) {
      toast.success("Subtopic deleted");
      loadSubtopics();
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Subtopics</h2>

      <select
        className="admin-select"
        value={selectedCat}
        onChange={(e) => setSelectedCat(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
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
        <>
          <form className="admin-form" onSubmit={addSubtopic}>
            <input
              type="text"
              placeholder="Subtopic name (e.g., Variables)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <button type="submit">Add Subtopic</button>
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subtopics.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.slug}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteSubtopic(s._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ManageSubtopics;
