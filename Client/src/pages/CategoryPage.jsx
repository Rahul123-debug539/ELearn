import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import CategoryLayout from "../components/Layout/CategoryLayout";

function CategoryPage() {
  const { categoryId } = useParams();

  const [topics, setTopics] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [subtopics, setSubtopics] = useState({});
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [content, setContent] = useState(null);

  // load topics for category
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get(`/topics/${categoryId}`);
        if (res.data.status) setTopics(res.data.topics);
      } catch (err) {
        console.error("Error fetching topics", err);
      }
    };
    fetchTopics();
    setExpandedTopic(null);
    setSelectedSubtopic(null);
    setContent(null);
  }, [categoryId]);

  const toggleTopic = async (topic) => {
    if (expandedTopic === topic._id) {
      setExpandedTopic(null);
      return;
    }
    setExpandedTopic(topic._id);

    // fetch subtopics if not already
    if (!subtopics[topic._id]) {
      try {
        const res = await api.get(`/subtopics/${topic._id}`);
        if (res.data.status) {
          setSubtopics((prev) => ({ ...prev, [topic._id]: res.data.subtopics }));
        }
      } catch (err) {
        console.error("Error fetching subtopics", err);
      }
    }
  };

  const loadContent = async (sub) => {
    setSelectedSubtopic(sub._id);
    try {
      const res = await api.get(`/content/${sub._id}`);
      if (res.data.status) {
        setContent(res.data.content);
      } else {
        setContent(null);
      }
    } catch (err) {
      console.error("Error fetching content", err);
    }
  };

  const sidebar = (
    <div>
      <h3 style={{ marginBottom: "0.8rem" }}>Topics</h3>
      <ul className="topic-list">
        {topics.map((topic) => (
          <li key={topic._id}>
            <div
              className="topic-row"
              onClick={() => toggleTopic(topic)}
            >
              <span>{topic.name}</span>
              <span>{expandedTopic === topic._id ? "▾" : "▸"}</span>
            </div>
            {expandedTopic === topic._id && (
              <ul className="subtopic-list">
                {(subtopics[topic._id] || []).map((sub) => (
                  <li
                    key={sub._id}
                    className={
                      selectedSubtopic === sub._id ? "subtopic active" : "subtopic"
                    }
                    onClick={() => loadContent(sub)}
                  >
                    {sub.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const contentArea = (
    <div>
      {!content && (
        <p style={{ opacity: 0.7 }}>
          Select a subtopic from the left sidebar to view its content.
        </p>
      )}
      {content && (
        <div>
          <h2 style={{ marginBottom: "0.5rem" }}>{content.title}</h2>
          <p
            style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}
          >
            {content.description}
          </p>

          {content.code && (
            <pre className="code-block">
              {content.code}
            </pre>
          )}

          {content.images && content.images.length > 0 && (
            <div className="image-grid">
              {content.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000${img}`}
                  alt="content"
                />
              ))}
            </div>
          )}

          {content.examples && (
            <>
              <h3>Examples</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{content.examples}</p>
            </>
          )}

        </div>
      )}
    </div>
  );

  return <CategoryLayout sidebar={sidebar} content={contentArea} />;
}

export default CategoryPage;
