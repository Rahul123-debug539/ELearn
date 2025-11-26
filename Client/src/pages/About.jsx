import "./About.css";

function About() {
  return (
    <section className="about-section" id="about">

      <h1 className="about-title">
        What is <span>LearnEase?</span>
      </h1>

      <p className="about-subtitle">
        LearnEase is a modern coding education platform that blends simplicity,
        structure and visual learning — helping students learn programming the right way.
      </p>

      <div className="about-grid">

        <div className="about-card">
          <div className="icon-circle">🎯</div>
          <h3>Structured Learning</h3>
          <p>All topics are arranged step-by-step for easy understanding.</p>
        </div>

        <div className="about-card">
          <div className="icon-circle">💡</div>
          <h3>Beginner Friendly</h3>
          <p>Simple explanations with real examples & visuals.</p>
        </div>

        <div className="about-card">
          <div className="icon-circle">⚡</div>
          <h3>Fast Learning</h3>
          <p>Learn faster with focused content and smooth UI.</p>
        </div>

        <div className="about-card">
          <div className="icon-circle">🔥</div>
          <h3>Premium UI</h3>
          <p>Dark, neon gradients with professional design.</p>
        </div>

      </div>

    </section>
  );
}

export default About;
