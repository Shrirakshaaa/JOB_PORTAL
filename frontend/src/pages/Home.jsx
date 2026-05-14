import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Hire Faster.<br/>Get Hired Smarter.</h1>
          <p className="hero-subtitle">
            Our AI-powered Smart Job Portal automatically analyzes your resume and matches you with the perfect role using advanced TF-IDF algorithms, reducing irrelevant suggestions by 60%.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary btn-large" style={{ textDecoration: 'none' }}>Get Started</Link>
            <Link to="/login" className="btn-outline btn-large" style={{ textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3>AI Resume Matching</h3>
          <p>We parse your uploaded resume with Apache Tika and extract your core skills.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>Smart TF-IDF Scoring</h3>
          <p>Our backend compares your skills directly against live job descriptions.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <h3>Precision Results</h3>
          <p>Recruiters see a match percentage instantly. Candidates get highly curated job feeds.</p>
        </div>
      </div>
    </>
  );
}
