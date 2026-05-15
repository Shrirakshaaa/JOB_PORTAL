import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import '../styles/Dashboard.css';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('my-jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'RECRUITER') {
      navigate('/login');
    } else {
      fetchJobs();
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

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/jobs', {
        title, description, requirements, location, salary
      }, config);
      alert('Job posted successfully!');
      setTitle(''); setDescription(''); setRequirements(''); setLocation(''); setSalary('');
      setActiveTab('my-jobs');
      fetchJobs();
    } catch (err) {
      console.error('Error posting job', err);
      alert('Failed to post job.');
    }
  };

  const viewApplications = async (job) => {
    setSelectedJob(job);
    try {
      const res = await api.get(`/api/applications/job/${job.id}`, config);
      setApplications(res.data);
      setActiveTab('view-applications');
    } catch (err) {
      console.error('Error fetching applications', err);
      alert('Failed to fetch applications.');
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/api/applications/${appId}/status?status=${status}`, {}, config);
      viewApplications(selectedJob);
    } catch (err) {
      console.error('Error updating status', err);
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
        <h1>Recruiter Dashboard</h1>
        <button className="btn-secondary neon-glass" onClick={handleLogout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'my-jobs' ? 'active' : ''}`} onClick={() => setActiveTab('my-jobs')}>My Jobs</button>
        <button className={`tab ${activeTab === 'post-job' ? 'active' : ''}`} onClick={() => setActiveTab('post-job')}>Post New Job</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'my-jobs' && (
          <motion.div className="job-list" variants={listVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            {jobs.length > 0 ? jobs.map(job => (
              <motion.div key={job.id} variants={itemVariants}>
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1}>
                  <div className="job-card neon-glass spotlight-card">
                    <h3>{job.title}</h3>
                    <div className="company">{job.location} • {job.salary}</div>
                    <p className="desc">{job.description.substring(0, 100)}...</p>
                    <button className="btn-secondary" onClick={() => viewApplications(job)}>View Applicants</button>
                  </div>
                </Tilt>
              </motion.div>
            )) : <p>You haven't posted any jobs yet.</p>}
          </motion.div>
        )}

        {activeTab === 'post-job' && (
          <motion.div 
            className="upload-section neon-glass" 
            style={{ textAlign: 'left' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>Create a New Job Posting</h3>
            <form onSubmit={handlePostJob} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Job Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="neon-glass" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className="neon-glass" />
              </div>
              <div className="form-group">
                <label>Salary</label>
                <input type="text" value={salary} onChange={e => setSalary(e.target.value)} required className="neon-glass" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required className="neon-glass" style={{ width: '100%', padding: '0.75rem', minHeight: '100px', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
              </div>
              <div className="form-group">
                <label>Requirements / Skills</label>
                <textarea value={requirements} onChange={e => setRequirements(e.target.value)} required className="neon-glass" style={{ width: '100%', padding: '0.75rem', minHeight: '100px', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
              </div>
              <button type="submit" className="btn-primary">Publish Job</button>
            </form>
          </motion.div>
        )}

        {activeTab === 'view-applications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="btn-secondary neon-glass" onClick={() => setActiveTab('my-jobs')} style={{ marginBottom: '1rem' }}>&larr; Back to Jobs</button>
            <h3>Applicants for: {selectedJob?.title}</h3>
            <motion.div className="job-list" variants={listVariants} initial="hidden" animate="visible" style={{ marginTop: '1.5rem' }}>
              {applications.length > 0 ? applications.map(app => (
                <motion.div key={app.id} variants={itemVariants}>
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1}>
                    <div className="job-card neon-glass spotlight-card">
                      <h3>{app.candidate.name}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{app.candidate.email}</p>
                      <div className="match-score" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
                        AI Match Score: {app.matchScore ? app.matchScore.toFixed(1) : 'N/A'}%
                      </div>
                      <p className="desc" style={{ marginBottom: '0.5rem' }}>Resume: <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>View</a></p>
                      <p className="desc">Current Status: <strong>{app.status}</strong></p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button className="btn-secondary" onClick={() => updateStatus(app.id, 'REVIEWED')} style={{ flex: 1, padding: '0.25rem' }}>Review</button>
                        <button className="btn-secondary" onClick={() => updateStatus(app.id, 'ACCEPTED')} style={{ flex: 1, padding: '0.25rem', borderColor: '#10b981', color: '#10b981' }}>Accept</button>
                        <button className="btn-secondary" onClick={() => updateStatus(app.id, 'REJECTED')} style={{ flex: 1, padding: '0.25rem', borderColor: '#ef4444', color: '#ef4444' }}>Reject</button>
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              )) : <p>No applications yet.</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
