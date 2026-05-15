import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import '../styles/Dashboard.css';

export default function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'CANDIDATE') {
      navigate('/login');
    } else {
      fetchJobs();
      fetchMyApplications();
    }
  }, [navigate]);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs', config);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs', err);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/api/applications/my-applications', config);
      setMyApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications', err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleGetRecommendations = async () => {
    if (!file) return alert('Please select a resume file first.');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/jobs/recommended', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setJobs(res.data);
      setActiveTab('recommended');
    } catch (err) {
      console.error('Error getting recommendations', err);
      alert('Failed to get recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post('/api/applications', {
        jobId: jobId, resumeUrl: 'uploaded-resume.pdf'
      }, config);
      alert('Applied successfully!');
      fetchMyApplications();
    } catch (err) {
      console.error('Error applying', err);
      alert('Failed to apply.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div className="dashboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <button className="btn-secondary neon-glass" onClick={handleLogout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => { setActiveTab('all'); fetchJobs(); }}>All Jobs</button>
        <button className={`tab ${activeTab === 'recommended' ? 'active' : ''}`} onClick={() => setActiveTab('recommended')}>Recommendations</button>
        <button className={`tab ${activeTab === 'applied' ? 'active' : ''}`} onClick={() => setActiveTab('applied')}>My Applications</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab !== 'applied' && (
          <motion.div 
            className="upload-section neon-glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Get AI Powered Job Recommendations</h3>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Upload your resume and let our engine match your skills with the perfect job.</p>
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx" style={{ marginBottom: '1rem' }} />
            <br />
            <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 2rem' }} onClick={handleGetRecommendations} disabled={loading}>
              {loading ? 'Analyzing...' : 'Find Matches'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="job-list" variants={listVariants} initial="hidden" animate="visible" key={activeTab}>
        {activeTab === 'applied' ? (
          myApplications.length > 0 ? myApplications.map(app => (
            <motion.div key={app.id} variants={itemVariants}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1}>
                <div className="job-card neon-glass spotlight-card">
                  <h3>{app.job.title}</h3>
                  <div className="company">{app.job.location} • {app.job.salary}</div>
                  <p className="desc">Status: <strong style={{ color: 'var(--primary)' }}>{app.status}</strong></p>
                  <p className="desc" style={{ fontSize: '0.75rem', marginTop: 'auto' }}>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
              </Tilt>
            </motion.div>
          )) : <p>You haven't applied to any jobs yet.</p>
        ) : (
          jobs.length > 0 ? jobs.map((item, index) => {
            const job = item.job || item;
            const score = item.score;
            return (
              <motion.div key={job.id || index} variants={itemVariants}>
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1}>
                  <div className="job-card neon-glass spotlight-card">
                    {score && <div className="match-score">{score.toFixed(1)}% Match</div>}
                    <h3>{job.title}</h3>
                    <div className="company">{job.location} • {job.salary}</div>
                    <p className="desc">{job.description.substring(0, 100)}...</p>
                    <button className="btn-primary" onClick={() => handleApply(job.id)}>Apply Now</button>
                  </div>
                </Tilt>
              </motion.div>
            );
          }) : <p>No jobs available.</p>
        )}
      </motion.div>
    </motion.div>
  );
}
