import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

export default function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'recommended', 'applied'
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

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/jobs', config);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs', err);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/applications/my-applications', config);
      setMyApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications', err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGetRecommendations = async () => {
    if (!file) return alert('Please select a resume file first.');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8080/api/jobs/recommended', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      // The recommended API returns a list of JobMatchResult { job, score }
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
      await axios.post('http://localhost:8080/api/applications', {
        jobId: jobId,
        resumeUrl: 'uploaded-resume.pdf' // Hardcoded for simplicity in this demo phase
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => { setActiveTab('all'); fetchJobs(); }}>All Jobs</button>
        <button className={`tab ${activeTab === 'recommended' ? 'active' : ''}`} onClick={() => setActiveTab('recommended')}>Recommendations</button>
        <button className={`tab ${activeTab === 'applied' ? 'active' : ''}`} onClick={() => setActiveTab('applied')}>My Applications</button>
      </div>

      {activeTab !== 'applied' && (
        <div className="upload-section">
          <h3>Get AI Powered Job Recommendations</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '0.5rem' }}>Upload your resume and let our engine match your skills with the perfect job.</p>
          <input type="file" onChange={handleFileChange} accept=".pdf,.docx" style={{ marginBottom: '1rem' }} />
          <br />
          <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 2rem' }} onClick={handleGetRecommendations} disabled={loading}>
            {loading ? 'Analyzing...' : 'Find Matches'}
          </button>
        </div>
      )}

      <div className="job-list">
        {activeTab === 'applied' ? (
          myApplications.length > 0 ? myApplications.map(app => (
            <div key={app.id} className="job-card">
              <h3>{app.job.title}</h3>
              <div className="company">{app.job.location} • {app.job.salary}</div>
              <p className="desc">Status: <strong style={{ color: 'var(--primary)' }}>{app.status}</strong></p>
              <p className="desc" style={{ fontSize: '0.75rem', marginTop: 'auto' }}>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
          )) : <p>You haven't applied to any jobs yet.</p>
        ) : (
          jobs.length > 0 ? jobs.map(item => {
            // Check if it's a recommended job format (with score) or normal job
            const job = item.job || item;
            const score = item.score;
            
            return (
              <div key={job.id} className="job-card">
                {score && <div className="match-score">{score.toFixed(1)}% Match</div>}
                <h3>{job.title}</h3>
                <div className="company">{job.location} • {job.salary}</div>
                <p className="desc">{job.description.substring(0, 100)}...</p>
                <button className="btn-primary" onClick={() => handleApply(job.id)}>Apply Now</button>
              </div>
            );
          }) : <p>No jobs available.</p>
        )}
      </div>
    </div>
  );
}
