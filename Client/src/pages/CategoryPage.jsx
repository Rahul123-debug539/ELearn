import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

      if (res.data.status) {
        setTopics(res.data.topics);
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  fetchTopics();

  

  if (!subtopicSlug) {
    setExpandedTopic(null);
    setSelectedSubtopic(null);
    setCurrentIndex(0);
    setContent([]);
  }
}, [categorySlug]);


useEffect(() => {
  if (!topics.length) return;

  if (topicSlug || subtopicSlug) return;

  const loadDefaultPage = async () => {
    try {
      const firstTopic = topics[0];

      const res = await api.get(
        `/api/subtopics/by-slug/${categorySlug}/${firstTopic.slug}`
      );

      if (res.data.status && res.data.subtopics.length) {
        const firstSubtopic = res.data.subtopics[0];

        navigate(
          `/${categorySlug}/${firstTopic.slug}/${firstSubtopic.slug}`,
          { replace: true }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadDefaultPage();
}, [topics, categorySlug]);

/* -------------------------------
    AUTO EXPAND TOPIC FROM URL
------------------------------- */
useEffect(() => {
  if (!topics.length || !topicSlug) return;

  const topic = topics.find(
    (t) => t.slug.toLowerCase() === topicSlug.toLowerCase()
  );

  if (!topic) return;

  setExpandedTopic(topic.slug);

  const loadSubtopics = async () => {
    if (!subtopics[topic.slug]) {
      try {
        const res = await api.get(
          `/api/subtopics/by-slug/${categorySlug}/${topic.slug}`
        );

        if (res.data.status) {
          setSubtopics((prev) => ({
            ...prev,
            [topic.slug]: res.data.subtopics,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  loadSubtopics();
}, [topics, topicSlug, categorySlug]);

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
    AUTO SELECT SUBTOPIC
------------------------------- */
useEffect(() => {
  if (
    !subtopicSlug ||
    !expandedTopic ||
    !subtopics[expandedTopic]
  ) {
    return;
  }

  const list = subtopics[expandedTopic];

  const index = list.findIndex(
    (s) => s.slug === subtopicSlug
  );

  if (index !== -1) {
    setCurrentIndex(index);
    setSelectedSubtopic(list[index]._id);
  }
}, [subtopicSlug, expandedTopic, subtopics]);

/* -------------------------------
    NAV HELPERS
------------------------------- */
const activeTopic = topics.find(
  (t) => t.slug === expandedTopic
);

const activeList = activeTopic
  ? subtopics[activeTopic.slug] || []
  : [];

const goNext = () => {
  if (!activeList.length) return;

  const nextIndex = currentIndex + 1;

  if (nextIndex >= activeList.length) return;

  const next = activeList[nextIndex];

  setCurrentIndex(nextIndex);
  setSelectedSubtopic(next._id);

  navigate(
    `/${categorySlug}/${activeTopic.slug}/${next.slug}`
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const goPrev = () => {
  if (!activeList.length) return;

  const prevIndex = currentIndex - 1;

  if (prevIndex < 0) return;

  const prev = activeList[prevIndex];

  setCurrentIndex(prevIndex);
  setSelectedSubtopic(prev._id);

  navigate(
    `/${categorySlug}/${activeTopic.slug}/${prev.slug}`
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


const toggleTopic = async (topic) => {

  // collapse
  if (expandedTopic === topic.slug) {
    setExpandedTopic(null);
    return;
  }

  // expand
  setExpandedTopic(topic.slug);

  // already loaded
  if (subtopics[topic.slug]) return;

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

  } catch (error) {

    console.error(
      "Subtopic fetch error:",
      error
    );

  }
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

    <Helmet>
      <title>
        {content.length > 0
          ? `${content[0]?.title} | CsMentor`
          : "CsMentor - Learn Programming & Computer Science"}
      </title>

      <meta
        name="description"
        content={
          content.length > 0
            ? `${content[0]?.title} tutorial with examples, notes, interview questions and detailed explanations on CsMentor.`
            : "Learn C, C++, Java, JavaScript, React, Node.js, MongoDB, DSA and Computer Science topics with examples and notes."
        }
      />

      <meta
        name="keywords"
        content={
          content.length > 0
            ? `${content[0]?.title}, ${subtopicSlug}, programming tutorial, coding tutorial, interview questions, CsMentor`
            : "programming tutorials, coding tutorials, C language, C++, Java, JavaScript, React, Node.js, MongoDB, DSA, CsMentor"
        }
      />

      <meta property="og:type" content="article" />

      <meta
        property="og:title"
        content={
          content.length > 0
            ? `${content[0]?.title} | CsMentor`
            : "CsMentor"
        }
      />

      <meta
        property="og:description"
        content={
          content.length > 0
            ? `${content[0]?.title} tutorial with examples and notes.`
            : "Learn programming and computer science with CsMentor."
        }
      />

      <meta
        property="og:url"
        content={`https://www.csmentor.in/${categorySlug}/${topicSlug}/${subtopicSlug}`}
      />

      <meta
        property="twitter:card"
        content="summary_large_image"
      />

      <meta
        property="twitter:title"
        content={
          content.length > 0
            ? `${content[0]?.title} | CsMentor`
            : "CsMentor"
        }
      />

      <meta
        property="twitter:description"
        content={
          content.length > 0
            ? `${content[0]?.title} tutorial with examples and notes.`
            : "Learn programming and computer science with CsMentor."
        }
      />

      <link
        rel="canonical"
        href={`https://www.csmentor.in/${categorySlug}/${topicSlug}/${subtopicSlug}`}
      />
    </Helmet>


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
