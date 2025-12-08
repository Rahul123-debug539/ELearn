import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ManageSubtopics() {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);   // ✅ 1️⃣ EDIT STATE

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/categories").then((res) => {
      if (res.data.status) setCategories(res.data.categories);
    });
  }, []);

  const loadTopics = () => {
    if (!selectedCat) return;
    api.get(`/api/topics/${selectedCat}`).then((res) => {
      if (res.data.status) setTopics(res.data.topics);
    });
  };

  const loadSubtopics = () => {
    if (!selectedTopic) return;
    api.get(`/api/subtopics/${selectedTopic}`).then((res) => {
      if (res.data.status) setSubtopics(res.data.subtopics);
    });
  };

  useEffect(loadTopics, [selectedCat]);
  useEffect(loadSubtopics, [selectedTopic]);

  // ✅ 2️⃣ ADD / UPDATE SUBTOPIC
  const addSubtopic = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (editId) {
        // ✅ UPDATE
        res = await api.put(`/api/subtopics/${editId}`, { name });

        if (res.data.status) {
          toast.success("Subtopic updated");
          setEditId(null);
        }
      } else {
        // ✅ ADD
        res = await api.post("/api/subtopics/add", {
          topicId: selectedTopic,
          name,
        });

        if (res.data.status) {
          toast.success("Subtopic added");
        }
      }

      setName("");
      loadSubtopics();
      // navigate("/admin");  ❌ optional (tum chaho to hata ke yahin live update dikhao)
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving subtopic");
    }
  };

  // ✅ 3️⃣ EDIT HANDLER
  const editSubtopic = (subtopic) => {
    setName(subtopic.name);
    setEditId(subtopic._id);
  };

  // ✅ DELETE
  const deleteSubtopic = async (id) => {
    if (!confirm("Delete this subtopic?")) return;
    const res = await api.delete(`/api/subtopics/${id}`);
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

            <button type="submit">
              {editId ? "Update Subtopic" : "Add Subtopic"} {/* ✅ */}
            </button>
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
                    {/* ✅ 4️⃣ EDIT BUTTON */}
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editSubtopic(s)}
                    >
                      Edit
                    </button>

                    {/* ✅ DELETE BUTTON */}
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteSubtopic(s._id)}
                    >
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
