import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../api/api";

import "./ReviewArticle.css";

function ReviewArticle() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [article, setArticle] =
    useState(null);

  const [existingContent,
    setExistingContent] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [remark, setRemark] =
    useState("");

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle =
    async () => {

      try {

        const res =
          await api.get(
            `/api/pending-article/review/${id}`
          );

        if (res.data.status) {

          setArticle(
            res.data.article
          );

          setExistingContent(
            res.data.existingContent
          );
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load article"
        );

      } finally {

        setLoading(false);

      }
    };

  const approveArticle =
    async () => {

      try {

        const res =
          await api.patch(
            `/api/pending-article/approve/${id}`
          );

        if (res.data.status) {

          toast.success(
            "Article approved"
          );

          navigate(
            "/admin/pending-articles"
          );
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Approval failed"
        );
      }
    };

  const rejectArticle =
    async () => {

      try {

        const res =
          await api.patch(
            `/api/pending-article/reject/${id}`,
            {
              remark
            }
          );

        if (res.data.status) {

          toast.success(
            "Article rejected"
          );

          navigate(
            "/admin/pending-articles"
          );
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Rejection failed"
        );
      }
    };

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (

    <div className="review-container">

      <div className="review-header">

        <h1>
          Review Article
        </h1>

        <p>
          Submitted By:
          {" "}
          {article?.userId?.name}
        </p>

      </div>

      <div className="compare-grid">

        {/* LIVE CONTENT */}

        <div className="compare-box">

          <h2>
            Current Live Content
          </h2>

          {existingContent.map(
            (content) => (

            <div
              key={content._id}
            >

              <h3>
                {content.title}
              </h3>

              <div
                dangerouslySetInnerHTML={{
                  __html:
                  content.fullContent
                }}
              />

            </div>

          ))}

        </div>

        {/* USER CONTENT */}

        <div className="compare-box">

          <h2>
            Suggested Content
          </h2>

          <h3>
            {article?.title}
          </h3>

          <div
            dangerouslySetInnerHTML={{
              __html:
              article?.fullContent
            }}
          />

        </div>

      </div>

      <div className="action-box">

        <textarea

          placeholder=
          "Reason for rejection"

          value={remark}

          onChange={(e)=>
            setRemark(
              e.target.value
            )
          }
        />

        <div className="btn-group">

          <button
            className="approve-btn"
            onClick={
              approveArticle
            }
          >
            Accept & Update
          </button>

          <button
            className="reject-btn"
            onClick={
              rejectArticle
            }
          >
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReviewArticle;