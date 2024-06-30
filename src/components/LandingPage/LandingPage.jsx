import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';
import { Button } from 'react-bootstrap';
// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className="container op">
      <h2>{heading}</h2>

      <div className="grid">
        <div className="grid-col grid-col_8">
          <p className='summer'>
           Welcome To WanderWise! We are a travel planning app that helps you plan your trips with ease. New Users can register for an account to the right. Already a member? Click the login button to sign in.
          </p>

          
        </div>
        <div className="grid-col grid-col_4">
          <RegisterForm />

          <center className='summer'>
            <h4>Already a Member?</h4>
            <Button className="btn" onClick={onLogin}>
              Login
            </Button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
