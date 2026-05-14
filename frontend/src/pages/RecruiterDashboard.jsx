import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('my-jobs'); // 'my-jobs', 'post-job', 'view-applications'
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Post Job Form State
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

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/jobs', {
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
      const res = await axios.get(`http://localhost:8080/api/applications/job/${job.id}`, config);
      setApplications(res.data);
      setActiveTab('view-applications');
    } catch (err) {
      console.error('Error fetching applications', err);
      alert('Failed to fetch applications or you do not have permission.');
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/applications/${appId}/status?status=${status}`, {}, config);
      alert('Status updated!');
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Recruiter Dashboard</h1>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'my-jobs' ? 'active' : ''}`} onClick={() => setActiveTab('my-jobs')}>My Jobs</button>
        <button className={`tab ${activeTab === 'post-job' ? 'active' : ''}`} onClick={() => setActiveTab('post-job')}>Post New Job</button>
      </div>

      {activeTab === 'my-jobs' && (
        <div className="job-list">
          {jobs.length > 0 ? jobs.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <div className="company">{job.location} • {job.salary}</div>
              <p className="desc">{job.description.substring(0, 100)}...</p>
              <button className="btn-secondary" onClick={() => viewApplications(job)}>View Applicants</button>
            </div>
          )) : <p>You haven't posted any jobs yet.</p>}
        </div>
      )}

      {activeTab === 'post-job' && (
        <div className="upload-section" style={{ textAlign: 'left' }}>
          <h3>Create a New Job Posting</h3>
          <form onSubmit={handlePostJob} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Salary</label>
              <input type="text" value={salary} onChange={e => setSalary(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', minHeight: '100px' }}
              />
            </div>
            <div className="form-group">
              <label>Requirements / Skills (Used for AI Matching)</label>
              <textarea 
                value={requirements} 
                onChange={e => setRequirements(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', minHeight: '100px' }}
              />
            </div>
            <button type="submit" className="btn-primary">Publish Job</button>
          </form>
        </div>
      )}

      {activeTab === 'view-applications' && (
        <div>
          <button className="btn-secondary" onClick={() => setActiveTab('my-jobs')} style={{ marginBottom: '1rem' }}>&larr; Back to Jobs</button>
          <h3>Applicants for: {selectedJob?.title}</h3>
          <div className="job-list" style={{ marginTop: '1.5rem' }}>
            {applications.length > 0 ? applications.map(app => (
              <div key={app.id} className="job-card">
                <h3>{app.candidate.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{app.candidate.email}</p>
                <div className="match-score" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
                  AI Match Score: {app.matchScore ? app.matchScore.toFixed(1) : 'N/A'}%
                </div>
                <p className="desc" style={{ marginBottom: '0.5rem' }}>Resume: <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>View Document</a></p>
                <p className="desc">Current Status: <strong>{app.status}</strong></p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button className="btn-secondary" onClick={() => updateStatus(app.id, 'REVIEWED')} style={{ flex: 1, padding: '0.25rem' }}>Review</button>
                  <button className="btn-secondary" onClick={() => updateStatus(app.id, 'ACCEPTED')} style={{ flex: 1, padding: '0.25rem', borderColor: '#10b981', color: '#10b981' }}>Accept</button>
                  <button className="btn-secondary" onClick={() => updateStatus(app.id, 'REJECTED')} style={{ flex: 1, padding: '0.25rem', borderColor: '#ef4444', color: '#ef4444' }}>Reject</button>
                </div>
              </div>
            )) : <p>No applications yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
