import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewContent.css";

function ViewContent() {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH CURRENT CONTENT + RELATED CONTENT
  useEffect(() => {
    setLoading(true);

    // ✅ CURRENT CONTENT
    fetch(`http://localhost:5000/api/content/single/${contentId}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content);

        // ✅ RELATED CONTENT (TITLE BASED)
        fetch(`http://localhost:5000/api/content/related/${contentId}`)
          .then((res) => res.json())
          .then((d) => setRelated(d.related || []));

        setLoading(false);
      })
      .catch((err) => {
        console.error("ViewContent Error:", err);
        setLoading(false);
      });
  }, [contentId]);

  if (loading || !content) {
    return <h2 className="vc-loading">Loading...</h2>;
  }

  return (
    <div className="vc-container">

      {/* =========================
          RELATED CONTENT SIDEBAR
      ========================= */}
      <aside className="vc-sidebar">
        <h3 className="vc-sidebar-title">Related Content</h3>

        {related.length === 0 && (
          <p style={{ opacity: 0.7, fontSize: "14px" }}>
            No related content found
          </p>
        )}

        <ul className="vc-toc">
          {related.map((item) => (
            <li
              key={item._id}
              className="toc-item"
              onClick={() => navigate(`/content/${item._id}`)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="vc-main">
        {/* Title */}
        <h1 className="vc-title">{content.title}</h1>

        {/* Video */}
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
              <img
                key={idx}
                src={`http://localhost:5000/${img}`}
                alt=""
              />
            ))}
          </div>
        )}

        {/* Main HTML Content */}
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
      </main>
    </div>
  );
}

export default ViewContent;
