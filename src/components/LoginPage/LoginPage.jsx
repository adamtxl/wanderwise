import React, { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Capture current location
  const user = useSelector((state) => state.user);

  // Get the 'from' value, if present, or default to '/trips'
  const from = location.state?.from?.pathname || '/trips';

  useEffect(() => {
    // If the user is logged in, redirect them back to the 'from' location
    if (user.id) {
      navigate(from); // Redirect to the original location or '/trips'
    }
  }, [user.id, from, navigate]); // Include 'from' and 'navigate' in dependencies

  return (
    <div>
      <LoginForm from={from} /> {/* Pass the 'from' prop to LoginForm */}
      
      <center>
        <Button
          variant='primary'
          className='button-proceed'
          onClick={() => navigate('/register')}
        >
          Switch to Register
        </Button>
      </center>
    </div>
  );
}

export default LoginPage;