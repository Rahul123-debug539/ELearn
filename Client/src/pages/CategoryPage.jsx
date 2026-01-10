import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import CategoryLayout from "../components/Layout/CategoryLayout";
import "./CategoryLayout.css"; // OUR NEW GFG-LIKE STYLING

function CategoryPage() {
  const { slug } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topics, setTopics] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [subtopics, setSubtopics] = useState({});
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [content, setContent] = useState([]);

  /*--------------------------------
      Scroll Top
  ----------------------------------*/

  const scrollTopAfterRender = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  };


  /* -------------------------------
      LOAD TOPICS
  ------------------------------- */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get(`/api/topics/${slug}`);
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
        const res = await api.get(`/api/subtopics/${topic._id}`);
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

    const list = subtopics[expandedTopic] || [];
    const index = list.findIndex((s) => s._id === sub._id);
    setCurrentIndex(index);

    try {
      const res = await api.get(`/api/content/${sub._id}`);
      if (res.data.status) setContent(res.data.content || []);
      else setContent([]);
    } catch (err) {
      console.error("Error fetching content:", err);
      setContent([]);
    }
  };

  const goNext = () => {
    const list = subtopics[expandedTopic] || [];
    if (currentIndex < list.length - 1) {
      const nextSub = list[currentIndex + 1];
      loadContent(nextSub);
      scrollTopAfterRender()
    }
  };

  const goPrev = () => {
    const list = subtopics[expandedTopic] || [];
    if (currentIndex > 0) {
      const prevSub = list[currentIndex - 1];
      loadContent(prevSub);
      scrollTopAfterRender();
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
        <div className="welcome-state">

          <div className="welcome-badge"> Welcome to LearnEase</div>

          <h1 className="welcome-title">
            Start Your Learning Journey
          </h1>

          <p className="welcome-text">
            Select a <span>Topic</span> from the left sidebar and begin exploring
            high-quality lessons, examples, notes and practice content — all in one place.
          </p>

          <div className="welcome-steps">
            <div className="step"> Choose a Topic</div>
            <div className="step"> Read the Lesson</div>
            <div className="step"> Practice with Examples</div>
            <div className="step">Level Up Your Skills</div>
          </div>

          <button
            className="welcome-btn"
            onClick={() => document.querySelector(".vc-sidebar")?.scrollIntoView({ behavior: "smooth" })}
          >
            Select Your First Topic
          </button>

        </div>
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

            <div className="nav-buttons">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                ⬅ Previous
              </button>

              <button
                onClick={goNext}
                disabled={currentIndex === (subtopics[expandedTopic]?.length - 1)}
              >
                Next ➡
              </button>
            </div>

          </div>
        ))}
    </div>
  );

  return <CategoryLayout sidebar={sidebar} content={contentArea} />;
}

export default CategoryPage;
