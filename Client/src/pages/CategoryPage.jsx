import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import CategoryLayout from "../components/Layout/CategoryLayout";
import "./CategoryLayout.css"; // OUR NEW GFG-LIKE STYLING

function CategoryPage() {
  const { categoryId } = useParams();

  const [topics, setTopics] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [subtopics, setSubtopics] = useState({});
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [content, setContent] = useState([]);

  /* -------------------------------
      LOAD TOPICS
  ------------------------------- */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get(`/topics/${categoryId}`);
        if (res.data.status) setTopics(res.data.topics);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };

    fetchTopics();
    setExpandedTopic(null);
    setSelectedSubtopic(null);
    setContent([]);
  }, [categoryId]);

  /* -------------------------------
      EXPAND TOPIC → LOAD SUBTOPICS
  ------------------------------- */
  const toggleTopic = async (topic) => {
    if (expandedTopic === topic._id) {
      setExpandedTopic(null);
      return;
    }

    setExpandedTopic(topic._id);

    if (!subtopics[topic._id]) {
      try {
        const res = await api.get(`/subtopics/${topic._id}`);
        if (res.data.status) {
          setSubtopics((prev) => ({
            ...prev,
            [topic._id]: res.data.subtopics
          }));
        }
      } catch (err) {
        console.error("Error fetching subtopics:", err);
      }
    }
  };

  /* -------------------------------
      LOAD CONTENT OF SUBTOPIC
  ------------------------------- */
  const loadContent = async (sub) => {
    setSelectedSubtopic(sub._id);

    try {
      const res = await api.get(`/content/${sub._id}`);
      if (res.data.status) setContent(res.data.content || []);
      else setContent([]);
    } catch (err) {
      console.error("Error fetching content:", err);
      setContent([]);
    }
  };

  /* -------------------------------
      SIDEBAR UI
  ------------------------------- */
  const sidebar = (
    <div>
      <h3 className="sidebar-heading">📘 Topics</h3>

      <ul className="topic-list">
        {topics.map((topic) => (
          <li key={topic._id}>
            <div className="topic-row" onClick={() => toggleTopic(topic)}>
              <span>{topic.name}</span>
              <span>{expandedTopic === topic._id ? "▾" : "▸"}</span>
            </div>

            {expandedTopic === topic._id && (
              <ul className="subtopic-list">
                {(subtopics[topic._id] || []).map((sub) => (
                  <li
                    key={sub._id}
                    className={`subtopic ${selectedSubtopic === sub._id ? "active" : ""
                      }`}
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

  /* -------------------------------
      CONTENT UI (MAIN PANEL)
  ------------------------------- */
  const contentArea = (
    <div className="content-wrapper">
      {content.length === 0 && (
        <p className="empty-text">
          👈 Start by selecting a topic from the left sidebar.
        </p>
      )}

      {content.length > 0 &&
        content.map((item, idx) => (
          <div key={idx} className="content-block">
            {/* TITLE */}
            <h1 className="content-title">{item.title}</h1>

            {/* FULL HTML CONTENT */}
            <div
              className="html-content"
              dangerouslySetInnerHTML={{ __html: item.fullContent }}
            />

            {/* CLOUDINARY IMAGES */}
            {item.images?.length > 0 && (
              <div className="image-grid">
                {item.images.map((img, i) => (
                  <img key={i} src={img} alt="content-img" />
                ))}
              </div>
            )}

            {/* YOUTUBE VIDEO */}
            {item.videoUrl && (
              <div className="video-container">
                <iframe src={item.videoUrl} title="video" allowFullScreen />
              </div>
            )}

            {/* CUSTOM HTML ADS (RIGHT SIDE LIKE GFG) */}
            {item.adSection && (
              <div
                className="ad-section"
                dangerouslySetInnerHTML={{ __html: item.adSection }}
              />
            )}

            {/* AD IMAGE */}
            {item.adImage && (
              <img src={item.adImage} alt="ad" className="ad-image" />
            )}

            <hr className="content-divider" />
          </div>
        ))}
    </div>
  );

  return <CategoryLayout sidebar={sidebar} content={contentArea} />;
}

export default CategoryPage;
