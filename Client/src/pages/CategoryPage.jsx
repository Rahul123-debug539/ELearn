import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../api/api";
import CategoryLayout from "../components/Layout/CategoryLayout";
import "./CategoryLayout.css";

function CategoryPage() {
  const { categorySlug, topicSlug, subtopicSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [subtopics, setSubtopics] = useState({});
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [content, setContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* -------------------------------
      FETCH CATEGORY BY SLUG
  ------------------------------- */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/api/category/slug/${categorySlug}`);
        setCategory(res.data);
      } catch (err) {
        console.error("Category fetch error");
      }
    };
    fetchCategory();
  }, [categorySlug]);

  /* -------------------------------
      FETCH TOPICS (ID BASED – SAME AS BEFORE)
  ------------------------------- */
  useEffect(() => {
    if (!category?._id) return;

    const fetchTopics = async () => {
    const res = await api.get(`/api/topic/${category._id}`);
      if (res.data.status) setTopics(res.data.topics);
    };

    fetchTopics();
    setExpandedTopic(null);
    setSelectedSubtopic(null);
    setContent([]);
  }, [category?._id]);

  /* -------------------------------
      AUTO EXPAND TOPIC FROM URL
  ------------------------------- */
  useEffect(() => {
    if (!topicSlug || topics.length === 0) return;

    const topic = topics.find((t) => t.slug === topicSlug);
    if (topic) expandTopic(topic);
  }, [topicSlug, topics]);

  /* -------------------------------
      AUTO LOAD SUBTOPIC FROM URL
  ------------------------------- */
  useEffect(() => {
    if (!subtopicSlug || !expandedTopic) return;

    const list = subtopics[expandedTopic] || [];
    const sub = list.find((s) => s.slug === subtopicSlug);
    if (sub) loadContent(sub);
  }, [subtopicSlug, expandedTopic, subtopics]);

  /* -------------------------------
      EXPAND TOPIC
  ------------------------------- */
  const expandTopic = async (topic) => {
    setExpandedTopic(topic._id);

    if (!subtopics[topic._id]) {
      const res = await api.get(`/api/subtopic/${topic._id}`);
      if (res.data.status) {
        setSubtopics((prev) => ({
          ...prev,
          [topic._id]: res.data.subtopics
        }));
      }
    }

    navigate(`/category/${categorySlug}/${topic.slug}`);
  };

  /* -------------------------------
      LOAD CONTENT (UNCHANGED LOGIC)
  ------------------------------- */
  const loadContent = async (sub) => {
    setSelectedSubtopic(sub._id);

    const list = subtopics[expandedTopic] || [];
    const index = list.findIndex((s) => s._id === sub._id);
    setCurrentIndex(index);

    const res = await api.get(`/api/content/list/${sub._id}`);
    if (res.data.status) setContent(res.data.content || []);
    else setContent([]);

    navigate(
      `/category/${categorySlug}/${topicSlug}/${sub.slug}`
    );
  };

  /* -------------------------------
      PREVIOUS / NEXT
  ------------------------------- */
  const goNext = () => {
    const list = subtopics[expandedTopic] || [];
    if (currentIndex < list.length - 1) {
      loadContent(list[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    const list = subtopics[expandedTopic] || [];
    if (currentIndex > 0) {
      loadContent(list[currentIndex - 1]);
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
            <div
              className="topic-row"
              onClick={() => expandTopic(topic)}
            >
              <span>{topic.name}</span>
              <span>{expandedTopic === topic._id ? "▾" : "▸"}</span>
            </div>

            {expandedTopic === topic._id && (
              <ul className="subtopic-list">
                {(subtopics[topic._id] || []).map((sub) => (
                  <li
                    key={sub._id}
                    className={`subtopic ${
                      selectedSubtopic === sub._id ? "active" : ""
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
      CONTENT UI (SAME AS BEFORE)
  ------------------------------- */
  const contentArea = (
    <div className="content-wrapper">
      {content.map((item, idx) => (
        <div key={idx} className="content-block">
          <h1 className="content-title">{item.title}</h1>

          <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: item.fullContent }}
          />

          <hr className="content-divider" />

          <div className="nav-buttons">
            <button onClick={goPrev} disabled={currentIndex === 0}>
              ⬅ Previous
            </button>

            <button
              onClick={goNext}
              disabled={
                currentIndex ===
                (subtopics[expandedTopic]?.length - 1)
              }
            >
              Next ➡
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  /* -------------------------------
      SEO HELMET
  ------------------------------- */
  return (
    <>
      {category && (
        <Helmet>
          <title>
            {subtopicSlug
              ? `${content[0]?.title} | ${category.name}`
              : topicSlug
              ? `${topicSlug} | ${category.name} Course`
              : `${category.name} Programming Course | CSMentor`}
          </title>

          <meta
            name="description"
            content={`Learn ${category.name} programming with structured topics and examples on CSMentor.`}
          />

          <link
            rel="canonical"
            href={`https://www.csmentor.in${location.pathname}`}
          />
        </Helmet>
      )}

      <CategoryLayout sidebar={sidebar} content={contentArea} />
    </>
  );
}

export default CategoryPage;
