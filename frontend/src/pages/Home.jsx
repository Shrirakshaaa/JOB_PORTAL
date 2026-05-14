import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import '../styles/Home.css';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <>
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="hero-title">Hire Faster.<br/>Get Hired Smarter.</h1>
          <p className="hero-subtitle">
            Our AI-powered Smart Job Portal automatically analyzes your resume and matches you with the perfect role using advanced TF-IDF algorithms, reducing irrelevant suggestions by 60%.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary btn-large neon-glass" style={{ textDecoration: 'none' }}>Get Started</Link>
            <Link to="/login" className="btn-outline btn-large neon-glass" style={{ textDecoration: 'none' }}>Login</Link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants}>
          <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.2} scale={1.05}>
            <div className="feature-card neon-glass">
              <div className="feature-icon">🚀</div>
              <h3>AI Resume Matching</h3>
              <p>We parse your uploaded resume with Apache Tika and extract your core skills.</p>
            </div>
          </Tilt>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.2} scale={1.05}>
            <div className="feature-card neon-glass">
              <div className="feature-icon">🧠</div>
              <h3>Smart TF-IDF Scoring</h3>
              <p>Our backend compares your skills directly against live job descriptions.</p>
            </div>
          </Tilt>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.2} scale={1.05}>
            <div className="feature-card neon-glass">
              <div className="feature-icon">✨</div>
              <h3>Precision Results</h3>
              <p>Recruiters see a match percentage instantly. Candidates get highly curated job feeds.</p>
            </div>
          </Tilt>
        </motion.div>
      </motion.div>
    </>
  );
}
