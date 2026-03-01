import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-wrapper">

      {/* App section */}
      <div className="about-hero">
        <div className="about-eyebrow">About</div>
        <h1 className="about-headline">
          Built for travelers,<br />
          <span className="about-accent">by a traveler.</span>
        </h1>
        <p className="about-subhead">
          WanderWise was born out of a simple frustration: travel planning was scattered across
          spreadsheets, notes apps, and memory. There had to be a better way.
        </p>
      </div>

      <div className="about-divider" />

      {/* App features summary */}
      <div className="about-section">
        <div className="about-section-label">The App</div>
        <h2 className="about-section-heading">What WanderWise does</h2>
        <p className="about-body">
          WanderWise is a full-featured travel planning platform designed to keep everything about your
          trip in one place. Plan your itinerary day by day, map your destinations, build smart packing
          lists you can reuse across trips, collaborate with travel companions in real time, and track
          everything from departure prep to daily schedules.
        </p>
        <p className="about-body">
          Whether you're planning a Caribbean cruise, an Alaskan adventure, or a weekend road trip —
          WanderWise adapts to how you travel, not the other way around.
        </p>
      </div>

      <div className="about-divider" />

      {/* Developer section */}
      <div className="about-section">
        <div className="about-section-label">The Developer</div>
        <h2 className="about-section-heading">Hi, I'm Adam.</h2>
        <div className="about-dev-card">
          <div className="about-dev-content">
            <p className="about-body">
              I'm a full-stack engineer with over a decade of experience building production systems —
              from enterprise real estate platforms to IoT sensor networks. I spent nine years at FBS Systems
              (creators of Flexmls), advancing from technical support to Solutions Manager, where I worked
              alongside hundreds of real estate professionals and built deep expertise in data-driven platforms.
            </p>
            <p className="about-body">
              Most recently I served as CTO at RJ Energy Solutions, where I architected and deployed their
              complete IoT platform from the ground up — real-time data processing, customer dashboards,
              and sensor networks across 50+ production sites.
            </p>
            <p className="about-body">
              I built WanderWise because Tammy and I love to travel — 11 cruises and counting — and I wanted
              a tool that actually matched how we plan. It started as a bootcamp project. It became something
              we actually use.
            </p>
            <div className="about-links">
              <a href="mailto:adamtxl@hotmail.com" className="about-link">
                <span>✉</span> adamtxl@hotmail.com
              </a>
              <a href="https://www.linkedin.com/in/adam-troxell1/" target="_blank" rel="noreferrer" className="about-link">
                <span>↗</span> LinkedIn
              </a>
              <a href="https://troxellendeavors.com" target="_blank" rel="noreferrer" className="about-link">
                <span>◈</span> troxellendeavors.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="about-divider" />

      {/* Built with */}
      <div className="about-section">
        <div className="about-section-label">Tech Stack</div>
        <h2 className="about-section-heading">Built with</h2>
        <div className="about-stack">
          {['React', 'Redux', 'Node.js', 'Express', 'PostgreSQL', 'Neon', 'Fly.io'].map((tech) => (
            <div className="about-stack-item" key={tech}>{tech}</div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AboutPage;
