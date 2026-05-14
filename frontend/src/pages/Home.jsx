import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Tilt from 'react-parallax-tilt';
import { Sparkles, BrainCircuit, Target } from 'lucide-react';
import '../styles/Home.css';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <>
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-title" style={{ fontSize: '5rem', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
            <span style={{ color: 'white' }}>Hire Faster.</span>
            <br />
            <TypeAnimation
              sequence={[
                'Get Hired Smarter.', 2000,
                'Match with Precision.', 2000,
                'Dominate Your Future.', 2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            />
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            Experience the next evolution of career building. Our neural matching engine connects elite talent with visionary companies instantly.
          </p>
          <div className="hero-buttons">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary btn-large neon-glass" style={{ textDecoration: 'none', padding: '1.25rem 3rem', fontSize: '1.25rem' }}>Enter the Portal</Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '0 4rem', maxWidth: '1400px', margin: '0 auto 8rem auto' }}
      >
        <motion.div variants={itemVariants}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.15} scale={1.02}>
            <div className="feature-card neon-glass spotlight-card" style={{ padding: '3rem', textAlign: 'left', borderRadius: '24px' }}>
              <Sparkles size={48} color="#818cf8" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>AI Resume Parsing</h3>
              <p style={{ fontSize: '1.1rem' }}>Deep text extraction using Apache Tika turns your resume into actionable data.</p>
            </div>
          </Tilt>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.15} scale={1.02}>
            <div className="feature-card neon-glass spotlight-card" style={{ padding: '3rem', textAlign: 'left', borderRadius: '24px' }}>
              <BrainCircuit size={48} color="#c084fc" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>TF-IDF Engine</h3>
              <p style={{ fontSize: '1.1rem' }}>Our cosine similarity algorithm matches your skills to the perfect job description instantly.</p>
            </div>
          </Tilt>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.15} scale={1.02}>
            <div className="feature-card neon-glass spotlight-card" style={{ padding: '3rem', textAlign: 'left', borderRadius: '24px' }}>
              <Target size={48} color="#38bdf8" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Surgical Precision</h3>
              <p style={{ fontSize: '1.1rem' }}>Recruiters see exact match percentages. Candidates see roles they are destined for.</p>
            </div>
          </Tilt>
        </motion.div>
      </motion.div>
    </>
  );
}
