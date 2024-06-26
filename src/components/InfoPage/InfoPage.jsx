import React from 'react';

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function InfoPage() {
  return (
    <div className="container">
      <p className='summer'>This app is designed to streamline your travel preparation process. It offers a dynamic packing list feature that allows you to add, update, and manage your items effortlessly, ensuring you're always prepared for your trips. Created with the traveler's convenience in mind, this app aims to eliminate the common issue of forgetting essential items. Whether you're planning a short getaway or a long journey, our app makes sure you have everything you need right at your fingertips. Start simplifying your travel planning today!</p>
    </div>
  );
}

export default InfoPage;
