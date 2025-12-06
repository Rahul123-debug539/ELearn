import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ContentList.css";

function ContentList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [contentList, setContentList] = useState([]);

  const [selectedCat, setSelectedCat] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => {
      if (res.data.status) setCategories(res.data.categories);
    });
  }, []);

  useEffect(() => {
    if (!selectedCat) return;
    api.get(`/topics/${selectedCat}`).then((res) => {
      if (res.data.status) setTopics(res.data.topics);
    });
  }, [selectedCat]);

  useEffect(() => {
    if (!selectedTopic) return;
    api.get(`/subtopics/${selectedTopic}`).then((res) => {
      if (res.data.status) setSubtopics(res.data.subtopics);
    });
  }, [selectedTopic]);

  useEffect(() => {
    if (!selectedSub) return;
    loadContentList();
  }, [selectedSub]);

  const loadContentList = async () => {
    try {
      const res = await api.get(`/content/${selectedSub}`);
      if (res.data.status) setContentList(res.data.content);
    } catch {
      toast.error("Failed to load content");
    }
  };

  const handleDelete = async (contentId) => {
    try {
      const res = await api.delete(
        `/content/delete/${contentId}/${selectedSub}`
      );

      if (res.data.status) {
        toast.success("Content deleted");
        loadContentList(); // refresh
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Content</h2>

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

      {contentList.length > 0 && (
        <div className="content-list">
          {contentList.map((item) => (
            <div className="content-card" key={item._id}>
              <h3>{item.title}</h3>

              <button
                className="edit-btn"
                onClick={() =>
                  navigate(`/admin/edit-content/${item._id}`)
                }
              >
                ✏ Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContentList;
