import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoPage.css';

function InfoPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '✈️',
      title: 'Trip Management',
      desc: 'Create and organize upcoming trips with dates, locations, and categories. Everything in one place.',
    },
    {
      icon: '📅',
      title: 'Daily Itineraries',
      desc: 'Build day-by-day plans for each trip. Add activities, times, and notes for every stop.',
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      desc: 'Pin your destinations on a map. Visualize your route and explore your stops before you arrive.',
    },
    {
      icon: '🧳',
      title: 'Smart Packing Lists',
      desc: 'Build reusable packing lists. Save your go-to items and customize per trip — never forget anything again.',
    },
    {
      icon: '👥',
      title: 'Collaborate',
      desc: 'Invite travel companions to plan together. Everyone stays on the same page, in real time.',
    },
    {
      icon: '📋',
      title: 'Checklists',
      desc: 'Track what\'s done and what\'s left. Pre-departure checklists keep you organized on the way out the door.',
    },
  ];

  const steps = [
    { num: '01', title: 'Create a Trip', desc: 'Add your destination, travel dates, and trip type to get started.' },
    { num: '02', title: 'Build Your Itinerary', desc: 'Plan each day with activities, locations, and times.' },
    { num: '03', title: 'Map Your Journey', desc: 'Pin every destination and visualize your route.' },
    { num: '04', title: 'Pack Smarter', desc: 'Build your packing list and check items off as you go.' },
    { num: '05', title: 'Invite Companions', desc: 'Add collaborators so everyone can plan and track together.' },
    { num: '06', title: 'Travel Confidently', desc: 'Arrive prepared. Focus on the adventure, not the logistics.' },
  ];

  return (
    <div className="info-wrapper">

      {/* Hero */}
      <div className="info-hero">
        <div className="info-eyebrow">How it works</div>
        <h1 className="info-headline">
          Everything you need to<br />
          <span className="info-accent">plan the perfect trip.</span>
        </h1>
        <p className="info-subhead">
          WanderWise streamlines every part of travel planning — from first idea to final checklist.
          Whether it's a weekend road trip or a two-week cruise, you'll arrive prepared.
        </p>
        <button className="btn-info-primary" onClick={() => navigate('/trips')}>
          Go to My Trips →
        </button>
      </div>

      {/* Features grid */}
      <div className="info-section">
        <div className="info-section-label">Features</div>
        <h2 className="info-section-heading">Everything in one place</h2>
        <div className="info-features-grid">
          {features.map((f, i) => (
            <div className="info-feature-card" key={i}>
              <div className="info-feature-icon">{f.icon}</div>
              <h3 className="info-feature-title">{f.title}</h3>
              <p className="info-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="info-section">
        <div className="info-section-label">Getting Started</div>
        <h2 className="info-section-heading">From planning to adventure in six steps</h2>
        <div className="info-steps">
          {steps.map((s, i) => (
            <div className="info-step" key={i}>
              <div className="info-step-num">{s.num}</div>
              <div className="info-step-content">
                <div className="info-step-title">{s.title}</div>
                <div className="info-step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="info-cta">
        <div className="info-cta-mark">✦</div>
        <h2 className="info-cta-heading">Ready to start planning?</h2>
        <p className="info-cta-sub">Your next adventure is waiting.</p>
        <button className="btn-info-primary" onClick={() => navigate('/edit-create-trips')}>
          Create Your First Trip →
        </button>
      </div>

    </div>
  );
}

export default InfoPage;
