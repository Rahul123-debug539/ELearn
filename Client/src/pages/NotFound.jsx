import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="nf-wrapper">
      <div className="nf-card">
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Page Not Found</h2>
        <p className="nf-text">
          Bhai jo page tum dhoondh rahe ho wo ya to exist nahi karta
          ya delete ho chuka hai 😅
        </p>

        <div className="nf-actions">
          <button className="nf-btn outline" onClick={() => navigate(-1)}>
            ← Go Back
          </button>

          <Link to="/" className="nf-btn solid">
            🏠 Go Home
          </Link>
        </div>
      </div>

      {/* Background blobs */}
      <div className="nf-blob one"></div>
      <div className="nf-blob two"></div>
    </div>
  );
}

export default NotFound;
