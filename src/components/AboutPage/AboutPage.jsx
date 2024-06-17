import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
        <p>WanderWise takes the guesswork out of trip preparation!</p>
      </div>
    </div>
  );
}

export default AboutPage;
