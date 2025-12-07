import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewContent.css";

function ViewContent() {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [toc, setToc] = useState([]); // Table of contents (list of contents inside same subtopic)
  const [loading, setLoading] = useState(true);

  // FETCH CURRENT CONTENT
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5000/api/content/detail/${contentId}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content);

        // Fetch TOC (all contents of this subtopic)
        if (data.content?.subtopicId) {
          fetch(`http://localhost:5000/api/content/${data.content.subtopicId}`)
            .then((res) => res.json())
            .then((d) => setToc(d.content || []));
        }

        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [contentId]);

  if (loading || !content) return <h2 className="vc-loading">Loading...</h2>;

  // CURRENT INDEX FOR NEXT/PREV
  const currentIndex = toc.findIndex((x) => x._id === contentId);
  const prevContent = toc[currentIndex - 1];
  const nextContent = toc[currentIndex + 1];

  return (
    <div className="vc-container">

      {/* LEFT SIDEBAR (TOC) */}
      <aside className="vc-sidebar">
        <h3 className="vc-sidebar-title">Contents</h3>
        <ul className="vc-toc">
          {toc.map((item) => (
            <li
              key={item._id}
              className={item._id === contentId ? "active toc-item" : "toc-item"}
              onClick={() => navigate(`/content/${item._id}`)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="vc-main">

        {/* Breadcrumb */}
        <div className="vc-breadcrumb">
          <span>Course</span> /
          <span>{content.subtopicId}</span> /
          <span>{content.title}</span>
        </div>

        <h1 className="vc-title">{content.title}</h1>

        {/* Video if exists */}
        {content.videoUrl && (
          <div className="vc-video-box">
            <iframe
              src={content.videoUrl}
              title="video"
              allowFullScreen
            />
          </div>
        )}

        {/* Images Gallery */}
        {content.images?.length > 0 && (
          <div className="vc-gallery">
            {content.images.map((img, idx) => (
              <img key={idx} src={`http://localhost:5000/${img}`} alt="" />
            ))}
          </div>
        )}

        {/* Main content HTML */}
        <div
          className="vc-html"
          dangerouslySetInnerHTML={{ __html: content.fullContent }}
        ></div>

        {/* Code Section */}
        {content.code && (
          <pre className="vc-code">
            <code>{content.code}</code>
          </pre>
        )}

        {/* Examples */}
        {content.examples && (
          <div className="vc-box">
            <h3>Examples</h3>
            <p>{content.examples}</p>
          </div>
        )}

        {/* Notes */}
        {content.notes && (
          <div className="vc-notes">
            <h3>Notes</h3>
            <p>{content.notes}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="vc-nav-buttons">
          {prevContent && (
            <button
              className="vc-btn"
              onClick={() => navigate(`/content/${prevContent._id}`)}
            >
              ← Previous: {prevContent.title}
            </button>
          )}
          {nextContent && (
            <button
              className="vc-btn"
              onClick={() => navigate(`/content/${nextContent._id}`)}
            >
              Next: {nextContent.title} →
            </button>
          )}
        </div>

      </main>
    </div>
  );
}

export default ViewContent;
