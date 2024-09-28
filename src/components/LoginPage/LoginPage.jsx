import React, { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

function LoginPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.id) {
      navigate('/trips');
    }
  }, [user.id]); // Only run when user.id changes

  return (
    <div>
      <LoginForm />

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