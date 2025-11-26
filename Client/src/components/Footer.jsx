import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-section">
          <h2 className="footer-title">LearnEase</h2>
          <p className="footer-text">
            LearnEase is a platform designed to make programming simple,
            structured and easy-to-understand for every learner.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#about">About</Link></li>
            <li><Link to="/#courses">Courses</Link></li>
            <li><Link to="/#contact">Contact</Link></li>
          </ul>
        </div>

        {/* POPULAR CATEGORIES */}
        <div className="footer-section">
          <h3>Popular Courses</h3>
          <ul>
            <li><Link to="/courses">Java</Link></li>
            <li><Link to="/courses">C Language</Link></li>
            <li><Link to="/courses">Python</Link></li>
            <li><Link to="/courses">DSA</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@learnease.com</p>
          <p>Phone: +91 9876543210</p>

          {/* SOCIAL ICONS */}
          <div className="social-icons">
            <a href="#"><i className="icon fb"></i></a>
            <a href="#"><i className="icon ig"></i></a>
            <a href="#"><i className="icon tw"></i></a>
            <a href="#"><i className="icon yt"></i></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} LearnEase — All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
