import { useEffect } from "react";
import About from "./About";
import Contact from "./Contact";
import Courses from "./Courses";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {

  useEffect(() => {
    // Mouse parallax effect for blobs
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 30;
      const y = (e.clientY / window.innerHeight) * 30;

      document.documentElement.style.setProperty("--blob-x", `${x}px`);
      document.documentElement.style.setProperty("--blob-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>

      {/* =================== HERO SECTION =================== */}
      <section className="hero-modern">
        <div className="hero-left">
          <p className="tag">A PLATFORM FOR STUDENTS & DEVELOPERS</p>

          <h1 className="hero-title">
            Learn Programming  
            <span className="gradient-text"> The Smart Way</span>
          </h1>

          <p className="hero-desc">
            LearnEase gives you clear explanations, structured topics, 
            interactive examples and a premium learning experience built 
            for students, beginners and developers.
          </p>

          <button className="hero-btn">
            Start Learning →
          </button>

          <p className="stats-line">
            📈 More than 140+ new lessons added recently.
          </p>
        </div>

        <div className="hero-right">
          <div className="blob"></div>
          <div className="blob2"></div>
          <div className="blob-glow"></div>
        </div>
      </section>


      {/* =================== ABOUT SECTION =================== */}
      <section className="about-highlight">
        <h2>Why LearnEase?</h2>

        <p>
          A well-organized coding platform that simplifies programming using
          visual explanations, structured navigation and beginner-friendly content.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>🎯 Structured Learning</h3>
            <p>Everything is organized: Category → Topic → Subtopic → Content.</p>
          </div>

          <div className="about-card">
            <h3>💡 Beginner Friendly</h3>
            <p>Simple language, clear examples, modern UI.</p>
          </div>

          <div className="about-card">
            <h3>⚡ Admin Powered</h3>
            <p>New topics & lessons are updated regularly.</p>
          </div>

          <div className="about-card">
            <h3>🔥 Premium UI</h3>
            <p>Dark, neon gradients with professional layout.</p>
          </div>
        </div>
      </section>


      {/* =================== LANGUAGE SHOWCASE =================== */}
      <section className="languages-showcase">
        <h2 className="gradient-text">Popular Courses</h2>

        <div className="lang-grid">
          <div className="lang-box">Java</div>
          <div className="lang-box">Python</div>
          <div className="lang-box">C</div>
          <div className="lang-box">C++</div>
          <div className="lang-box">DSA</div>
          <div className="lang-box">HTML</div>
          <div className="lang-box">JavaScript</div>
        </div>
      </section>


      {/* =================== ORIGINAL SECTIONS =================== */}
      <Courses />
      <About />
      <Contact />
    </div>
  );
}

export default Home;
