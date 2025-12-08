import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ManageTopics() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [topics, setTopics] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null); 

  const navigate = useNavigate();

  const loadCategories = async () => {
    const res = await api.get("/api/categories");
    if (res.data.status) setCategories(res.data.categories);
  };

  const loadTopics = async () => {
    if (!selectedCat) return;
    const res = await api.get(`/api/topics/${selectedCat}`);
    if (res.data.status) setTopics(res.data.topics);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTopics();
  }, [selectedCat]);

  //  ADD / UPDATE TOPIC
  const addTopic = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editId) {
        res = await api.put(`/api/topics/${editId}`, { name });


        if (res.data.status) {
          toast.success("Topic updated");
          setEditId(null);
        }
      } else {
        res = await api.post("/api/topics/add", {
          categoryId: selectedCat,
          name,
        });

        if (res.data.status) {
          toast.success("Topic added");
        }
      }

      setName("");
      loadTopics();
      navigate("/admin");
    } catch (err) {
      toast.error("Error saving topic");
    }
  };

  //  EDIT BUTTON HANDLER
  const editTopic = (topic) => {
    setName(topic.name);  
    setEditId(topic._id);
  };

  // DELETE
  const deleteTopic = async (id) => {
    if (!confirm("Delete this topic?")) return;
    const res = await api.delete(`/api/topics/${id}`);
    if (res.data.status) {
      toast.success("Topic deleted");
      loadTopics();
      navigate("/admin");
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Topics</h2>

      <select
        value={selectedCat}
        onChange={(e) => setSelectedCat(e.target.value)}
        className="admin-select"
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {selectedCat && (
        <>
          <form className="admin-form" onSubmit={addTopic}>
            <input
              type="text"
              placeholder="Topic name (e.g., Java Basics)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <button type="submit">
              {editId ? "Update Topic" : "Add Topic"}
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
              {topics.map((t) => (
                <tr key={t._id}>
                  <td>{t.name}</td>
                  <td>{t.slug}</td>
                  <td>
                    {/* EDIT BUTTON */}
                    <button
                      type="button" 
                      className="edit-btn"
                      onClick={() => editTopic(t)}
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      className="delete-btn"
                      onClick={() => deleteTopic(t._id)}
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

export default ManageTopics;
