import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as THREE from 'three';
import NET from 'vanta/src/vanta.net';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a' || e.target.closest('button') || e.target.closest('a') || e.target.closest('.job-card') || e.target.closest('.feature-card')) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      className={`custom-cursor ${active ? 'active' : ''}`} 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

function App() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(NET({
        el: myRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x6366f1,
        backgroundColor: 0x030712,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00
      }));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <BrowserRouter>
      <CustomCursor />
      <div ref={myRef} className="vanta-bg"></div>
      <div className="animated-bg-overlay"></div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
