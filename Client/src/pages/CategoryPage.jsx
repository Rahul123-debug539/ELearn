import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import CategoryLayout from "../components/Layout/CategoryLayout";
import "./CategoryLayout.css";

function CategoryPage() {
  const { categorySlug, topicSlug, subtopicSlug } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState({});
  const [expandedTopic, setExpandedTopic] = useState(null); // slug
  const [selectedSubtopic, setSelectedSubtopic] = useState(null); // id
  const [content, setContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* -------------------------------
      LOAD TOPICS (by category slug)
  ------------------------------- */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get(`/api/topics/by-slug/${categorySlug}`);
        if (res.data.status) setTopics(res.data.topics);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };

    fetchTopics();
    setExpandedTopic(null);
    setSelectedSubtopic(null);

    // 🔥 FIX: content wipe only when NO subtopicSlug
    if (!subtopicSlug) {
      setContent([]);
    }

  }, [categorySlug, subtopicSlug]);


  /* -------------------------------
      LOAD SUBTOPICS (by topic slug)
  ------------------------------- */
  const toggleTopic = async (topic) => {
    if (expandedTopic === topic.slug) {
      setExpandedTopic(null);
      return;
    }

    setExpandedTopic(topic.slug);

    if (!subtopics[topic.slug]) {
      try {
        const res = await api.get(
          `/api/subtopics/by-slug/${categorySlug}/${topic.slug}`
        );

        if (res.data.status) {
          setSubtopics((prev) => ({
            ...prev,
            [topic.slug]: res.data.subtopics
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  /* -------------------------------
      LOAD CONTENT (by subtopic slug)
  ------------------------------- */
  useEffect(() => {
    if (!subtopicSlug) return;

    const fetchContent = async () => {
      try {
        const res = await api.get(
          `/api/content/by-slug/${subtopicSlug}`
        );

        if (res.data.status) {
          setContent(res.data.content || []);
        } else {
          setContent([]);
        }
      } catch (err) {
        console.error(err);
        setContent([]);
      }
    };

    fetchContent();
  }, [subtopicSlug]);

  /* -------------------------------
      NAV HELPERS
  ------------------------------- */
  const activeTopic = topics.find((t) => t.slug === expandedTopic);
  const activeList = activeTopic ? subtopics[activeTopic.slug] || [] : [];

  useEffect(() => {
  if (
    !subtopicSlug ||
    !expandedTopic ||
    !subtopics[expandedTopic]
  ) return;

  const list = subtopics[expandedTopic];
  const index = list.findIndex((s) => s.slug === subtopicSlug);

  if (index !== -1) {
    setCurrentIndex(index);
    setSelectedSubtopic(list[index]._id);
  }
}, [subtopicSlug, expandedTopic, subtopics]);


const goNext = () => {
  if (!activeList.length) return;

  const nextIndex = currentIndex + 1;
  if (nextIndex >= activeList.length) return;

  const next = activeList[nextIndex];

  navigate(`/${categorySlug}/${activeTopic.slug}/${next.slug}`);
  setCurrentIndex(nextIndex);
  setSelectedSubtopic(next._id);
  window.scrollTo({ top: 0, behavior: "smooth" });
};


const goPrev = () => {
  if (!activeList.length) return;

  const prevIndex = currentIndex - 1;
  if (prevIndex < 0) return;

  const prev = activeList[prevIndex];

  navigate(`/${categorySlug}/${activeTopic.slug}/${prev.slug}`);
  setCurrentIndex(prevIndex);
  setSelectedSubtopic(prev._id);
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  /* -------------------------------
      SIDEBAR
  ------------------------------- */
  const sidebar = (
    <div>
      <h3 className="sidebar-heading">📘 Topics</h3>

      <ul className="topic-list">
        {topics.map((topic) => (
          <li key={topic._id}>
            <div
              className="topic-row"
              onClick={() => toggleTopic(topic)}
            >
              <span>{topic.name}</span>
              <span>{expandedTopic === topic.slug ? "▾" : "▸"}</span>
            </div>

            {expandedTopic === topic.slug && (
              <ul className="subtopic-list">
                {(subtopics[topic.slug] || []).map((sub, index) => (
                  <li
                    key={sub._id}
                    className={`subtopic ${sub._id === selectedSubtopic ? "active" : ""
                      }`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setSelectedSubtopic(sub._id);
                      navigate(
                        `/${categorySlug}/${topic.slug}/${sub.slug}`
                      );
                    }}
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
      CONTENT AREA
  ------------------------------- */
  const contentArea = (
    <div className="content-wrapper">
      {content.length === 0 && (
        <div className="welcome-state">

          <div className="welcome-badge">
            Welcome to LearnEase
          </div>

          <h1 className="welcome-title">
            Start Your Learning Journey
          </h1>

          <p className="welcome-text">
            Select a <span>Topic</span> from the left sidebar and begin exploring
            high-quality lessons, examples, notes and practice content — all in one place.
          </p>

          <div className="welcome-steps">
            <div className="step">Choose a Topic</div>
            <div className="step">Read the Lesson</div>
            <div className="step">Practice with Examples</div>
            <div className="step">Level Up Your Skills</div>
          </div>

          <button
            className="welcome-btn"
            onClick={() =>
              document
                .querySelector(".topic-list")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Select Your First Topic
          </button>

        </div>
      )}


      {content.length > 0 && (
        <>
          {/* SINGLE H1 (SEO SAFE) */}
          <h1 className="content-title">{content[0].title}</h1>

          {content.map((item, idx) => (
            <div key={idx} className="content-block">
              <div
                className="html-content"
                dangerouslySetInnerHTML={{ __html: item.fullContent }}
              />

              {item.images?.length > 0 && (
                <div className="image-grid">
                  {item.images.map((img, i) => (
                    <img key={i} src={img} alt="content" />
                  ))}
                </div>
              )}

              {item.videoUrl && (
                <div className="video-container">
                  <iframe src={item.videoUrl} title="video" allowFullScreen />
                </div>
              )}

              <hr className="content-divider" />
            </div>
          ))}

          <div className="nav-buttons">
            <button onClick={goPrev} disabled={currentIndex === 0}>
              ⬅ Previous
            </button>

            <button
              onClick={goNext}
              disabled={currentIndex === activeList.length - 1}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );

  return <CategoryLayout sidebar={sidebar} content={contentArea} />;
}

export default CategoryPage;
