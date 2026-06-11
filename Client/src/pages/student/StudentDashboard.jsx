import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./studentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="student-dashboard">
      <div className="student-header">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>
          Contribute to CSMentor by writing high-quality learning content.
        </p>
      </div>

      <div className="student-cards">

        <div
          className="student-card"
          onClick={() => navigate("/student/submit-article")}
        >
          <h2>📝 Write Article</h2>
          <p>
            Create a new article and submit it for admin review.
          </p>
        </div>

        <div
          className="student-card"
          onClick={() => navigate("/student/my-articles")}
        >
          <h2>📚 My Articles</h2>
          <p>
            View all your submitted articles and their status.
          </p>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;