import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

import "./MyArticles.css";

function MyArticles() {

  const [articles, setArticles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {

      const res =
        await api.get(
          "/api/pending-article/my-articles"
        );

      if (res.data.status) {
        setArticles(
          res.data.articles
        );
      }

    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to load articles"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        Loading...
      </div>
    );
  }

  return (
    <div className="review-page">

      <h2>
        My Article Reviews
      </h2>

      {articles.length === 0 ? (
        <div className="empty-box">
          No articles submitted yet.
        </div>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            className="review-card"
          >
            <h3>
              {article.title}
            </h3>

            <p>
              <strong>Subtopic:</strong>{" "}
              {article.subtopicId?.name}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status ${article.status}`}
              >
                {article.status}
              </span>
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(
                article.createdAt
              ).toLocaleDateString()}
            </p>

            {article.adminRemark && (
              <p>
                <strong>
                  Admin Remark:
                </strong>{" "}
                {article.adminRemark}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyArticles;