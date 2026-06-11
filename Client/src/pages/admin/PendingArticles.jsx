import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../api/api";

import "./PendingArticles.css";

function PendingArticles() {

  const [articles, setArticles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles =
    async () => {

      try {

        const res =
          await api.get(
            "/api/pending-article/all"
          );

        if (res.data.status) {
          setArticles(
            res.data.articles
          );
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load articles"
        );

      } finally {

        setLoading(false);

      }
    };

  if (loading) {
    return (
      <div className="pending-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="pending-page">

      <h1>
        Pending Articles Review
      </h1>

      {articles.length === 0 ? (

        <div className="empty-box">
          No pending articles found
        </div>

      ) : (

        articles.map((article) => (

          <div
            key={article._id}
            className="pending-card"
          >

            <div className="card-top">

              <h3>
                {article.title}
              </h3>

              <span className="pending-badge">
                Pending
              </span>

            </div>

            <p>
              <strong>
                Author:
              </strong>{" "}
              {article.userId?.name}
            </p>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {article.userId?.email}
            </p>

            <p>
              <strong>
                Subtopic:
              </strong>{" "}
              {article.subtopicId?.name}
            </p>

            <p>
              <strong>
                Submitted:
              </strong>{" "}
              {
                new Date(
                  article.createdAt
                ).toLocaleDateString()
              }
            </p>

            <button
              className="review-btn"
              onClick={() =>
                navigate(
                  `/admin/review-article/${article._id}`
                )
              }
            >
              Review Article
            </button>

          </div>

        ))

      )}

    </div>
  );
}

export default PendingArticles;